import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TextInput } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoadig: true , searchInput: '', location: null, errorMessage: null};
    
    
  }

  componentDidMount(){

    

    return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=London') 
    .then((response) => response.json())
    .then((responseJSON) => {
      console.log(responseJSON)
      this.setState({
        isLoadig: false,
        dataSource: responseJSON.current,
      }, function(){

      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  async getWeatherInfo() {
    return fetch('http://api.weatherstack.com/current?access_key=15aded31bfadc2ea76087228274aaa88&query=' + this.state.searchInput) 
    .then((response) => response.json())
    .then((responseJSON) => {
      console.log(responseJSON)
      this.setState({
        isLoadig: false,
        dataSource: responseJSON.current,
      }, function(){

      });
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    if(this.state.isLoadig) {
      return(
        <View style={styles.container}>
          <ActivityIndicator/>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <TextInput 
        style = {{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, padding: 10 }}
        placeholder = "Enter city name"
        onChangeText = {(text) => this.setState({searchInput: text})}
        value = {this.state.searchInput}
        onSubmitEditing = { () => this.getWeatherInfo() }
        />
        <Text>{this.state.dataSource.temperature}</Text>
      </View>
    );
  }
}

//<Image source={require('background.jpg')} style={styles.backgroundImage}/>



const styles = StyleSheet.create({
  container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#F5FCFF',
       flexDirection: 'column',
  },
  backgroundImage: {
       width:320,
       height:480
  }
});
