import React, { Component } from 'react';

import { StyleSheet, Text, View, FlatList, TouchableHighlight, ToastAndroid} from 'react-native';
import { Card } from 'react-native-material-ui';


export default class SubmissionListView extends Component {
  formatTime(s) {
    let h = Math.floor(s / 3600);
    let m = Math.floor(s % 3600 / 60);
    s = s - m * 60 - h * 3600;

    let t = "" + h + ":";
    if (m < 10) t += "0";
    t += "" + m + ":";
    if (s < 10) t += "0";
    t += "" + s;

    return t;
  }

  render() {
    return (
      <Card>
        <View style={{flex: 1, flexDirection: "row", paddingLeft: 10, paddingTop: 5, paddingRight: 10}}>
          <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Time</Text>
          <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Task</Text>
          <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Score</Text>
          <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Improve</Text>
        </View>

        <FlatList
          data={this.props.subs}
          getItemLayout={(data, index) => (
            { length: 30, offset: 30 * index, index }
          )}
          renderItem={({item}) => (
            <TouchableHighlight style={{height: 30, paddingTop: 2, paddingBottom: 2, paddingLeft: 10, paddingRight: 10}}
                                onPress={() => ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT)}
                                underlayColor="#aed6f1">
              <View style={{flex:1, flexDirection: 'row'}}>
                <Text style={{flex: 1}}>
                  {this.formatTime(item["time"] - this.props.contest["start"])}
                </Text>

                <Text style={{flex: 1}}>
                  {item["task"]}
                </Text>

                <Text style={{flex: 1}}>
                  {item["score"]}
                </Text>

                <Text style={{flex: 1, fontWeight: "bold", color: "green"}}>
                  {item["delta"] == 0 ? "" : ("+" + item["delta"])}
                </Text>
              </View>
            </TouchableHighlight>
          )}/>
      </Card>
    );
  }
}

const styles = StyleSheet.create({


  main: {paddingLeft: 3},

  img:{
    flex: 1,
    width:50,
    height:50,
    alignItems:'center',
    borderRadius: 25
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

  title:{
    paddingLeft: 10,
    fontFamily:'Roboto',
    fontSize:20,
    color:'black',
    alignItems:'flex-start',
    // fontWeight:'bold',
  },

  small:{
    paddingLeft: 10,
    fontFamily:'Roboto',
    fontSize:15,
    color:'green',
    alignItems:'flex-end',
  }
});
