import React, { Component } from 'react';

import { AsyncStorage, StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert } from 'react-native';
import { Toolbar } from 'react-native-material-ui';

import DetailsScreen from './DetailsScreen';


export default class RankingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      mat: null,
      searchText: "",
    };
  }

  componentDidMount() {
    this.fetchApiData();
  }

  async fetchApiData() {
    const { navigation } = this.props;
    const contest = navigation.getParam('contest');

    const usersData = await fetch(contest.url + "/users/", {
        method: "GET",
        headers: { 'Accept': 'application/json' }
      })
      .then((response) => response.json());

    const historyData = await fetch(contest.url + "/history", {
        method: "GET",
        headers: { 'Accept': 'application/json' }
      })
      .then((response) => response.json());

    try {
      const favorites = await AsyncStorage.getItem("ranky@favoriteUsers");

      if (favorites !== null) {
        this._favoriteUsers = JSON.parse(favorites);
      } else {
        this._favoriteUsers = [];
      }
    } catch (error) {
      this._favoriteUsers = [];  // some error
    }

    var mat = [];
    var id = {};

    for (var u in usersData) {
      id[u] = mat.length;
      mat.push({});
    }

    for (var h of historyData) {
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
      for (var score of Object.values(mat[id[u]])) {
        t += parseFloat(score);
      }
      mat[id[u]]["total"] = t;
      mat[id[u]]["user"] = usersData[u];
      mat[id[u]]["user"]["id"] = u;
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
      favUsers: this._favoriteUsers,
      isLoading: false
    });
  }

  onRefresh() {
    this.setState({ isLoading: true }, function () {
      this.fetchApiData();
    });
  }

  chooseUser(user) {
    const { navigation } = this.props;
    const contest = navigation.getParam("contest");

    navigation.navigate("User", {
      user,
      contest
    });
  }

  performSearch(query) {
    query = query.toLowerCase();

    for (let i = 0; i < this.state.mat.length; i++) {
      if (this.state.mat[i].user["f_name"].toLowerCase().startsWith(query)
        || this.state.mat[i].user["l_name"].toLowerCase().startsWith(query)) {
        this.flatListRef.scrollToIndex({ index: i });
        return;
      }
    }
  }

  favoriteUser(user) {
    let index = this._favoriteUsers.indexOf(user["id"]);
    if (index > -1) {
      // remove this user from favorites
      this._favoriteUsers.splice(index, 1);
    } else {
      // add this user to favorites
      this._favoriteUsers.push(user["id"]);
    }

    try {
      AsyncStorage.setItem('ranky@favoriteUsers', JSON.stringify(this._favoriteUsers))
        .then(() => {
          this.setState({
            favUsers: this._favoriteUsers
          })
        })
    } catch (error) {
      console.log("error: " + error);
    }
  }

  render() {
    const { navigation } = this.props;
    const contest = navigation.getParam('contest');

    return (
      <View style={{ flex: 1 }}>
        <Toolbar
          leftElement="tune"
          onLeftElementPress={() => this.props.navigation.toggleDrawer()}
          centerElement={"" + contest.name}
          searchable={{
            autoFocus: true,
            placeholder: "Search",
            onChangeText: (value) => this.performSearch(value)
          }} />

        <FlatList
          ref={(ref) => this.flatListRef = ref}
          data={this.state.mat}
          onRefresh={() => this.onRefresh()}
          refreshing={this.state.isLoading}
          keyboardShouldPersistTaps='handled'
          getItemLayout={(data, index) => (
            { length: 56, offset: 56 * index, index }
          )}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <TouchableHighlight style={{ height: 56, paddingTop: 3, paddingBottom: 3 }} onPress={() => this.chooseUser(item.user)} onLongPress={() => this.favoriteUser(item.user)} underlayColor="#aed6f1">
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text style={{ width: 35, textAlign: "center", textAlignVertical: "center", fontSize: 18 }}>{item.rank}</Text>

                  <View style={{ paddingLeft: 5 }}>
                    <Image style={styles.img} source={{
                      uri: contest.url + "/faces/" + item.user.id,
                      headers: {
                        "Accept": "image/png,image/*"
                      }
                    }} />
                  </View>

                  <View style={{ flex: 1, flexDirection: "column", paddingLeft: 10 }}>
                    <Text numberOfLines={1} style={{ flex: 1, fontSize: 20, lineHeight: 20, paddingTop: 5, fontStyle: (this.state.favUsers.includes(item.user["id"])) ? "italic" : "normal" }}>
                      {item.user["f_name"] + " " + item.user["l_name"][0] + "."}
                    </Text>

                    <Text style={{ flex: 1, fontSize: 12, fontFamily: "monospace" }}>
                      {item.user["team"]}
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", paddingBottom: 12, paddingRight: 5 }}>
                    <Text style={{ fontSize: 22, textAlignVertical: "bottom" }}>
                      {Math.floor(item.total)}
                    </Text>

                    <Text style={{ fontSize: 14, textAlignVertical: "bottom" }}>/600</Text>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          )}
          keyExtractor={(item) => item.user.id} />
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
