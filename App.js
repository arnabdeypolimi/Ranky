import React from 'react';
import firebase from 'react-native-firebase';

import { AsyncStorage, View, Switch, Text, StatusBar, ImageBackground } from 'react-native';
import { Button } from 'react-native-material-ui';

import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import RankingScreen from './RankingScreen';
import DetailsScreen from './DetailsScreen';
import PictureScreen from './PictureScreen';

class CustomDrawerContentComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      favorites: [],
      notifying: true
    };
  }

  async componentWillMount() {
    try {
      var favorites = await AsyncStorage.getItem("ranky@favoriteUsers");

      if (favorites !== null) {
        console.log("aaaa: " + favorites);
        favorites = JSON.parse(favorites);
        console.log("aaaa: " + favorites);
      } else {
        favorites = [];
      }
    } catch (error) {
      favorites = [];  // some error
    }

    this.setState({
      favorites
    })
  }

  render() {
    const { navigation } = this.props;

    return (
      <View style={{flexDirection: "column"}}>
        <ImageBackground style={{ height: 160 }} source={{
            uri: "https://ranky.olinfo.it/static/" + navigation.state.params.contest.id + ".png",
            headers: {
              "Accept": "image/png,image/*"
            }
          }}>
        </ImageBackground>

        <Text style={{fontSize: 18, fontWeight: "bold", paddingBottom: 10,  paddingLeft: 10, paddingTop: 15}}>Notification settings</Text>

        <View style={{flexDirection: "row", paddingLeft: 10, paddingTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18}}>Contest events</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch onPress={() => this.setState({notifying: !this.state.notifying})} value={this.state.notifying}></Switch>
          </View>
        </View>

        <View style={{flexDirection: "row", paddingLeft: 10, paddingTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18}}>Favorite users: {this.state.favorites.length}</Text>
          </View>
          <Button onPress={() => {
            AsyncStorage.setItem('ranky@favoriteUsers', JSON.stringify([]))
              .then(() => {
                this.setState({
                  favorites: []
                })
              })
          }} text="clear"></Button>
        </View>
      </View>
    );
  }
};

const RootStack = createStackNavigator({
    Home: {
      screen: HomeScreen,
    },
    Ranking: {
      screen: createDrawerNavigator({ranking:{screen:RankingScreen}}, {
        contentComponent: CustomDrawerContentComponent
      }),
    },
    User: {
      screen: DetailsScreen,
    },
    Picture: {
      screen: PictureScreen,
    },
  }, {
    initialRouteName: 'Home',
    headerMode: 'none'
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  async componentDidMount() {
    this.checkPermission();
    this.createNotificationListeners(); //add this line
  }

  //Remove listeners allocated in createNotificationListeners()
  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }

  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  async getToken() {
    // let fcmToken = await AsyncStorage.getItem('fcmToken', value);
    let fcmToken = await AsyncStorage.getItem('fcmToken', () => "value");
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

  async createNotificationListeners() {
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);

    /*
    * Triggered when a particular notification has been received in foreground
    * */
    this.notificationListener = firebase.notifications().onNotification((notification) => {
        this.showAlert(notification);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        this.showAlert(notificationOpen.notification);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        this.showAlert(notificationOpen.notification);
    }
    /*
    * Triggered for data only payload in foreground
    * */
    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
  }

  showAlert(notification) {
    console.log("notifying...");
    notification.android.setChannelId("test-channel");
    firebase.notifications().displayNotification(notification);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="#01579b"
          barStyle="light-content"/>
        <AppContainer />
      </View>
    );
  }
}
