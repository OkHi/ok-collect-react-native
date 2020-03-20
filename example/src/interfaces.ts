import {OkHiLocation} from './lib/okcollect-online';

export interface User {
  firstName?: string;
  lastName?: string;
  phone: string;
}

export interface Store {
  user: User | null;
  addresses: Array<OkHiLocation>;
  setValues: (values: {user: User; address?: OkHiLocation}) => Promise<any>;
  [key: string]: any;
}
