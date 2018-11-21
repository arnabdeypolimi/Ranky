/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, Text, Image, View, FlatList, Button } from 'react-native';
// import { point, distance } from '@turf/turf';
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
          'message': 'location request'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }

  componentDidMount() {
    console.log("mounted");

    this.requestLocation();


    // navigator.geolocation.requestAuthorization();

    // navigator.geolocation.getCurrentPosition((pos) => {
    //   console.log(pos);
    // });

    fetch("https://ranky.olinfo.it")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isLoading: false,
          eventList: data
        })
      })
  }

  dist(lat, lon) {
    return distance(
        point(navigator.geolocation.getCurrentPosition()),
        point([lat, lon])
    );
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
                // + this.dist(item.latitude, item.longitude)
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
