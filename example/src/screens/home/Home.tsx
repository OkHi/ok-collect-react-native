import React from 'react';
import {Platform} from 'react-native';
import {Container, Fab, Icon} from 'native-base';
import {NavigationProp} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';

export default class HomeScreen extends React.Component<{
  navigation: NavigationProp<any>;
}> {
  constructor(props: any) {
    super(props);
  }

  handleFabPress = async () => {
    await this.requestLocationPermission();
    this.props.navigation.navigate('Add address');
  };

  requestLocationPermission = async () => {
    const rational = {
      title: 'OkHi VaaS needs location permission',
      message:
        'We need location permission to enable us to create and verify the addresses you create',
      buttonPositive: 'GRANT',
      buttonNegative: 'DENY',
      buttonNeutral: 'CANCEL',
    };
    if (Platform.OS === 'android') {
      await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, rational);
      await request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION, rational);
    } else if (Platform.OS === 'ios') {
      await request(PERMISSIONS.IOS.LOCATION_ALWAYS, rational);
      await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, rational);
    } else {
      return false;
    }
  };

  render() {
    return (
      <Container>
        <Fab style={{backgroundColor: '#21838F'}} onPress={this.handleFabPress}>
          <Icon name="add" fontSize={32} />
        </Fab>
      </Container>
    );
  }
}
