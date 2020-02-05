import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { AddCity, DeleteCity, cityInfo } from './constants/index';
import Main from './Main.js';

class CitiesList extends React.Component {

    addCity(city_name) {
        this.props.dispatch({
            type: AddCity,
            city: city_name
        })
    }

    deleteCity(index) {
        this.props.dispatch({
            type: DeleteCity,
            cityIndex: index
        })
    }

    cityInfo(item) {
        this.props.dispatch({
            type: cityInfo,
            cityName: item
        })
    }

    onPress(item){
        const promps = this.props.navigation.state.params

        promps.onGetWeatherInfoFromFav(item);
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{ flex: 1, paddingTop: 10 }}>
                <FlatList style={styles.itemInFlatlist}
                    data={this.props.cities}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.onPress(item)} >
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    )}
                //extraData={this.state.selectedItem}
                />
            </View>

        )
    }
}

const props = store => ({
    cities: store.cities,
})

export default connect(props)(CitiesList)

const styles = StyleSheet.create({
    itemInFlatlist: {
        backgroundColor: 'powderblue',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    }
})
