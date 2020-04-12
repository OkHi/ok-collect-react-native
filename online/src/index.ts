import { OkHiUser, OkHiLocation, OkHiAppContext } from '@okhi/types';
import { ViewProps } from 'react-native';
import { WebViewProps } from 'react-native-webview';
import { OkHiLocationManager } from './OkHiLocationManager';

export interface OkHiAppBarConfiguration {
  visible?: boolean;
}

export interface OkHiConfig {
  streetView?: boolean;
  appBar?: OkHiAppBarConfiguration;
}

export interface OkHiError {
  code:
    | 'invalid_auth_token'
    | 'fatal_exit'
    | 'invalid_response'
    | 'network_request_failed'
    | 'invalid_phone';
  message: string;
}

export interface OkHiTheme {
  colors?: {
    primary: string;
  };
  appBar?: {
    backgroundColor?: string;
    logo?: string;
  };
}

export interface OkHiLocationManagerProps {
  auth: string;
  appContext: OkHiAppContext;
  user: OkHiUser;
  config?: OkHiConfig;
  theme?: OkHiTheme;
  loader?: JSX.Element;
  launch?: boolean;
  safeAreaViewProps?: ViewProps;
  webviewProps?: WebViewProps;
  onSuccess?: (location: OkHiLocation, user: OkHiUser) => any;
  onError?: (error: OkHiError) => any;
  onCloseRequest?: () => any;
}

export default OkHiLocationManager;
