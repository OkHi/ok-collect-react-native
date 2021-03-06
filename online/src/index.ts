import OkHiCore, {
  OkHiUser,
  OkHiLocation,
  OkHiError as OE,
  OkHiException,
} from '@okhi/core';
import { ViewProps } from 'react-native';
import { WebViewProps } from 'react-native-webview';
import { OkHiLocationManager } from './OkHiLocationManager';

export interface OkHiError extends OE {
  code:
    | 'invalid_auth_token'
    | 'fatal_exit'
    | 'invalid_response'
    | 'network_request_failed'
    | 'invalid_phone';
  message: string;
}

export interface OkHiLocationManagerAppBarConfiguration {
  visible?: boolean;
}

export interface OkHiLocationManagerConfig {
  streetView?: boolean;
  appBar?: OkHiLocationManagerAppBarConfiguration;
}

export interface OkHiLocationManagerTheme {
  colors?: {
    primary: string;
  };
  appBar?: {
    backgroundColor?: string;
    logo?: string;
  };
}

export interface OkHiLocationManagerProps {
  core: OkHiCore;
  user: OkHiUser;
  config?: OkHiLocationManagerConfig;
  theme?: OkHiLocationManagerTheme;
  loader?: JSX.Element;
  launch?: boolean;
  safeAreaViewProps?: ViewProps;
  webviewProps?: WebViewProps;
  onSuccess?: (location: OkHiLocation, user: OkHiUser) => any;
  onError?: (error: OkHiException) => any;
  onCloseRequest?: () => any;
}

export default OkHiLocationManager;
