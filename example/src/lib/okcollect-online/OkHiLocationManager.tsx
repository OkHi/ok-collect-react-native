import React from 'react';
import {ActivityIndicator, SafeAreaView, Modal, Platform} from 'react-native';
import {WebView, WebViewMessageEvent} from 'react-native-webview';
import OkHi, {OkHiUser, OkHiLocation, OkHiContext, OkHiMode} from '@okhi/core';
import {
  OkHiLocationManagerProps,
  OkHiLocationManagerConfig,
  OkHiLocationManagerTheme,
  OkHiError,
} from './index';

interface OkHiStyle {
  base?: {
    color?: string;
    name?: string;
    [key: string]: any;
  };
}

interface OkHiLocationManagerStartPayload {
  message: 'select_location' | 'start_app';
  payload: {
    user?: OkHiUser;
    auth?: {
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

interface OkHiLocationManagerResponse {
  message:
    | 'location_selected'
    | 'location_created'
    | 'location_updated'
    | 'exit_app'
    | 'fatal_exit';
  response: string | {user: any; location: any} | string;
}

export class OkHiLocationManager extends React.Component<
  OkHiLocationManagerProps,
  {loading: boolean; modalVisible: boolean}
> {
  private readonly LIB = {
    name: 'ok-collect-online-react-native',
    version: '1.0.2',
  };
  private readonly DEV_FRAME_URL = 'https://dev-manager-v5.okhi.io';
  private readonly PROD_FRAME_URL = 'https://manager-v5.okhi.io';
  private readonly SANDBOX_FRAME_URL = 'https://sandbox-manager-v5.okhi.io';
  private readonly FRAME_URL: string;
  private readonly user: OkHiUser;
  private readonly config: OkHiLocationManagerConfig | null;
  private readonly theme: OkHiLocationManagerTheme | null;
  private readonly onSuccess:
    | ((location: OkHiLocation, user: OkHiUser) => any)
    | null;
  private readonly onError: ((error: OkHiError) => any) | null;
  private jsBeforeLoad: string | null;
  private jsAfterLoad: string | null;
  private authToken: string | null;
  private startPayload: OkHiLocationManagerStartPayload | null;

  constructor(props: any) {
    super(props);
    const {user, config, onSuccess, onError, theme} = this.props;
    const context = OkHi.fetchContext();
    this.user = user;
    this.FRAME_URL =
      context && context.mode === OkHiMode.SANDBOX
        ? this.SANDBOX_FRAME_URL
        : context && context.mode === OkHiMode.PROD
        ? this.PROD_FRAME_URL
        : this.DEV_FRAME_URL;
    this.config = config || null;
    this.theme = theme || null;
    this.onSuccess = onSuccess || null;
    this.onError = onError || null;
    this.authToken = null;
    this.startPayload = null;
    this.jsBeforeLoad = null;
    this.jsAfterLoad = null;
    this.state = {
      loading: true,
      modalVisible: true,
    };
  }

  private init = async () => {
    try {
      this.authToken = await OkHi.fetchAuthToken();

      const message = 'select_location';

      const auth = this.authToken ? {authToken: this.authToken} : undefined;

      const user = this.user && this.user.phone ? this.user : undefined;

      const style = !this.theme
        ? undefined
        : {
            base: {
              color:
                this.theme.colors && this.theme.colors.primary
                  ? this.theme.colors.primary
                  : undefined,
              logo:
                this.theme.appBar && this.theme.appBar.logo
                  ? this.theme.appBar.logo
                  : undefined,
            },
          };

      const config = {
        streetView:
          this.config && typeof this.config.streetView === 'boolean'
            ? this.config.streetView
            : true,
        appBar: {
          visible:
            this.config &&
            this.config.appBar &&
            typeof this.config.appBar.visible === 'boolean'
              ? this.config.appBar.visible
              : true,
          color:
            this.theme && this.theme.appBar && this.theme.appBar.backgroundColor
              ? this.theme.appBar.backgroundColor
              : undefined,
        },
      };

      const okhiContext: OkHiContext = OkHi.fetchContext();

      const context: OkHiContext = {
        ...okhiContext,
        library: this.LIB,
      };

      const payload = {
        auth,
        user,
        style,
        config,
        context,
      };

      const isUserValid: {
        valid: boolean;
        formattedPhone?: string;
      } = this.verifyPhoneNumber(
        payload.user && payload.user.phone ? payload.user.phone : undefined,
      );

      if (!payload.user || !isUserValid.valid || !isUserValid.formattedPhone) {
        throw new Error('invalid user');
      } else {
        payload.user.phone = isUserValid.formattedPhone;
      }

      if (!payload.auth || !payload.auth.authToken) {
        throw new Error('invalid auth token');
      }

      this.startPayload = {message, payload};

      this.jsBeforeLoad = `
      window.isNativeApp = true;
      window.NativeApp = {
        bridge: {
          receiveMessage: window.ReactNativeWebView.postMessage
        },
        data: ${JSON.stringify(this.startPayload)}
      }
      true;
      `;

      this.jsAfterLoad = `
      window.startOkHiLocationManager({ 
        receiveMessage: function(data) { window.ReactNativeWebView.postMessage(data) } }, 
        ${JSON.stringify(this.startPayload)})
      `;

      this.setState({loading: false});
    } catch (error) {
      this.handleInitError(error);
    }
  };

  private verifyPhoneNumber = (phone = '') => {
    const regex = /^\+[1-9]\d{6,14}$/;
    let formattedPhone = phone.replace(/\s/g, '');
    formattedPhone =
      formattedPhone[0] === '+' ? formattedPhone : `+${formattedPhone}`;
    const response = {valid: regex.test(formattedPhone)};
    if (response.valid) {
      return {
        ...response,
        formattedPhone,
      };
    }
    return response;
  };

  private handleInitError = (error: any) => {
    const errorString = error.toString();
    if (errorString.includes('token') && this.onError) {
      this.onError({
        code: 'invalid_auth_token',
        message: 'Unable to establish a secure connection with remote server',
      });
    } else if (errorString.includes('user') && this.onError) {
      this.onError({
        code: 'invalid_phone',
        message:
          'Invalid phone number. Please add your phone number using the + country code format eg. +25472317838',
      });
    } else if (this.onError) {
      this.onError({
        code: 'network_request_failed',
        message: 'Unable to establish a secure connection with remote server',
      });
    }
  };

  private handleFailure = () => {
    if (this.onError) {
      this.onError({
        code: 'fatal_exit',
        message: 'Something went wrong during the address creation process',
      });
    }
  };

  private handleSuccess = (response: any) => {
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

  private handleExit = () => {
    if (typeof this.props.onCloseRequest === 'function') {
      this.props.onCloseRequest();
    }
  };

  private handleOnMessage = (event: WebViewMessageEvent) => {
    try {
      const response: OkHiLocationManagerResponse = JSON.parse(
        event.nativeEvent.data,
      );
      if (response.message === 'fatal_exit') {
        this.handleFailure();
      } else if (response.message === 'exit_app') {
        this.handleExit();
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

  renderContent = () => {
    if (!this.props.launch) {
      return null;
    }

    if (this.state.loading || !this.jsBeforeLoad || !this.jsAfterLoad) {
      this.init();
      if (this.props.loader) {
        return this.props.loader;
      }
      return <ActivityIndicator />;
    }

    const safeAreaViewProps = this.props.safeAreaViewProps || {};
    const webviewProps = this.props.webviewProps || {};
    const defaultSafeAreaViewStyles = {flex: 1};
    const safeAreaViewStyles: {} =
      safeAreaViewProps && safeAreaViewProps.style
        ? safeAreaViewProps.style
        : {};

    return (
      <SafeAreaView
        {...safeAreaViewProps}
        style={{...safeAreaViewStyles, ...defaultSafeAreaViewStyles}}>
        <WebView
          {...webviewProps}
          source={{uri: this.FRAME_URL}}
          injectedJavaScriptBeforeContentLoaded={
            Platform.OS === 'ios' ? this.jsBeforeLoad : undefined
          }
          injectedJavaScript={
            Platform.OS === 'ios' ? undefined : this.jsAfterLoad
          }
          onMessage={this.handleOnMessage}
        />
      </SafeAreaView>
    );
  };

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.launch}>
        {this.renderContent()}
      </Modal>
    );
  }
}
