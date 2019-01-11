import React from 'react';
import firebase from 'react-native-firebase';

import { AsyncStorage, View, Switch, Text, StatusBar } from 'react-native';
import { RadioButton } from 'react-native-material-ui';

import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import RankingScreen from './RankingScreen';
import DetailsScreen from './DetailsScreen';
import PictureScreen from './PictureScreen';

class CustomDrawerContentComponent extends React.Component {
  render() {
    const { navigation } = this.props;

    return (
      <View style={{flexDirection: "column", paddingLeft: 10, paddingTop: 10}}>
        <Text style={{fontWeight: "bold", paddingBottom: 20}}>Notification settings</Text>

        <View style={{flexDirection: "row"}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18}}>Boh</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch value={false}></Switch>
          </View>
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
