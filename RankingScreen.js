import React, { Component } from 'react';

import { StyleSheet, Text, Image, View, FlatList, TouchableHighlight, Alert} from 'react-native';
import { Toolbar } from 'react-native-material-ui';
import Drawer from 'react-native-drawer';


const FirstRoute = () => (
  <View style={[{flex: 1}, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[{flex: 1}, { backgroundColor: '#673ab7' }]} />
);

export default class RankingScreen extends Component {
  constructor(props) {
    super(props);
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
        <Drawer
            type="overlay"
            openDrawerOffset={0.3}
            tapToClose={true}
            content={<View style={{flex: 1, backgroundColor: "blue"}}><Text>test</Text></View>}
            ref={(ref) => this._drawer = ref }>
            openDrawerOffset ={0.2} 
            panCloseMask ={0.2}
            closedDrawerOffset={-3}
            styles={drawerStyles}
            tweenHandler={(ratio) => ({
            main: { opacity:(2-ratio)/2 }
            })}
        </Drawer>
      </View>
    );
  }
}

const styles = StyleSheet.create({


  drawer: { shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3},
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
