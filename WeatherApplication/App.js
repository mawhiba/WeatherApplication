import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';


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
      errorMessage: null,
      //weatherDescription: null,
      weatherIcon:null,
    };
  }



  componentDidMount() {

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }


  }

  //Get current location
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
    let longitude = this.state.location.coords.longitude;
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
    const weatherDescription = this.state.dataSource.current.weather_descriptions[0];
    let icon = null
    console.log(typeof weatherDescription)
    
    if (weatherDescription === 'Sunny') {
      icon = <Ionicons name="ios-sunny" size={100} color="white" />
        
    }
    else if (weatherDescription === 'Overcast') {
      icon = <Ionicons name="ios-cloudy" size={100} color="white" />
    }
    else if (weatherDescription === 'Partly cloudy') {
      icon = <Ionicons name="ios-partly-sunny" size={100} color="white" />
    }
    else if (weatherDescription === 'Rain' || 'Rainy' || 'Raining') {
      icon = <Ionicons name="ios-rainy" size={100} color="white" />
    }
    else if (weatherDescription === 'Fog' || 'Fogy') {
      icon = <Ionicons name="weather-fog" size={100} color="white" />
    }
    else if (weatherDescription === 'Lightning') {
      icon = <Ionicons name="weather-lightning" size={100} color="white" />
    }
    else if (weatherDescription === 'Lightning') {
      icon = <Ionicons name="weather-lightning-rainy" size={100} color="white" />
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
            style={styles.textBox}
            placeholder="Enter city name"
            onChangeText={(text) => this.setState({ searchInput: text })}
            value={this.state.searchInput}
            onSubmitEditing={() => this.getWeatherInfo()}
          />
        </View>
        <View style={styles.container2}>
          {icon}
          <Text style={styles.wethersDescription}>{this.state.dataSource.current.weather_descriptions[0]}</Text>
          <Text style={styles.temp}>{this.state.dataSource.current.temperature}</Text>
          <Text style={styles.cityName}>{this.state.dataSource.location.name}</Text>
          <Text style={styles.humidity}>Humidity : {this.state.dataSource.current.humidity}%</Text>
          <Text style={styles.humidity}>Wind Speed : {this.state.dataSource.current.wind_speed} mph</Text>
        </View>
        </ImageBackground>
    );
  }
}





const styles = StyleSheet.create({
  container1: {
    //flex: 1,
    flexDirection: 'row',
    marginTop: 30,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#rgba(255,255 ,255,0.3)',
    borderColor: '#d6d7da',
    borderRadius: 6,
    height: 30,
    width: 280,
  },
  container2: {
    flex: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    // borderColor: 'white',
    // borderWidth: 1,
  },
  container3: {
    flex: 2,
    alignItems: 'center',
    // width: 300,
    // height: 300,
    //alignItems: 'flex-end',
    //paddingRight: 30,
  },
  

  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',

  },
  textBox: {
    height: 30,
    width: 280,
    padding: 5,
    //color: 'darkgray',
  },
  temp: {
    //marginTop: 50,
    //alignItems: 'flex-end',
    fontSize: 150,
    fontFamily: 'Avenir-Heavy',
    color: 'white',
  },
  cityName: {
    //marginTop: 20,
    fontSize: 45,
    fontFamily: 'AvenirNext-Regular',
    color: 'white'
  },
  wethersDescription: {
    //marginTop: 30,
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    color: 'white'
  },
  humidity: {
    fontSize: 20,
    fontFamily: 'AvenirNext-Regular',
    color: 'white',
  }
});
