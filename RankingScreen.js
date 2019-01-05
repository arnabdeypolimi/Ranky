import React, { Component } from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { Card, Toolbar } from 'react-native-material-ui';


export default class RankingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
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
    fetch(url + "/users", {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.json())
      .then((usersData) => {

        fetch(url + "/history", {
          method: "GET",
          headers: {'Accept': 'application/json'}
        })
          .then((response) => response.json())
          .then((historyData) => {

            // finished downloading everything

            console.log(usersData.length);
            console.log(historyData.length);

            var mat = [];
            var id = {};

            // console.log(usersData);
            for (var u in usersData) {
              id[u] = mat.length;
              mat.push({});
            }

            for (var h of historyData) {
              console.log(h);
              console.log(id[h[0]]);
              // h[0] == username
              // h[1] == taskname
              // h[2] == timestamp
              // h[3] == best score til now
              mat[
                id[h[0]]  // row
              ][
                h[1]   // column
              ] = h[3];
            }

            for (var u in usersData) {
              var t = 0;
              console.log(JSON.stringify(mat[id[u]]));
              for (var score of Object.values(mat[id[u]])) {
                t += parseFloat(score);
              }
              console.log(t);
              mat[id[u]]["total"] = t;
              mat[id[u]]["user"] = usersData[u];
              mat[id[u]]["user"]["id"] = u;
              console.log(JSON.stringify(mat[id[u]]));
            }

            mat.sort((a, b) => b.total - a.total);

            this.setState({
              mat,
              isLoading: false
            });
          })
      })
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() {
      this.fetchApiData()
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
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

        <FlatList
          data={this.state.mat}
          onRefresh={this.onRefresh}
          refreshing={this.state.isLoading}
          renderItem={({item, index}) => (
            <View style={{flex:1}}>
              <Card>
                <TouchableHighlight onPress={() => this.setState({selectedContest: item})} underlayColor="gray">
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <View style={{flex:5, flexDirection: 'row'}}>
                      <Text>a</Text>
                    </View>
                    <Image style={styles.img} source={{uri:"https://ranky.olinfo.it/static/"+item.id+".png"}}/>
                    <View style={{flex:3, flexDirection: 'row'}}>
                      <View style={{flex:1}}>
                        <View style={{flex:3}}>
                          <Text style={styles.title}>
                            {index + 1} — {item.user["f_name"]} {item.user["l_name"]}
                          </Text>
                        </View>
                        <View style={{flex:1}}>
                          <Text style={styles.small}>
                            {Math.floor(item.total)}/600
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableHighlight>
              </Card>
            </View>
          )}
          keyExtractor={(item) => item.user.id}/>
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
