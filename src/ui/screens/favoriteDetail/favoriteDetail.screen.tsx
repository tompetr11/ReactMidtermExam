import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { GenericCard } from '../../atoms/genericCard/genericCard.atom'; // Modifica con il file appropriato
import { Ionicons } from '@expo/vector-icons';
import Button from '../../atoms/button/button.atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../detail/detail.styles';

interface CartDetailProduct {
  discountPercentage: number;
  discountedTotal: number;
  id: number;
  price: number;
  quantity: number;
  thumbnail: string;
  title: string;
  total: number;
}

interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.FavoriteDetail>;
  route: RouteProp<MainParamList, Screen.FavoriteDetail>;
}

const PURCHASED_ITEMS_KEY = '@purchased_items';

const FavoriteDetailScreen = ({ navigation, route }: Props) => {
  const { idsArray } = route.params;
  const [favoriteItems, setFavoriteItems] = useState<CartDetailProduct[]>([]);
  const [purchaseMessageVisible, setPurchaseMessageVisible] = useState(false);

  const currentIndex = useMemo(() => idsArray.indexOf(route.params.id), [route.params.id, idsArray]);

  const backIconColor = useMemo(() => (currentIndex > 0 ? 'black' : '#cccccc'), [currentIndex]);
  const forwardIconColor = useMemo(
    () => (currentIndex < idsArray.length - 1 ? 'black' : '#cccccc'),
    [currentIndex, idsArray.length]
  );

  const handleBack = useCallback(() => {
    const nextId = idsArray[currentIndex - 1];
    if (!nextId) {
      return;
    }
    navigation.setParams({ id: nextId });
  }, [currentIndex, idsArray, navigation]);

  const handleNext = useCallback(() => {
    const nextId = idsArray[currentIndex + 1];
    if (!nextId) {
      return;
    }
    navigation.setParams({ id: nextId });
  }, [currentIndex, idsArray, navigation]);

  const savePurchasedItems = async (newItems: CartDetailProduct[]) => {
    try {
      const existingItemsString = await AsyncStorage.getItem(PURCHASED_ITEMS_KEY);
      const existingItems: CartDetailProduct[] = existingItemsString
        ? JSON.parse(existingItemsString)
        : [];

      const updatedItems = [...existingItems, ...newItems];
      await AsyncStorage.setItem(PURCHASED_ITEMS_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving purchased items:', error);
    }
  };

  const handlePurchase = async () => {
    if (favoriteItems.length > 0) {
      await savePurchasedItems(favoriteItems);
      setPurchaseMessageVisible(true);
      setTimeout(() => {
        setPurchaseMessageVisible(false);
      }, 1000);
    }
  };

  useEffect(() => {
    const favoriteItems = idsArray.map(id => {
      return {
        id,
        // Altri dettagli del prodotto, puoi popolare con dati statici per esempio
        thumbnail: `https://example.com/images/product_${id}.jpg`,
        title: `Product ${id}`,
        price: 10.0,
        discountPercentage: 0,
        discountedTotal: 10.0,
        quantity: 1,
        total: 10.0,
      };
    });

    setFavoriteItems(favoriteItems);
  }, [idsArray]);

  const renderFavoriteItem = useCallback(({ item  }) => {
    return (
      <View style={styles.detailItem}>
        <GenericCard
          title={item.title}
          subTitle={`Price: €${item.price}`}
          image={{ uri: item.thumbnail }}
          backgroundColor={'#2e67bd'}
        />
      </View>
    );
  }, []);

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  return (
    <View style={styles.container}>
      <View style={styles.navigatorContainer}>
        <Ionicons
          name={'chevron-back-circle'}
          size={24}
          onPress={handleBack}
          color={backIconColor}
        />
        <Ionicons
          name={'chevron-forward-circle'}
          size={24}
          onPress={handleNext}
          color={forwardIconColor}
        />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={favoriteItems}
        renderItem={renderFavoriteItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={(item) => item.id.toString()}
      />

      {purchaseMessageVisible && (
        <View style={styles.overlay}>
          <View style={styles.purchaseMessageContainer}>
            <Text style={styles.purchaseMessage}>Acquisto effettuato!</Text>
          </View>
        </View>
      )}

      <Button title={'Buy'} onPress={handlePurchase}>
        <Text>{'Buy'}</Text>
      </Button>
      <View style={styles.spacer}></View>
      <Button title={'Go Back'} onPress={navigation.goBack}>
        <Text>{'Go Back'}</Text>
      </Button>
      <View style={styles.spacer}></View>
    </View>
  );
};

export default FavoriteDetailScreen;
