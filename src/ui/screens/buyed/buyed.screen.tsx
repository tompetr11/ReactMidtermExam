import { Text, View, FlatList, ListRenderItem, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { GenericCard } from '../../atoms/genericCard/genericCard.atom';
import { Ionicons } from '@expo/vector-icons';
import { buyedStyles } from './buyed.styles';
import { useCarts } from '../hook/useCarts.facade';

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

 

const BuyedScreen = ({ navigation }: Props) => {
  const { loadPurchasedItems,  buyedItems, setBuyedItems, addPurchasedItems } = useCarts();


  useEffect(() => {
    const loadItems = async () => {
      await loadPurchasedItems();
    };
    loadItems();
  }, [loadPurchasedItems]);

 
    const handleRemoveItems = async () => {
      try {
        await addPurchasedItems([]);
        console.log('Items cleared successfully');
      } catch (error) {
        console.error('Error clearing items:', error);
      }
    };

  const totalAmount = buyedItems.reduce((sum, item) => sum + item.price, 0);

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
    [buyedItems]
  );

  return (
    <View style={buyedStyles.container}>
      <Text style={buyedStyles.headerText}>Purchase History</Text>
      <FlatList
        data={buyedItems}
        renderItem={renderPurchasedItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ItemSeparatorComponent={() => <View style={buyedStyles.separator} />}
      />
      <View style={buyedStyles.spacer}></View>

    
      <TouchableOpacity style={buyedStyles.clearButton} onPress={handleRemoveItems}>
        <Ionicons name="trash-outline" size={24} color="#ff4444" />
        <Text style={buyedStyles.clearText}>Clear</Text>
      </TouchableOpacity>

      <View style={buyedStyles.spacer}></View>

     
      <TouchableOpacity style={buyedStyles.refreshButton} onPress={loadPurchasedItems}>
        <Ionicons name="refresh" size={24} color="green" />
        <Text style={buyedStyles.refreshText}>Refresh Page</Text>
      </TouchableOpacity>

      <View style={buyedStyles.spacer}></View>

      <View style={buyedStyles.totalContainer}>
        <Text style={buyedStyles.totalText}>Total: €{totalAmount.toFixed(2)}</Text>
      </View>
    </View>
  );
};

export default BuyedScreen;
