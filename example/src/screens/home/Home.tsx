import React from 'react';
import {Platform, FlatList, View} from 'react-native';
import {Container, Fab, Icon} from 'native-base';
import {NavigationProp} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {Store} from '../../interfaces';
import AddressItem from '../../components/AddressItem';

export default class HomeScreen extends React.Component<{
  navigation: NavigationProp<any>;
  store: Store;
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

  renderAddresses = () => {
    const dividerStyles = {
      borderBottomWidth: 0.5,
      borderBottomColor: '#e0e0e0',
      marginLeft: 15,
      marginRight: 15,
    };
    const {store} = this.props;
    const {addresses} = store;
    if (!addresses.length) {
      return null;
    }
    return (
      <FlatList
        data={addresses}
        renderItem={({item}) => <AddressItem address={item} />}
        keyExtractor={(item, index) => String(index)}
        ItemSeparatorComponent={() => <View style={dividerStyles} />}
      />
    );
  };

  render() {
    const fabStyles = {backgroundColor: '#21838F'};
    return (
      <Container>
        {this.renderAddresses()}
        <Fab style={fabStyles} onPress={this.handleFabPress}>
          <Icon name="add" fontSize={32} />
        </Fab>
      </Container>
    );
  }
}
