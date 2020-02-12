import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Animated } from "react-native";
import Swipeable from 'react-native-gesture-handler/Swipeable'
import { Ionicons } from '@expo/vector-icons';
import { AddCity, DeleteCity, cityInfo } from './constants/index';
import { connect } from "react-redux";
import Swipeout from 'react-native-swipeout';

export default class CitiesList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isLoadig: true,
            dataSource: null,
        };
    }
    componentDidMount() {
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

        
        const RightActions = (props) => {
            const scale = props.dragX.interpolate({
                inputRange: [-100, 0],
                outputRange: [1, 0],
                extrapolate: 'clamp'
            });
            return (
                <TouchableOpacity onPress={() => this.props.pressToDelete()}>
                    <View style={styles.rightAction}>
                        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>Delete</Animated.Text>
                    </View>
                </TouchableOpacity>
            )
        };

        return (
            <Swipeable renderRightActions={(progress, dragX) => <RightActions progress={progress} dragX={dragX}/>} >
                <View style={styles.container}>
                    <TouchableOpacity style={styles.TouchableOpacity} onPress={() => this.props.onPressFunction()} >
                        <Text style={styles.cityName}>{this.props.cityObj.cityName}</Text>
                        <Text style={styles.cityTemp}>{this.state.dataSource.current.temperature}</Text>
                    </TouchableOpacity>
                </View>
            </Swipeable>
        );

        // return (

        //     <View style={styles.container}>
        //         <TouchableOpacity style={styles.TouchableOpacity} onPress={() => this.props.onPressFunction()} >
        //             <Text style={styles.text}>{this.props.cityObj.cityName}</Text>
        //             <Text style={styles.text}>{this.state.dataSource.current.temperature}</Text>
        //         </TouchableOpacity>
        //     </View>


        // )
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#rgba(255,255 ,255,0.8)',
        paddingHorizontal: 10,
        paddingVertical: 20,
        marginTop: 10,
    },
    cityName: {
        color: "#494947",
        fontSize: 15,
        paddingLeft: 10
    },
    cityTemp: {
        color: "#494947",
        fontSize: 15,
        paddingRight: 20
    },
    seperator: {
        flex: 1,
        height: 1,
        backgroundColor: "#e4e4e4",
        marginLeft: 10
    },
    leftAction: {
        backgroundColor: '#388e3c',
        justifyContent: 'center',
        flex: 1,
    },
    rightAction: {
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    actionText: {
        color: '#fff',
        fontWeight: '600',
        padding: 20,
    },
    TouchableOpacity: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    }
});

export const Seperator = () => <View style={styles.seperator} />;

// const styles = StyleSheet.create({
//     flatview: {
//         justifyContent: 'center',
//         //paddingTop: 5,
//         //borderRadius: 2,
//     },
//     listItem: {
//         padding: 10,  
//         height: 44,
//         fontFamily: 'AvenirNext-Regular',
//         fontSize: 18,

//     },
//     TouchableOpacity: {
//         flexDirection: 'row',
//     }
// })