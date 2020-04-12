/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import OkHi, {OkHiMode, OkHiPlatformType} from '@okhi/core';

OkHi.init('SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU=', {
  app: {name: 'OkCollect Online Demo App', version: '1.0.0'},
  platform: {name: OkHiPlatformType.HYBRID},
  mode: OkHiMode.DEV,
  developer: 'okhi',
});

AppRegistry.registerComponent(appName, () => App);
