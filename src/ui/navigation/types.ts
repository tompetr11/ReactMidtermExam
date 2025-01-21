export enum Screen {
  TabNavigator = 'TabNavigator',
  Home = 'Home',
  Detail = 'Detail',
  Buyed = 'history',  // Cambiato da Settings a Buyed
  Favorites = 'Favorites',
  FavoriteDetail = "FavoriteDetail",
}

export type TabParams = {
  [Screen.Home]: {
    hasFavoritesUpdated: boolean;
  };
  [Screen.Buyed]: undefined;  // Cambiato da Settings a Buyed
  [Screen.Favorites]: {
    hasFavoritesUpdated: boolean;
  };
  [Screen.FavoriteDetail]: { 
    id: number;
    idsArray: number[];  // Parametro per la schermata FavoriteDetail, un array di ID
  };
};



export type MainParamList = {
  TabNavigator: undefined;
  [Screen.Detail]: {
    id: number;
    idsArray: number[];
  };
  [Screen.Buyed]: undefined;  // Aggiungi Buyed qui se necessario
  [Screen.FavoriteDetail]: { 
    id: number;
    idsArray: number[];  // Parametro per la schermata FavoriteDetail
  };
};

