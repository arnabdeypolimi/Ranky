/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { StyleSheet, Text, Image, View} from 'react-native';




export default class App extends Component{

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>Let Start</Text>
        <Image style={styles.img} source={{uri:"https://arnabdey.co/uploads/1/2/2/6/122619697/img-3152_orig.jpg"}}/>
      </View>
    );
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
