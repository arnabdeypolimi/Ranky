import React, { Component } from 'react';

import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import RankingScreen from './RankingScreen';


const RootStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Ranking: {
      screen: RankingScreen,
    },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
