import React, { Component } from 'react';

import { ScrollView, RefreshControl, StyleSheet, Text, Image, ImageBackground, View, TouchableHighlight, ToastAndroid } from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import TaskScoreChart from './TaskScoreChart';
import SubmissionListView from './SubmissionListView';


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

  async fetchApiData() {
    const { navigation } = this.props;
    const contest = navigation.getParam('contest');
    const user = navigation.getParam('user');
    const tasksData = navigation.getParam('tasks');

    const subsData = await fetch(contest.url + "/sublist/" + user.id, {
      method: "GET",
      headers: { 'Accept': 'application/json' }
    })
      .then((response) => response.json());

    let ar = [];
    let best = {};
    for (let key in tasksData) {
      ar.push(tasksData[key]);
      best[tasksData[key]["short_name"]] = 0;
    }

    ar.sort((a, b) => {
      if (a.contest > b.contest) {
        return 1;
      } else if (a.contest < b.contest) {
        return -1;
      } else {
        return a.order - b.order;
      }
    });
    subsData.sort((a, b) => b.time - a.time);

    for (let i = subsData.length - 1; i >= 0; i--) {
      if (best[subsData[i].task] < subsData[i].score) {
        subsData[i]["delta"] = (subsData[i].score - best[subsData[i].task]).toFixed(2);
        best[subsData[i].task] = subsData[i].score;
      } else {
        subsData[i]["delta"] = 0;
      }
    }

    this.setState({
      tasksData: ar,
      subsData,
      isLoading: false
    });
  }

  onRefresh() {
    this.setState({ isLoading: true }, function () {
      this.fetchApiData();
    });
  }

  render() {
    const { navigation } = this.props;
    const contest = navigation.getParam('contest');
    const user = navigation.getParam('user');

    return (
      <View style={{ flex: 1 }}>
        <Toolbar
          leftElement="arrow-back"
          onLeftElementPress={ () => this.props.navigation.goBack() }
          centerElement={"Details of user"} />

        <ScrollView refreshControl={
          <RefreshControl
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isLoading}
          />
        }>
          <TouchableHighlight onPress={() => this.props.navigation.navigate("Picture", {
            contest, user
          })}>
            <ImageBackground style={{ height: 200 }} source={{
              uri: contest.url + "/faces/" + user["id"],
              headers: {
                "Accept": "image/png,image/*"
              }
            }}>

              <View style={{ flex: 1 }}></View>

              <View style={{ paddingLeft: 8, height: 60, flexDirection: "row", backgroundColor: "rgba(255, 255, 255, 0.5)" }}>
                <Image style={{ width: 60, height: 60 }} source={{
                  uri: "https://ranky.olinfo.it/static/flags/" + user.team + ".png",
                  headers: {
                    "Accept": "image/png,image/*"
                  }
                }} />

                <View style={{ flex: 1, paddingLeft: 8 }}>
                  <Text numberOfLines={1} style={{ fontSize: 24, fontWeight: "bold" }}>{user.f_name} {user.l_name}</Text>
                  <Text style={{ fontSize: 18 }}>{user.team}</Text>
                </View>
              </View>

            </ImageBackground>
          </TouchableHighlight>

          <TaskScoreChart tasks={this.state.tasksData} subs={this.state.subsData} />

          <SubmissionListView subs={this.state.subsData} contest={contest} />
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({


  main: { paddingLeft: 3 },

  img: {
    flex: 1,
    width: 50,
    height: 50,
    alignItems: 'center',
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
    color: 'blue',
  },

  title: {
    paddingLeft: 10,
    fontFamily: 'Roboto',
    fontSize: 20,
    color: 'black',
    alignItems: 'flex-start',
    // fontWeight:'bold',
  },

  small: {
    paddingLeft: 10,
    fontFamily: 'Roboto',
    fontSize: 15,
    color: 'green',
    alignItems: 'flex-end',
  }
});
