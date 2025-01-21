import { Text, View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';

import { GenericCard } from '../../atoms/genericCard/genericCard.atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { buyedStyles } from './buyed.styles';

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Buyed>;
}

interface CartDetailProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

const PURCHASED_ITEMS_KEY = '@purchased_items';

const BuyedScreen = ({ navigation }: Props) => {
  const [purchasedItems, setPurchasedItems] = useState<CartDetailProduct[]>([]);

  const loadPurchasedItems = async () => {
    try {
      const itemsString = await AsyncStorage.getItem(PURCHASED_ITEMS_KEY);
      if (itemsString) {
        const items: CartDetailProduct[] = JSON.parse(itemsString);
        setPurchasedItems(items);
      }
    } catch (error) {
      console.error('Error loading purchased items:', error);
    }
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);

  const savePurchasedItems = async (items: CartDetailProduct[]) => {
    try {
      await AsyncStorage.setItem(PURCHASED_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving purchased items:', error);
    }
  };

  // Funzione per rimuovere tutti gli articoli
  const handleRemoveItems = async () => {
    const updatedItems: CartDetailProduct[] = []; // Array vuoto
    setPurchasedItems(updatedItems); // Rimuovi tutti gli articoli
    await savePurchasedItems(updatedItems); // Salva l'array vuoto in AsyncStorage
  };

  const totalAmount = purchasedItems.reduce((sum, item) => sum + item.price, 0);

  const renderPurchasedItem = useCallback<ListRenderItem<CartDetailProduct>>(
    ({ item }) => (
      <View style={buyedStyles.itemContainer}>
        <View style={buyedStyles.cardContainer}>
          <GenericCard
            title={item.title}
            subTitle={`Price: €${(item.price).toFixed(2)}`}
            image={{ uri: item.thumbnail }}
            backgroundColor={'#2e67bd'}
          />
        </View>
      </View>
    ),
    [purchasedItems]
  );

  return (
    <View style={buyedStyles.container}>
      <Text style={buyedStyles.headerText}>Purchase History</Text>
      <FlatList
        data={purchasedItems}
        renderItem={renderPurchasedItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View style={buyedStyles.separator} />}
      />
      <View style={buyedStyles.spacer}></View>
      
      {/* Clear Button with Trash Icon */}
      <TouchableOpacity style={buyedStyles.clearButton} onPress={handleRemoveItems}>
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
        <Text style={buyedStyles.clearText}>Clear</Text>
      </TouchableOpacity>

      <View style={buyedStyles.spacer}></View>
      
      <View style={buyedStyles.totalContainer}>
        <Text style={buyedStyles.totalText}>Total: €{totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default BuyedScreen;
