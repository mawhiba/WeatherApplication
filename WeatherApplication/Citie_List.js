import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

export default class CitiesList extends React.Component {
    

    constructor(props) {
        super(props);
        this.state = {
            isLoadig: true,
            dataSource: null,
        };
    }
    componentDidMount(){
        this.getWeatherInfo2(this.props.cityObj.cityName)
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
        return (

            <View style={styles.flatview}>
                <TouchableOpacity style = {styles.TouchableOpacity} onPress={() => this.props.onPressFunction()} >
                    <Text style={styles.listItem}>{this.props.cityObj.cityName}</Text>
                    <Text style={styles.listItem}>{this.state.dataSource.current.temperature}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    flatview: {
        justifyContent: 'center',
        //paddingTop: 5,
        //borderRadius: 2,
    },
    listItem: {
        padding: 10,  
        height: 44,
        fontFamily: 'AvenirNext-Regular',
        fontSize: 18,

    },
    TouchableOpacity: {
        flexDirection: 'row',
    }
})