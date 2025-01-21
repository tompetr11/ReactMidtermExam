import { FlatList, ListRenderItem, View, Text } from 'react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainParamList, Screen } from '../../navigation/types';
import { RouteProp } from '@react-navigation/native';
import { GenericCard } from '../../atoms/genericCard/genericCard.atom';
import { styles } from './detail.styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../atoms/button/button.atom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCarts } from '../hook/useCarts.facade';

interface CartDetailProduct {
  id: number;
  price: number;
  quantity: number;
  thumbnail: string;
  title: string;
}

interface CartDetail {
  discountedTotal: number;
  id: number;
  products: CartDetailProduct[];
  total: number;
  totalProducts: number;
  totalQuantity: number;
  userId: number;
}


interface Props {
  navigation: NativeStackNavigationProp<MainParamList, Screen.Detail>;
  route: RouteProp<MainParamList, Screen.Detail>;
}

const PURCHASED_ITEMS_KEY = '@purchased_items';

const DetailScreen = ({ navigation, route }: Props) => {
  const {addPurchasedItems}=useCarts();
  const { top, bottom } = useSafeAreaInsets();
  const { id, idsArray } = route.params;
  const [cart, setCart] = useState<CartDetail | null>(null);
  const [purchaseMessageVisible, setPurchaseMessageVisible] = useState(false);

  const currentIndex = useMemo(() => idsArray.indexOf(id), [id, idsArray]);

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

  useEffect(() => {
    fetch('https://dummyjson.com/carts/' + id)
      .then((res) => res.json())
      .then(setCart);
  }, [id]);

  

  const handlePurchase = async () => {
    if (cart?.products) {
      const genericCards = cart.products.map(product => ({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: product.quantity,
        thumbnail: product.thumbnail
      }));
      await addPurchasedItems(genericCards);
      setPurchaseMessageVisible(true);
      setTimeout(() => {
        setPurchaseMessageVisible(false);
      }, 1000);
    }
  };

  const renderDetailItem = useCallback<ListRenderItem<CartDetailProduct>>(({ item }) => {
    return (
      <View style={styles.detailItem}>
        <GenericCard
          title={item.title}
          subTitle={String(item.price)}
          image={{ uri: item.thumbnail }}
          backgroundColor={'#2e67bd'}
        />
      </View>
    );
  }, []);

  const ItemSeparatorComponent = useCallback(() => <View style={styles.itemSeparator}></View>, []);

  return (
    <View style={[styles.container, { marginTop: top, marginBottom: bottom }]}>
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
        data={cart?.products}
        renderItem={renderDetailItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
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

export default DetailScreen;
