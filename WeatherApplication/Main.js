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
        //console.log(this.props.cities[0].cityName)
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
        //this.textInput.clear()
        let url = 'http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.latitude + ',' + this.state.longitude
        fetch(url)
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON)
                if (responseJSON.error) {
                    Alert.alert(responseJSON.error.info)
                    return
                }
                this.setState({
                    isLoadig: false,
                    dataSource: responseJSON,
                }, function () {

                });
            })
            .catch((error) => {
                //console.error(error);
                Alert.alert(error);
            });
    }

    async getWeatherInfo() {
        this.textInput.clear()
        if (this.state.searchInput != null) {
            return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.searchInput)
                .then((response) => response.json())
                .then((responseJSON) => {
                    console.log(responseJSON)
                    if (responseJSON.error) {
                        Alert.alert(responseJSON.error.info)
                        return
                    }
                    this.setState({
                        isLoadig: false,
                        dataSource: responseJSON,
                    }, function () {

                    });
                })
                .catch((error) => {
                    //console.error(error);
                    Alert.alert(error);
                });
        }
        else {
            return
        }

    }


    async getWeatherInfo2(cityName) {
        this.textInput.clear()
        this.setState({ isLoadig: true })
        return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + cityName)
            .then((response) => response.json())
            .then((responseJSON) => {
                console.log(responseJSON)
                if (responseJSON.error) {
                    Alert.alert(responseJSON.error.info)
                    return
                }
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

    checkCityAvailability() {
        //Check the reducer is empty or not:
        if (this.props.cities.length === 0) {

            return (
                <View>
                    <TouchableWithoutFeedback onPress={() => this.props.dispatch({ type: AddCity, cityInfo: { city: this.state.dataSource.location.name, temp: this.state.dataSource.current.temperature } })}>
                        <Image source={require('./assets/favorite.png')} style={styles.fav_icon} />
                    </TouchableWithoutFeedback>
                </View>
            )
        }
        else {
            for (let i = 0; i < this.props.cities.length; i++) {

                if (this.props.cities[i].cityName === this.state.dataSource.location.name) {
                    return (
                        <TouchableWithoutFeedback onPress={() => this.props.dispatch({ type: DeleteCity, city: this.state.dataSource.location.name })}>
                            <Image source={require('./assets/star.png')} style={styles.fav_icon2} />
                        </TouchableWithoutFeedback>
                    )
                }
            }
            return (
                <View>
                    <TouchableWithoutFeedback onPress={() => this.props.dispatch({ type: AddCity, cityInfo: { city: this.state.dataSource.location.name, temp: this.state.dataSource.current.temperature } })}>
                        <Image source={require('./assets/favorite.png')} style={styles.fav_icon} />
                    </TouchableWithoutFeedback>
                </View>
            )
        }
    }

    


    render() {
        if (this.state.isLoadig) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    <ActivityIndicator />
                </View>
            )
        }
        const weatherDescription = this.state.dataSource.current.weather_descriptions[0];
        let icon = null
        let cityExsist = this.checkCityAvailability()


        const like = <TouchableWithoutFeedback onPress={() => { this.setState({ buttonPressed: true }); this.props.dispatch({ type: AddCity, cityInfo: { city: this.state.dataSource.location.name, temp: this.state.dataSource.current.temperature } }) }}>
            <Image source={require('./assets/favorite.png')} style={styles.fav_icon} />
        </TouchableWithoutFeedback>

        const dislike = <TouchableWithoutFeedback onPress={() => { this.setState({ buttonPressed: false }); this.props.dispatch({ type: DeleteCity, city: this.state.dataSource.location.name }) }}>
            <Image source={require('./assets/star.png')} style={styles.fav_icon2} />
        </TouchableWithoutFeedback>


        if (weatherDescription === 'Sunny') {
            icon = <Ionicons name="ios-sunny" size={60} color="white" />

        }
        else if (weatherDescription === 'Overcast') {
            icon = <Ionicons name="ios-cloudy" size={60} color="white" />
        }
        else if (weatherDescription === 'Partly cloudy') {
            icon = <Ionicons name="ios-partly-sunny" size={60} color="white" />
        }
        else if (weatherDescription === 'Rain' || 'Rainy' || 'Raining') {
            icon = <Ionicons name="ios-rainy" size={60} color="white" />
        }
        else if (weatherDescription === 'Fog' || 'Fogy') {
            icon = <Ionicons name="weather-fog" size={60} color="white" />
        }
        else if (weatherDescription === 'Lightning') {
            icon = <Ionicons name="weather-lightning" size={60} color="white" />
        }
        else if (weatherDescription === 'Lightning') {
            icon = <Ionicons name="weather-lightning-rainy" size={60} color="white" />
        }


        return (
            <ImageBackground source={require('./assets/background5.jpg')} style={styles.bgImage}>
                <View style={styles.container1}>
                    <View>
                        <TextInput
                            style={styles.textBox}
                            placeholder="Enter city name"
                            onChangeText={(text) => this.setState({ searchInput: text })}
                            onSubmitEditing={() => this.getWeatherInfo()}
                            clearTextOnFocus={true}
                            clearButtonMode='always'
                            ref={input => { this.textInput = input }}
                        />
                    </View>
                    <View>
                        {cityExsist}
                    </View>
                </View>

                <View style={styles.weatherIconContainer}>
                    {icon}
                    <Text style={styles.wethersDescription}>{this.state.dataSource.current.weather_descriptions[0]}</Text>
                </View>
            
                <View style={styles.container2}>
                    <View style={styles.tempContainer}>
                        <Text style={styles.temp}>{this.state.dataSource.current.temperature}</Text>
                    </View>
                    <View style={styles.cityContainer}>
                        <Text style={styles.cityName} adjustsFontSizeToFit={true} numberOfLines={1}>{this.state.dataSource.location.name}</Text>
                        <Text style={styles.countryName} adjustsFontSizeToFit={true} numberOfLines={1}>{this.state.dataSource.location.country}</Text>
                    </View>
                </View>

                <View style={styles.transparentContainer}>
                    <View style={styles.row1}>
                        <Text style={styles.humidity}>Humidity : {this.state.dataSource.current.humidity}%</Text>
                        <Text style={styles.humidity}>Visibility : {this.state.dataSource.current.visibility}%</Text>
                    </View>

                    <View style={styles.row2}>
                        <Text style={styles.humidity}>Wind Speed : {this.state.dataSource.current.wind_speed} mph</Text>
                        <Text style={styles.humidity}>Precip : {this.state.dataSource.current.precip}</Text>
                    </View>

                    <View style={styles.row3}>
                        <Text style={styles.humidity}>Wind Degree : {this.state.dataSource.current.wind_degree}o</Text>
                        <Text style={styles.humidity}>Feels Like : {this.state.dataSource.current.feelslike}o</Text>
                    </View>

                </View>

                <View style = {styles.listIconContainer}>

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
        //flex: 50,
        //justifyContent: 'center',
        //alignItems: 'center',
        flexDirection: 'row',
        paddingTop: 10

    },
    weatherIconContainer: {
        width: 320,
        height: 110,
        // borderColor: 'red',
        // borderWidth: 2,
        alignItems: 'center',
        paddingTop: 10
    },
    tempContainer: {
        //flex: 2,
        //alignItems: 'center',
        width: 170,
        height: 170,
        // borderColor: 'red',
        // borderWidth: 2,
        alignItems: 'center'
    },
    cityContainer: {
        width: 150,
        height: 150,
        // borderColor: 'red',
        // borderWidth: 2,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingRight: 20
    },
    transparentContainer: {
        width: 320,
        height: 150,
        // borderColor: 'red',
        // borderWidth: 2,
        //backgroundColor: '#rgba(255,255 ,255,0.3)',
        alignItems: 'center',
    },
    row1: {
        width: 320,
        height: 50,
        // borderColor: 'red',
        // borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#rgba(255,255 ,255,0.3)',
        paddingLeft: 20,
        paddingRight: 20,
    },
    row2: {
        width: 320,
        height: 50,
        // borderColor: 'red',
        // borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#rgba(255,255 ,255,0.3)',
        marginTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    row3: {
        width: 320,
        height: 50,
        // borderColor: 'red',
        // borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#rgba(255,255 ,255,0.3)',
        marginTop: 5,
        paddingLeft: 20,
        paddingRight: 20,
    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        //opacity: 0.7
    },
    textBox: {
        height: 30,
        width: 260,
        padding: 5,
    },
    temp: {
        fontSize: 120,
        fontFamily: 'Avenir-Heavy',
        color: '#494947',
        paddingLeft: 10
    },
    cityName: {
        fontSize: 40,
        fontFamily: 'AvenirNext-Regular',
        color: '#494947'
    },
    countryName: {
        fontSize: 17,
        fontFamily: 'AvenirNext-Regular',
        color: 'white'
    },
    wethersDescription: {
        fontSize: 20,
        fontFamily: 'AvenirNext-Regular',
        color: 'white'
    },
    humidity: {
        fontSize: 18,
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
    listIconContainer: {
        marginLeft: 15,
        marginTop: 25,
        marginBottom: 15
    },
    list_icon: {
        width: 26,
        height: 26,
        // marginLeft: 15,
        // marginBottom: 15
    }
});
