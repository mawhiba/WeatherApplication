import React from 'react';
import { View } from "react-native";
import Main from "./Main";
import Favorite from "./Favorite";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';

const Screen = createStackNavigator({
  MainScreen: {
    screen: Main,
    navigationOptions: {
      header: null,
    }
  },
  FavoriteScreen: {
    screen: Favorite,
    navigationOptions: {
      title: 'Favorite Screen',
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: '#494947'
      }
    },
    
  },
})

const AppContainer = createAppContainer(Screen)

export default class App extends React.Component {

  render() {
    return (
      <Provider store={configureStore}>
        <View style={{ flex: 1 }}>
          <AppContainer />
        </View>
      </Provider>

    )
  }
}