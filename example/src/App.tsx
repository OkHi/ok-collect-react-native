import React from 'react';
import {StatusBar, Image} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Repo from './services/repository';
import AppLoading from './components/AppLoading';
import HomeScreen from './screens/home/Home';
import LoginScreen from './screens/login/Login';

const Stack = createStackNavigator();

export default class App extends React.Component {
  private repo: Repo;

  constructor(props: any) {
    super(props);

    this.repo = new Repo();

    this.state = {
      appLoading: true,
      user: null,
      addresses: null,
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

  setUser = (user: {firstName: string; lastName: string; phone: string}) => {
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

    if (appLoading) {
      return <AppLoading />;
    }

    return (
      <NavigationContainer>
        <StatusBar backgroundColor="#006064" barStyle="light-content" />
        <Stack.Navigator initialRouteName={user ? 'home' : 'login'}>
          <Stack.Screen
            name="home"
            component={Home}
            options={{
              headerStyle: {backgroundColor: '#21838F'},
              headerTitleStyle: {color: 'white'},
              headerTitle: () => {
                return (
                  <Image
                    source={{
                      uri:
                        'https://storage.googleapis.com/okhi-cdn/images/logos/okhi-logo-white.png',
                    }}
                    style={{width: 70, height: 50}}
                    resizeMode="contain"
                  />
                );
              },
            }}
          />
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              title: 'Sign up',
              headerStyle: {backgroundColor: '#21838F'},
              headerTitleStyle: {color: 'white'},
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
