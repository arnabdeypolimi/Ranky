import React, { Component } from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { Toolbar } from 'react-native-material-ui';

import DetailsScreen from './DetailsScreen';


export default class RankingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mat: null,
      selectedUser: null,
      searchText: ""
    };
  }

  componentDidMount() {
    console.log("here: " + this.props.contest.url);
    this.fetchApiData()
  }

  fetchApiData() {
    fetch(this.props.contest.url + "/users/", {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.json())
      .then((usersData) => {

        fetch(this.props.contest.url + "/history", {
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

            // sort by total score, decreasing
            mat.sort((a, b) => b.total - a.total);

            let cur_rank = 1;
            for (let i = 0; i < mat.length; i++) {
              if (i == 0 || mat[i]["total"] < mat[i - 1]["total"]) {
                mat[i]["rank"] = cur_rank;
              } else {
                mat[i]["rank"] = mat[i - 1]["rank"];
              }

              cur_rank += 1;
            }

            this.setState({
              mat,
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

  render() {
    if (this.state.selectedUser != null) {
      // SHOW DETAILS OF SINGLE USER
      return (
        <DetailsScreen contest={this.props.contest} user={this.state.selectedUser} goBack={() => this.setState({selectedUser: null})}/>
      );
    } else {
      // SHOW RANKING OF ALL USERS
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
            onRefresh={() => this.onRefresh()}
            refreshing={this.state.isLoading}
            renderItem={({item, index}) => (
              <View style={{flex:1}}>
                <TouchableHighlight style={{height: 56, paddingTop: 3, paddingBottom: 3}} onPress={() => this.setState({selectedUser: item.user})} underlayColor="#aed6f1">
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text style={{width: 35, textAlign: "center", textAlignVertical: "center", fontSize: 18}}>{item.rank}</Text>

                    <View style={{paddingLeft: 5}}>
                      <Image style={styles.img} source={{
                        uri: this.props.contest.url + "/faces/" + item.user.id,
                        headers: {
                          "Accept": "image/png,image/*"
                        }
                      }}/>
                    </View>

                    <View style={{flex: 1, flexDirection: "column", paddingLeft: 10}}>
                      <Text style={{flex: 1, fontSize: 20, lineHeight: 20, paddingTop: 5}}>
                        {item.user["f_name"] + " " + item.user["l_name"][0] + "."}
                      </Text>

                      <Text style={{flex: 1, fontSize: 12, fontFamily: "monospace"}}>
                        {item.user["team"]}
                      </Text>
                    </View>

                    <View style={{flexDirection: "row", paddingBottom: 8, paddingRight: 5}}>
                      <Text style={{fontSize: 28, textAlignVertical: "bottom"}}>
                        {Math.floor(item.total)}
                      </Text>

                      <Text style={{fontSize: 14, textAlignVertical: "bottom"}}>/600</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              </View>
            )}
            keyExtractor={(item) => item.user.id}/>
        </View>
      );
    }
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
