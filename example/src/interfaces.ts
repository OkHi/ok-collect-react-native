import {OkHiLocation} from '@okhi/core';

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
