import React from 'react';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import {ActivityIndicator} from 'react-native';
import {OkHiConfig, OkHiUser, OkHiLocation, OkHiError} from './';

interface OkHiLocationManagerStartPayload {
  message: 'select_location' | 'start_app';
  payload: {
    user: OkHiUser;
    auth: {
      authToken: string;
    };
    style?: OkHiStyle;
    context?: any;
    config?: {
      streetView: boolean;
      [key: string]: any;
    };
  };
}

export interface OkHiLocationManagerProps {
  auth: string;
  user: OkHiUser;
  config?: OkHiConfig;
  style?: OkHiStyle;
  onSuccess?: (location: OkHiLocation, user: OkHiUser) => any;
  onError?: (error: OkHiError) => any;
  loader?: JSX.Element;
}

export interface OkHiStyle {
  base?: {
    color?: string;
    name?: string;
    logo?: string;
  };
}

export class OkHiLocationManager extends React.Component<
  OkHiLocationManagerProps,
  {loading: boolean}
> {
  private readonly user: OkHiUser;
  private readonly auth: string | null;
  private readonly config: OkHiConfig | null;
  private readonly style: OkHiStyle | null;
  private readonly onSuccess:
    | ((location: OkHiLocation, user: OkHiUser) => any)
    | null;
  private readonly onError: ((error: OkHiError) => any) | null;
  private readonly loader: JSX.Element | null;

  private js: string | null;
  private authToken: string | null;
  private startPayload: OkHiLocationManagerStartPayload | null;

  constructor(props: any) {
    super(props);
    const {user, auth, config, style, onSuccess, onError, loader} = this.props;
    this.user = user;
    this.auth = auth || null;
    this.config = config || null;
    this.style = style || null;
    this.onSuccess = onSuccess || null;
    this.onError = onError || null;
    this.loader = loader || null;
    this.authToken = null;
    this.startPayload = null;
    this.js = null;
    this.state = {
      loading: true,
    };
    this.init();
  }

  private init = async () => {
    try {
      this.authToken = await this.fetchAuthToken();
      this.startPayload = {
        message: 'select_location',
        payload: {
          auth: {
            authToken: this.authToken,
          },
          user: this.user,
          style: this.style || undefined,
          config: {
            streetView:
              this.config && this.config.streetView
                ? this.config.streetView
                : false,
            appBar: {
              visible: false,
            },
          },
          context: this.context || undefined,
        },
      };
      this.js = `
      window.isNativeApp = true;
      window.NativeApp = {
        bridge: {
          receiveMessage: window.ReactNativeWebView.postMessage
        },
        data: ${JSON.stringify(this.startPayload)}
      }
      true;
      `;
      this.setState({loading: false});
    } catch (error) {
      if (this.onError) {
        this.onError({
          code: 'invalid_auth_token',
          message: 'Unable to establish a secure connection with remote server',
        });
      }
    }
  };

  private fetchAuthToken = async () => {
    try {
      const response = await fetch(
        'https://dev-api.okhi.io/v5/auth/mobile/generate-auth-token',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Token ${this.auth}`,
          },
        },
      );
      if (response.status !== 200) {
        throw new Error('invalid auth token');
      }
      const data: {authorization_token: string} = await response.json();
      if (!data.authorization_token) {
        throw new Error('authorization_token not provided');
      }
      return data.authorization_token;
    } catch (error) {
      throw error;
    }
  };

  handleFailure = () => {
    if (this.onError) {
      this.onError({
        code: 'fatal_exit',
        message: 'Something went wrong during the address creation process',
      });
    }
  };

  handleSuccess = (response: any) => {
    let {user, location} = response.payload;
    user = {
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      phone: user.phone || null,
      id: user.id || null,
    };
    location = {
      id: location.id || null,
      geoPoint:
        location.geo_point && location.geo_point.lat && location.geo_point.lon
          ? {lat: location.geo_point.lat, lon: location.geo_point.lon}
          : null,
      createdAt: location.created_at || null,
      userId: location.user_id || null,
      streetName: location.street_name || null,
      propertyName: location.property_name || null,
      placeId: location.place_id || null,
      photo: location.photo || null,
      url: location.url || null,
      plusCode: location.plus_code || null,
      title: location.title || location.display_title || null,
      otherInformation: location.other_information || null,
      directions: location.directions || null,
      streetView: !location.street_view
        ? null
        : {
            geoPoint: location.street_view.geo_point || null,
            panoId: location.street_view.pano_id || null,
            url: location.street_view.url || null,
          },
    };
    if (this.onSuccess) {
      this.onSuccess(location, user);
    }
  };

  handleOnMessage = (event: WebViewMessageEvent) => {
    try {
      const response: {
        message:
          | 'location_selected'
          | 'location_created'
          | 'location_updated'
          | 'fatal_exit';
        payload: {user: any; location: any} | string;
      } = JSON.parse(event.nativeEvent.data);
      if (response.message === 'fatal_exit') {
        this.handleFailure();
      } else {
        this.handleSuccess(response);
      }
    } catch (error) {
      if (this.onError) {
        this.onError({
          code: 'invalid_response',
          message: 'Invalid response received',
        });
      }
    }
  };

  render() {
    const {loading} = this.state;
    const {loader} = this;
    if (!loading && this.js) {
      return (
        <WebView
          source={{uri: 'https://dev-manager-v5.okhi.io'}}
          injectedJavaScriptBeforeContentLoaded={this.js}
          onMessage={this.handleOnMessage}
        />
      );
    } else if (loading && loader) {
      return loader;
    } else {
      return <ActivityIndicator />;
    }
  }
}
