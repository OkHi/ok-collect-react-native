import {OkHiUser, OkHiConfig, OkHiLocation, OkHiError, OkHiTheme} from './';
import {ViewProps} from 'react-native';
import {WebViewProps} from 'react-native-webview';

export interface OkHiLocationManagerProps {
  auth: string;
  mode?: number;
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