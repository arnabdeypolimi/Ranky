import React, { Component } from 'react';

import { ScrollView, RefreshControl, ListView, StyleSheet, Text, Image, ImageBackground, View, FlatList, TouchableHighlight, Alert, ToastAndroid} from 'react-native';
import { Toolbar, Button, Card } from 'react-native-material-ui';
import TaskScoreChart from './TaskScoreChart';


export default class DetailsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount() {
    this.fetchApiData()
  }

  fetchApiData() {
    fetch(this.props.contest.url + "/sublist/" + this.props.user.id, {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.json())
      .then((subsData) => {

        fetch(this.props.contest.url + "/tasks/", {
          method: "GET",
          headers: {'Accept': 'application/json'}
        })
          .then((response) => response.json())
          .then((tasksData) => {

            let ar = [];
            for (let key in Object.keys(tasksData)) {
              console.log(key);
              ar.push(tasksData[key]);
            }

            ar.sort((a, b) => b.order - a.order);
            subsData.sort((a, b) => b.time - a.time);

            console.log("rerendering...");
            this.setState({
              tasksData: ar,
              subsData,
              isLoading: false
            });

          })
      })
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() {
      this.fetchApiData();
    });
  }

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
    console.log("called render of DetailsScreen!!");
    return (
      <View style={{flex: 1}}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={() => this.props.goBack()}
          centerElement={"Details of user"}/>

        <ScrollView refreshControl={
              <RefreshControl
                onRefresh={() => this.onRefresh()}
                refreshing={this.state.isLoading}
              />
            }>
          <TouchableHighlight onPress={() => ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT)}>
            <ImageBackground style={{height: 200}} source={{
              uri: this.props.contest.url + "/faces/" + this.props.user["id"],
              headers: {
                "Accept": "image/png,image/*"
              }
            }}>

              <View style={{flex: 1}}></View>

              <View style={{paddingLeft: 8, height: 60, flexDirection: "row", backgroundColor: "rgba(255, 255, 255, 0.5)"}}>
                <Image style={{width: 60, height: 60}} source={{
                  uri: "https://ranky.olinfo.it/static/flags/" + this.props.user.team + ".png",
                  headers: {
                    "Accept": "image/png,image/*"
                  }
                }}/>

                <View style={{flex: 1, paddingLeft: 8}}>
                  <Text numberOfLines={1} style={{fontSize: 24, fontWeight: "bold"}}>{this.props.user.f_name} {this.props.user.l_name}</Text>
                  <Text style={{fontSize: 18}}>{this.props.user.team}</Text>
                </View>
              </View>

            </ImageBackground>
          </TouchableHighlight>

          <Card>
            <TaskScoreChart tasks={this.state.tasksData} subs={this.state.subsData}/>
          </Card>

          <Card>
            <View style={{flex: 1, flexDirection: "row", paddingLeft: 10, paddingTop: 5, paddingRight: 10}}>
              <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Time</Text>
              <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Task</Text>
              <Text style={{flex: 1, fontFamily: 'monospace', fontWeight: 'bold'}}>Score</Text>
            </View>

            <FlatList
              data={this.state.subsData}
              renderItem={({item}) => (
                <TouchableHighlight style={{height: 30, paddingTop: 2, paddingBottom: 2, paddingLeft: 10, paddingRight: 10}} onPress={() => ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT)} underlayColor="#aed6f1">
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
                  </View>
                </TouchableHighlight>
              )}/>
          </Card>
        </ScrollView>

      </View>
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
