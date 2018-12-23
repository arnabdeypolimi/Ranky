import React from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { PermissionsAndroid } from 'react-native';
import { Card, Toolbar } from 'react-native-material-ui';
import RankingScreen from './RankingScreen';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchText: "",
      isLoading: true,
      selectedContest: null,
    };
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() {
      this.fetchApiData()
    });
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

  fetchApiData() {
    fetch("https://ranky.olinfo.it", {
      method: "GET",
      headers: {'Accept': 'application/json'}
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          isLoading: false,
          eventList: data
        })
      })
  }

  componentDidMount() {
    console.log("mounted");

    // request location if needed, and then re-render
    this.requestLocation()

    this.fetchApiData();
  }

  dist(lat2, lon2) {
    var lat1 = this.state.location.latitude;
    var lon1 = this.state.location.longitude;

    var R = 6371e3; // metres
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lon2 - lon1) * Math.PI / 180;

    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c / 1000).toFixed(2);
  }

  _onPressButton() {
    // this.props.navigation.navigate('Ranking');
  }

  // _onLongPressButton() {
  //   Alert.alert('You long-pressed the button!')
  // }

  render() {
    if (this.state.selectedContest != null) {
      // SHOW RANKING OF SINGLE CONTEST
      return (
        <RankingScreen contest={this.state.selectedContest} goBack={() => this.setState({selectedContest: null})}/>
      );
    } else {
      // SHOW LIST OF CONTESTS
      return (
        <View style={{flex: 1}}>
          <Toolbar
            centerElement={"Choose a contest (" + (this.state.eventList || []).length + ")"}
            searchable={{
              autoFocus: true,
              placeholder: "Search",
              onChangeText: (value) => this.setState({searchText: value}),
              onSearchClosed: () => this.setState({searchText: ""})
            }}/>
          <FlatList
              data={(this.state.eventList || []).filter((item) => item.name.toLowerCase().indexOf(this.state.searchText.toLowerCase()) !== -1)}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isLoading}
              renderItem={({item}) => (
                <View style={{flex:1}}>
                  <Card>
                    <TouchableHighlight onPress={() => this.setState({selectedContest: item})} underlayColor="gray">
                      <View style={{flex:1, flexDirection: 'row'}}>
                        <Image style={styles.img} source={{uri:"https://ranky.olinfo.it/static/"+item.id+".png"}}/>
                        <View style={{flex:3, flexDirection: 'row'}}>
                          <View Style={{flex:1}}>
                            <View style={{flex:3}}>
                              <Text style={styles.title}>{item.name}</Text>
                            </View>
                            <View style={{flex:1}}>
                              <Text style={styles.small}>
                                Status: {item.status}
                                {"\n"}
                                Distance: {this.dist(item.latitude, item.longitude)}km
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </Card>
                </View>
                // <Button title={item.name + ', dist: ~'
                //     + this.dist(item.latitude, item.longitude) + 'km'
                // }/>
              )}
              keyExtractor={({id}) => id} />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
