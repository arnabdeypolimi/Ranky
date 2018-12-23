import React, { Component } from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import Drawer from 'react-native-drawer';
import { Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';


const FirstRoute = () => (
  <View style={[{flex: 1}, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[{flex: 1}, { backgroundColor: '#673ab7' }]} />
);

export default class RankingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      routes: [
        { key: 'first', title: 'First' },
        { key: 'second', title: 'Second' },
      ],
    };
  }

  render() {
    return (
      <View>
        <Toolbar
          leftElement="menu"
          onLeftElementPress={() => this._drawer.toggle() }
          centerElement={"" + this.props.contest.name}
          searchable={{
            autoFocus: true,
            placeholder: "Search",
            onChangeText: (value) => this.setState({searchText: value}),
            onSearchClosed: () => this.setState({searchText: ""})
          }}/>
        {/* <Drawer
            openDrawerOffset={0.3}
            tapToClose={true}
            content={<View style={{flex: 1, backgroundColor: "blue"}}><Text>test</Text></View>}
            ref={(ref) => this._drawer = ref }>
        </Drawer> */}
        <TabView
          navigationState={this.state}
          renderScene={SceneMap({
            first: FirstRoute,
            second: SecondRoute,
          })}
          onIndexChange={index => this.setState({ index })}
          initialLayout={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height
          }}
        />
      </View>
    );
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
