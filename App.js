/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, FlatList, Button } from 'react-native';
import { PermissionsAndroid } from 'react-native';


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  async requestLocation() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'location',
          'message': 'The location is required to show the contests in order of distance'
        }
      )

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        navigator.geolocation.getCurrentPosition((pos) => {
          this.setState({
            location: pos.coords
          });
        });
      } else {
        this.setState({
          location: null
        });
      }
    } catch (err) {
      console.warn(err);

      this.setState({
        location: null
      });
    }
  }

  componentDidMount() {
    console.log("mounted");

    // request location if needed, and then re-render
    this.requestLocation()

    fetch("https://ranky.olinfo.it")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isLoading: false,
          eventList: data
        })
      })
  }

  dist(lat2, lon2) {
    var lat1 = this.state.location.latitude;
    var lon1 = this.state.location.longitude;

    var R = 6371e3; // metres
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2-lat1) * Math.PI / 180;
    var Δλ = (lon2-lon1) * Math.PI / 180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return (R * c / 1000).toFixed(2);
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Text style={styles.instructions}>Let Start</Text>
          <Image style={styles.img} source={{uri:"https://arnabdey.co/uploads/1/2/2/6/122619697/img-3152_orig.jpg"}}/>
        </View>
      );
    } else {
      return (
        <View style={{flex: 1, paddingTop: 20}}>
          <FlatList data={this.state.eventList}
              renderItem={({item}) => <Button title={item.name + ', dist: ~'
                  + this.dist(item.latitude, item.longitude) + 'km'
              }/>}
              keyExtractor={({id}) => id} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  img:{
    width:200,
    height:200,
    alignItems:'center'
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color:'blue',
  },
});
