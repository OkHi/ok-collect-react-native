import React from 'react';
import {OkHiLocationManager} from '../../lib/okcollect-online';

export default class AddAddress extends React.Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <OkHiLocationManager
        auth="SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU="
        user={{phone: '+254700110590'}}
      />
    );
  }
}
