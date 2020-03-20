import React from 'react';
import {NavigationProp} from '@react-navigation/native';
import {Toast} from 'native-base';
import {
  View,
  ActivityIndicator,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  OkHiLocationManager,
  OkHiLocation,
  OkHiUser,
} from '../../lib/okcollect-online';
import {Store, User} from '../../interfaces';

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

export default class AddAddress extends React.PureComponent<{
  navigation: NavigationProp<any>;
  store: Store;
}> {
  private user: User;

  constructor(props: any) {
    super(props);
    this.user = this.props.store.user as User;
  }

  handleSuccess = async (location: OkHiLocation, user: OkHiUser) => {
    this.props.navigation.goBack();
    this.props.store.setValues({user, address: location});
  };

  handleError = () => {
    Toast.show({text: 'Opps, something went wrong. Please try again'});
    this.props.navigation.goBack();
  };

  render() {
    return (
      <OkHiLocationManager
        auth="SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU="
        user={this.user}
        style={{base: {color: '#37474F'}}}
        loader={<Loader />}
        onSuccess={this.handleSuccess}
        onError={this.handleError}
        config={{streetView: true}}
      />
    );
  }
}
