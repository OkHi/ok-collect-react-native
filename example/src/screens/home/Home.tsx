import React from 'react';
import {
  Platform,
  FlatList,
  View,
  ActivityIndicator,
  Text,
  StyleProp,
  ViewStyle,
  ViewProps,
} from 'react-native';
import {Container, Fab, Icon} from 'native-base';
import {Toast} from 'native-base';
import {NavigationProp} from '@react-navigation/native';
import {request, PERMISSIONS} from 'react-native-permissions';
import OkHiLocationManager, {
  OkHiLocationManagerConfig,
  OkHiLocationManagerAppBarConfiguration,
  OkHiLocationManagerTheme,
} from '@okhi/okcollect-manager-react-native';
import {OkHiUser, OkHiLocation, OkHiException} from '@okhi/core';
import core from '../../services/OkHiCore';
import {Store, User} from '../../interfaces';
import AddressItem from '../../components/AddressItem';
import * as OkVerify from '../../services/OkVerify';

function Loader() {
  const containerStyles: StyleProp<ViewStyle> = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const textStyles = {fontSize: 16, marginTop: 15};
  return (
    <View style={containerStyles}>
      <ActivityIndicator color="#21838f" />
      <Text style={textStyles}>Securing your connection with OkHi</Text>
    </View>
  );
}

export default class HomeScreen extends React.Component<
  {
    navigation: NavigationProp<any>;
    store: Store;
  },
  {launchOkHi: boolean}
> {
  private user: any;
  constructor(props: any) {
    super(props);
    this.user = this.props.store.user as User;
    this.state = {
      launchOkHi: false,
    };
    // console.log(OkHi.fetchContext());
  }

  handleFabPress = async () => {
    await this.requestLocationPermission();
    this.setState({launchOkHi: true});
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

  handleSuccess = async (location: OkHiLocation, user: OkHiUser) => {
    if (location.id && location.geoPoint) {
      const result = await OkVerify.start(core, user, {
        id: location.id,
        geoPoint: location.geoPoint,
      });
      console.log('verification started: ', result);
    }
    this.setState({launchOkHi: false}, () => {
      this.props.store.setValues({user, address: location});
    });
  };

  handleError = (error: OkHiException) => {
    this.setState({launchOkHi: false});
    if (error.code === 'network_request_failed') {
      Toast.show({
        text:
          'Netowrk error. Please check your internet connection and try again',
      });
    } else {
      Toast.show({text: 'Opps, something went wrong. Please try again'});
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

  renderOkHi = () => {
    const {launchOkHi} = this.state;

    const user: OkHiUser = this.user;

    const appBarConfig: OkHiLocationManagerAppBarConfiguration = {
      visible: true,
    };

    const config: OkHiLocationManagerConfig = {
      streetView: true,
      appBar: appBarConfig,
    };

    const safeAreaViewProps: ViewProps = {style: {backgroundColor: '#37474F'}};

    const theme: OkHiLocationManagerTheme = {
      appBar: {
        backgroundColor: '#37474F',
        logo:
          'https://storage.googleapis.com/okhi-cdn/images/logos/okhi-logo-white.png',
      },
      colors: {
        primary: '#37474F',
      },
    };

    return (
      <OkHiLocationManager
        core={core}
        user={user}
        theme={theme}
        config={config}
        launch={launchOkHi}
        loader={<Loader />}
        onSuccess={this.handleSuccess}
        onError={this.handleError}
        onCloseRequest={() => this.setState({launchOkHi: false})}
        safeAreaViewProps={safeAreaViewProps}
      />
    );
  };

  render() {
    const fabStyles = {backgroundColor: '#21838F'};
    return (
      <Container>
        {this.renderOkHi()}
        {this.renderAddresses()}
        <Fab style={fabStyles} onPress={this.handleFabPress}>
          <Icon name="add" fontSize={32} />
        </Fab>
      </Container>
    );
  }
}
