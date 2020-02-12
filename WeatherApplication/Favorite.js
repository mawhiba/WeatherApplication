import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { connect } from "react-redux";
import { AddCity, DeleteCity, cityInfo } from './constants/index';
import Main from './Main.js';
import Citie_List from './Citie_List.js';
import Swipeable from 'react-native-gesture-handler/Swipeable';


class CitiesList extends React.Component {

    addCity(city_name, city_temp) {
        this.props.dispatch({
            type: AddCity,
            cityName: city_name,
            cityTemp: city_temp
        })
    }

    deleteCity(item) {
        this.props.dispatch({
            type: DeleteCity,
            city: item.cityName
        })
    }

    cityInfo(item) {
        this.props.dispatch({
            type: cityInfo,
            cityName: item
        })
    }

    onPress(item) {
        const promps = this.props.navigation.state.params

        promps.onGetWeatherInfoFromFav(item);
        this.props.navigation.goBack()
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#A9A9A9",
                }}
            />
        );
    };

    render() {
        return (
            <ImageBackground source={require('./assets/background5.jpg')} style={styles.bgImage}>
                <View style={{ flex: 1, paddingTop: 10 }}>
                    <FlatList style={styles.itemInFlatlist}
                        data={this.props.cities}
                        showsVerticalScrollIndicator={true}
                        keyExtractor={(item, index) => item.cityName}
                        renderItem={({ item, index }) => (
                            // <View style = {styles.flatview}>
                            //     <TouchableOpacity onPress={() => this.onPress(item)} >
                            //         <Text style = {styles.listItem}>{item}</Text>
                            //     </TouchableOpacity>
                            // </View>
                            <Citie_List cityObj={item} onPressFunction={() => this.onPress(item.cityName)} pressToDelete={() => this.deleteCity(item)} />
                        )}
                        ItemSeparatorComponent={this.renderSeparator}
                    />
                </View>
            </ImageBackground>

        )
    }
}

const props = store => ({
    cities: store.cities,
})

export default connect(props)(CitiesList)

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
        color : '#494947'

    },
    bgImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        opacity: 0.7
    },
})
