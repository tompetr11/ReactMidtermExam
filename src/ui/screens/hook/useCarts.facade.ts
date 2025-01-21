import { useState, useCallback, useEffect } from 'react';
import { PREFERRED_CARTS, PURCHASED_ITEMS } from '../../../core/storage/types';
import { storage } from '../../../core/storage/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: Product[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}
export interface GenericCard{
  id:number;
  title:string;
  price:number;
  quantity:number;
  thumbnail:string;


}

export const useCarts = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [initialCarts, setInitialCarts] = useState<Cart[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [buyedItems, setBuyedItems]=useState<GenericCard[]>([]);

  const refreshCarts = useCallback(async () => {
    try {
      const response = await fetch('https://dummyjson.com/carts');
      const data = await response.json();
      setInitialCarts([...data.carts]);
      setCarts([...data.carts]);
    } catch (error) {
      console.error('Error fetching carts:', error);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await storage.getItem(PREFERRED_CARTS);
      const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavoriteIds(parsedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const loadPurchasedItems = useCallback(async () => {
    try {
      const storedBuyed = storage.getItem(PURCHASED_ITEMS);
      const parsedBuyed = storedBuyed ? JSON.parse(storedBuyed) : [];
      setBuyedItems(parsedBuyed);
      return parsedBuyed;
    } catch (error) {
      console.error('Error loading purchased items:', error);
      return [];
    }
  }, []);
  


  const addPurchasedItems = useCallback(async (items: GenericCard[]) => {
    try {
      if (items.length === 0) {
        setBuyedItems([]);
        storage.setItem(PURCHASED_ITEMS, JSON.stringify([]));
        console.log('Items cleared successfully');
        return;
      }
  
    
      const storedBuyed = storage.getItem(PURCHASED_ITEMS);
      let existingItems: GenericCard[] = [];
      
      try {
        existingItems = storedBuyed ? JSON.parse(storedBuyed) : [];
        console.log('Existing items count:', existingItems.length);
      } catch (parseError) {
        console.error('Error parsing stored items:', parseError);
        existingItems = [];
      }
  
      
      const newItems = items.filter(newItem => 
        !existingItems.some(existingItem => existingItem.id === newItem.id)
      );
      console.log('New items to add:', newItems.length);
  
      if (newItems.length === 0) {
        console.log('No new items to add');
        return;
      }
  
      
      const MAX_ITEMS = 1000; 
      const updatedBuyedItems = [
        ...existingItems,
        ...newItems
      ].slice(-MAX_ITEMS); 
  
     
      const dataSize = JSON.stringify(updatedBuyedItems).length;
      console.log('Data size in bytes:', dataSize);
  
     
      setBuyedItems(updatedBuyedItems);
      storage.setItem(PURCHASED_ITEMS, JSON.stringify(updatedBuyedItems));
      
      console.log('Items updated successfully. Total items:', updatedBuyedItems.length);
    } catch (error) {
      console.error('Error updating purchased items:', error);
      
      
      try {
        const currentItems = storage.getItem(PURCHASED_ITEMS);
        const parsedItems = currentItems ? JSON.parse(currentItems) : [];
        setBuyedItems(parsedItems);
        console.log('Recovered existing items:', parsedItems.length);
      } catch (recoveryError) {
        console.error('Recovery failed:', recoveryError);
        setBuyedItems([]);
      }
    }
  }, []);

  const cleanupOldItems = useCallback(async () => {
    try {
      const storedBuyed = storage.getItem(PURCHASED_ITEMS);
      if (!storedBuyed) return;
  
      const items = JSON.parse(storedBuyed);
      if (items.length > 1000) { 
        const trimmedItems = items.slice(-1000); 
        storage.setItem(PURCHASED_ITEMS, JSON.stringify(trimmedItems));
        setBuyedItems(trimmedItems);
        console.log('Cleaned up old items. Current count:', trimmedItems.length);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }, []);

  useEffect(() => {
    cleanupOldItems();
  }, [cleanupOldItems]);

  const addFavorite = useCallback(
    async (item: Cart) => {
      const updatedFavorites = favoriteIds.includes(item.id)
        ? favoriteIds.filter((id) => id !== item.id)
        : [...favoriteIds, item.id];

      setFavoriteIds(updatedFavorites);
      await storage.setItem(PREFERRED_CARTS, JSON.stringify(updatedFavorites));
    },
    [favoriteIds]
  );

  return {
    carts,
    setCarts,
    initialCarts,
    setInitialCarts,
    favoriteIds,
    refreshCarts,
    loadFavorites,
    addFavorite,
    loadPurchasedItems,
    addPurchasedItems,
    buyedItems,
    setBuyedItems,
  };
};
