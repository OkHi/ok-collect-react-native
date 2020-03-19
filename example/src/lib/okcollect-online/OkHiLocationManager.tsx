import React from 'react';
import {WebView} from 'react-native-webview';

export class OkHiLocationManager extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <WebView source={{uri: 'https://google.com'}} />;
  }
}
