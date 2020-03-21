import {OkHiUser, OkHiConfig, OkHiStyle, OkHiLocation, OkHiError} from './';

export interface OkHiLocationManagerProps {
  auth: string;
  user: OkHiUser;
  config?: OkHiConfig;
  style?: OkHiStyle;
  onSuccess?: (location: OkHiLocation, user: OkHiUser) => any;
  onError?: (error: OkHiError) => any;
  loader?: JSX.Element;
  launch?: boolean;
  onCloseRequest?: () => any;
}
