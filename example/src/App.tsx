import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Repo from './services/repository';
import AppLoading from './components/AppLoading';
import HeaderImage from './components/HeaderImage';
import HomeScreen from './screens/home/Home';
import LoginScreen from './screens/login/Login';
import AddAddressScreen from './screens/add-address/AddAddress';
import {Store, User} from './interfaces';

const Stack = createStackNavigator();

export default class App extends React.Component<{}, Store> {
  private repo: Repo;

  constructor(props: any) {
    super(props);

    this.repo = new Repo();

    this.state = {
      appLoading: true,
      user: null,
      addresses: [],
      setUser: this.setUser,
    };

    this.init();
  }

  init = async () => {
    const user = await this.repo.getUser();
    const addresses = await this.repo.getAddresses();
    this.setState({
      user,
      addresses,
      appLoading: false,
    });
  };

  setUser = (user: User) => {
    return new Promise(resolve => {
      this.setState({user}, () => {
        this.repo.setUser(user);
        resolve();
      });
    });
  };

  getUser = async () => {
    try {
      return await this.repo.getUser();
    } catch (error) {
      return null;
    }
  };

  getAddresses = async () => {
    try {
      return await this.repo.getAddresses();
    } catch (error) {
      return null;
    }
  };

  render() {
    const {appLoading, user} = this.state;
    const Home = (props: any) => <HomeScreen {...props} store={this.state} />;
    const Login = (props: any) => <LoginScreen {...props} store={this.state} />;
    const AddAddress = (props: any) => (
      <AddAddressScreen {...props} store={this.state} />
    );

    if (appLoading) {
      return <AppLoading />;
    }

    return (
      <NavigationContainer>
        <StatusBar backgroundColor="#006064" barStyle="light-content" />
        <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerStyle: {backgroundColor: '#21838F'},
              headerTitleStyle: {color: 'white'},
              headerTitle: HeaderImage,
            }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{
              title: 'Sign up',
              headerStyle: {backgroundColor: '#21838F'},
              headerTitleStyle: {color: 'white'},
            }}
          />
          <Stack.Screen
            name="Add address"
            component={AddAddress}
            options={{
              title: 'Add your OkHi address',
              headerStyle: {backgroundColor: '#21838F'},
              headerTitleStyle: {color: 'white'},
              headerBackTitleStyle: {color: 'white'},
              headerTintColor: 'white',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
