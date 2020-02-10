import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput, Image, ImageBackground, Alert, TouchableWithoutFeedback, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';
import Favorite from "./Favorite";
import { AddCity, DeleteCity, cityInfo } from './constants/index';
import { connect } from "react-redux";

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadig: true,
            dataSource: null,
            forcastDataSource: null,
            searchInput: null,
            location: null,
            latitude: null,
            longitude: null,
            errorMessage: null,
            weatherIcon: null,
            buttonPressed: false,
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

    //Get current location :
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

        //Get current location:
        this.getCurrentLocation();

    };

    getCurrentLocation() {
        let url = 'http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.latitude + ',' + this.state.longitude
        fetch(url)
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

    async getWeatherInfo() {
        this.textInput.clear()
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


    async getWeatherInfo2(cityName) {
        this.setState({ isLoadig: true })
        return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + cityName)
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


        const like = <TouchableWithoutFeedback onPress={() => { this.setState({buttonPressed : true}) ; this.props.dispatch({ type: AddCity, cityInfo: { city: this.state.dataSource.location.name, temp: this.state.dataSource.current.temperature } }) }}>
                        <Image source={require('./assets/favorite.png')} style={styles.fav_icon} />
                    </TouchableWithoutFeedback>

        const dislike = <TouchableWithoutFeedback onPress={() => { this.setState({buttonPressed : false}) ; this.props.dispatch({ type: DeleteCity,  }) }}>
                        <Image source={require('./assets/star.png')} style={styles.fav_icon2} />
                    </TouchableWithoutFeedback>


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


        return (
            <ImageBackground source={require('./assets/background2.jpg')} style={styles.bgImage}>
                <View style={styles.container1}>
                    <View>
                        <TextInput
                            style={styles.textBox}
                            placeholder="Enter city name"
                            onChangeText={(text) => this.setState({ searchInput: text })}
                            value={this.state.searchInput}
                            onSubmitEditing={() => this.getWeatherInfo()}
                            clearTextOnFocus={true}
                            clearButtonMode='always'
                            ref={input => { this.textInput = input }}
                        />
                    </View>

                    <View>
                        {this.state.buttonPressed ? dislike : like}
                    </View>

                </View>

                <View style={styles.container2}>
                    {icon}
                    <Text style={styles.wethersDescription}>{this.state.dataSource.current.weather_descriptions[0]}</Text>
                    <Text style={styles.temp}>{this.state.dataSource.current.temperature}</Text>
                    <Text style={styles.cityName}>{this.state.dataSource.location.name}</Text>
                    <Text style={styles.humidity}>Humidity : {this.state.dataSource.current.humidity}%</Text>
                    <Text style={styles.humidity}>Wind Speed : {this.state.dataSource.current.wind_speed} mph</Text>
                </View>

                <View>

                    <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('FavoriteScreen', {
                        name: 'Mawhiba',
                        text: "hello from Main",
                        onGetWeatherInfoFromFav: (city_name) => this.getWeatherInfo2(city_name),

                    })}>
                        <Image source={require('./assets/list.png')} style={styles.list_icon} />
                    </TouchableWithoutFeedback>

                </View>
            </ImageBackground>
        );
    }
}

const props = store => ({
    cities: store.cities,
})


export default connect(props)(Main);


const styles = StyleSheet.create({
    container1: {
        //flex: 1,
        flexDirection: 'row',
        marginTop: 30,
        marginLeft: 15,
        // justifyContent: 'center',
        // alignSelf: 'center',
        backgroundColor: '#rgba(255,255 ,255,0.3)',
        borderColor: '#d6d7da',
        borderRadius: 6,
        height: 30,
        width: 260,
    },
    container2: {
        flex: 50,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    container3: {
        flex: 2,
        alignItems: 'center',
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    textBox: {
        height: 30,
        width: 260,
        padding: 5,
    },
    temp: {
        fontSize: 150,
        fontFamily: 'Avenir-Heavy',
        color: 'white',
    },
    cityName: {
        fontSize: 45,
        fontFamily: 'AvenirNext-Regular',
        color: 'white'
    },
    wethersDescription: {
        fontSize: 20,
        fontFamily: 'AvenirNext-Regular',
        color: 'white'
    },
    humidity: {
        fontSize: 20,
        fontFamily: 'AvenirNext-Regular',
        color: 'white',
    },
    fav_icon: {
        width: 26,
        height: 26,
        marginLeft: 7,
        marginTop: 1
    },
    fav_icon2: {
        width: 26,
        height: 26,
        marginLeft: 7,
        marginTop: 1,
        position: 'absolute'
    },
    list_icon: {
        width: 26,
        height: 26,
        marginLeft: 15,
        marginBottom: 15
    }
});