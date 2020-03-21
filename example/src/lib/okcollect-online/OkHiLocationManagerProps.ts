import {OkHiUser, OkHiConfig, OkHiStyle, OkHiLocation, OkHiError} from './';
import {StyleProp, ViewStyle, ViewProps} from 'react-native';
import {WebViewProps} from 'react-native-webview';

export interface OkHiLocationManagerProps {
  auth: string;
  user: OkHiUser;
  config?: OkHiConfig;
  style?: OkHiStyle;
  loader?: JSX.Element;
  launch?: boolean;
  safeAreaViewProps?: ViewProps;
  webviewProps?: WebViewProps;
  onSuccess?: (location: OkHiLocation, user: OkHiUser) => any;
  onError?: (error: OkHiError) => any;
  onCloseRequest?: () => any;
}
