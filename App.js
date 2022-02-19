import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import LoadingScreen from './authentication/components/Loading';
import SignUpScreen from './authentication/components/SignUp';
import LoginScreen from './authentication/components/Login';
import MainScreen from './navigation/components/Main';
import DeviceScreen from './registration/components/NewDevice';
import ZoneScreen from './registration/components/NewZone';
import BypassPreheatScreen from './navigation/components/BypassPreheat';
import PreHeatScreen from './zone/components/Preheat';
import BypassScreen from './zone/components/Bypass';
import WirelessScreen from './registration/components/NewWireless';
import RelayScreen from './registration/components/Relay';
import PhoneScreen from './common/components/PhoneSupport';
import EmailScreen from './common/components/EmailSupport';
import ProfileScreen from './common/components/Profile';
import BLEScreen from './registration/components/FindBLE';

const AppNavigator = createStackNavigator({
  Home: { screen: LoadingScreen },
  Main: { screen: MainScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  SignUp: { screen: SignUpScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Login: { screen: LoginScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Device: { screen: DeviceScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Zone: { screen: ZoneScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Preheat: { screen: PreHeatScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Bypass: { screen: BypassScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Wireless: { screen: WirelessScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  PhoneSupport: { screen: PhoneScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  EmailSupport: { screen: EmailScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Profile: { screen: ProfileScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  Relay: { screen: RelayScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  BypassPreheat: { screen: BypassPreheatScreen,
    navigationOptions: ({navigation}) => ({ header: null })},
  FindBLE: { screen: BLEScreen,
    navigationOptions: ({navigation}) => ({ header: null })}
});

export default createAppContainer(AppNavigator);