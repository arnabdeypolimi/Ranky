import React, { Component } from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { Toolbar } from 'react-native-material-ui';


export default class RankingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contests: [],
      users: [],
      tasks: [],
    };
  }

  componentDidMount() {
    console.log("here: " + this.props.contest.url);
    this.fetchApiData(this.props.contest.url)
  }

  fetchApiData(url) {
    // contests
    fetch(url + "/contests", {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.text())
      .then((data) => {
        this.setState({
          contests: data
        })
      })

    // users
    fetch(url + "/contests", {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.text())
      .then((data) => {
        this.setState({
          users: data
        })
      })
  }

  render() {
    return (
      <View>
        <Toolbar
          leftElement="menu"
          onLeftElementPress={() => this.props.goBack()}
          centerElement={"" + this.props.contest.name}
          searchable={{
            autoFocus: true,
            placeholder: "Search",
            onChangeText: (value) => this.setState({searchText: value}),
            onSearchClosed: () => this.setState({searchText: ""})
          }}/>

        <Text>{this.state.users.length}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({


  main: {paddingLeft: 3},

  img:{
    flex: 1,
    width:100,
    height:100,
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

  title:{
    paddingLeft: 10,
    fontFamily:'Roboto',
    fontSize:20,
    color:'black',
    alignItems:'flex-start',
    fontWeight:'bold',
  },

  small:{
    paddingLeft: 10,
    fontFamily:'Roboto',
    fontSize:15,
    color:'green',
    alignItems:'flex-end',
  }
});
