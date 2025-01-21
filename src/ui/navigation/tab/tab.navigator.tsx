import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParams, Screen } from '../types';
import HomeScreen from '../../screens/home/home.screen';
import BuyedScreen from '../../screens/buyed/buyed.screen';
import { Ionicons } from '@expo/vector-icons';
import FavoritesScreen from '../../screens/favorites/favorites.screen';

const Tab = createBottomTabNavigator<TabParams>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: 'black',
        },
        headerTintColor: 'white',
        tabBarStyle: {
          backgroundColor: 'black',
        },
        tabBarShowLabel: false,
        tabBarIconStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused }) => {
          const iconName: 'home' | 'heart' | 'cart' =
            route.name === Screen.Home
              ? 'home'
              : route.name === Screen.Favorites
                ? 'heart'
                : 'cart';

          return <Ionicons name={iconName} size={24} color={focused ? '#FFFFFF' : '#D3D3D3'} />;
        },
      })}>
      <Tab.Screen name={Screen.Home} component={HomeScreen} />
      <Tab.Screen name={Screen.Buyed} component={BuyedScreen} />
      <Tab.Screen name={Screen.Favorites} component={FavoritesScreen} />
    </Tab.Navigator>
  );
}
