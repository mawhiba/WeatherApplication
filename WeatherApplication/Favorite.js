import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { AddCity, DeleteCity, cityInfo } from './constants/index';
import Main from './Main.js';
import Citie_List from './Citie_List.js';

class CitiesList extends React.Component {

    addCity(city_name) {
        this.props.dispatch({
            type: AddCity,
            city: city_name,
            cityTemp: city_temp
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
            <View style={{ flex: 1, paddingTop: 10 }}>
                <FlatList style={styles.itemInFlatlist}
                    data={this.props.cities}
                    showsVerticalScrollIndicator={true}
                    renderItem={({ item, index }) => (
                        // <View style = {styles.flatview}>
                        //     <TouchableOpacity onPress={() => this.onPress(item)} >
                        //         <Text style = {styles.listItem}>{item}</Text>
                        //     </TouchableOpacity>
                        // </View>
                        <Citie_List cityObj = {item} onPressFunction={() => this.onPress(item.cityName)}/>

                    )}
                    ItemSeparatorComponent={this.renderSeparator}
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
})
