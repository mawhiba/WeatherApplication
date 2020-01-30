import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadig: true,
      dataSource: null,
      searchInput: null,
      location: null,
      latitude: null,
      longitude: null,
      errorMessage: null
    };
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    //console.log(this.state.location);
    let latitude = this.state.location.coords.latitude;
    this.setState({ latitude });
    let longitude = this.location.coords.longitude;
    this.setState({ longitude })

    let url = 'http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.latitude + ',' + this.state.longitude
    //console.log("this is url : ",url)
    return fetch(url)
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON)
        this.setState({
          isLoadig: false,
          dataSource: responseJSON,
        }, function () {

        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  async getWeatherInfo() {
    return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.searchInput)
      .then((response) => response.json())
      .then((responseJSON) => {
        console.log(responseJSON)
        this.setState({
          isLoadig: false,
          dataSource: responseJSON,
        }, function () {

        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoadig) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      )
    }

    // let text = 'Waiting..';
    // if (this.state.errorMessage) {
    //   text = this.state.errorMessage;
    // } else if (this.state.location) {
    //   text = JSON.stringify(this.state.location);
    //   console.log(this.state.location.coords);
    //   console.log(this.state.location.coords.latitude);
    //   console.log(this.state.location.coords.lonitude);
    // }

    return (
      <ImageBackground source={require('./assets/background2.jpg')} style={styles.bgImage}>
        <View style={styles.container1}>
          <TextInput
            style={styles.UserInput}
            placeholder="Enter city name"
            onChangeText={(text) => this.setState({ searchInput: text })}
            value={this.state.searchInput}
            onSubmitEditing={() => this.getWeatherInfo()}
          />
          <Text style={styles.temp}>{this.state.dataSource.current.temperature}</Text>
          <Text style={styles.cityName}>{this.state.dataSource.location.name}</Text>
          

        </View>
      </ImageBackground >
    );
  }
}





const styles = StyleSheet.create({
  container1: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    //backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    padding: 30, 
  },

  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',

  },
  UserInput: {
    height: 30,
    width: 280,
    borderColor: '#d6d7da',
    backgroundColor: '#rgba(255,255 ,255,0.3)',
    //opacity: 1,
    borderRadius: 6,
    //borderWidth: 1,
    padding: 5,
  },
  temp: {
    marginTop: 50,
    fontSize: 80,
    fontFamily: 'Georgia',
    color: 'white'
  },
  cityName: {
    marginTop: 30,
    fontSize: 40,
    fontFamily: 'Georgia',
    color: 'white'
  }
});
