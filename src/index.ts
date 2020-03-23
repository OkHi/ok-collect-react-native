import {
  OkHiUser,
  OkHiConfig,
  OkHiLocation,
  OkHiError,
  OkHiTheme,
  OkHiAppContext,
} from '@okhi/types';
import { ViewProps } from 'react-native';
import { WebViewProps } from 'react-native-webview';
import { OkHiLocationManager } from './OkHiLocationManager';

export interface OkHiStyle {
  base?: {
    color?: string;
    name?: string;
    [key: string]: any;
  };
}

export interface OkHiLocationManagerStartPayload {
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
