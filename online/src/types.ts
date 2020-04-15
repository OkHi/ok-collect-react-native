import { OkHiUser } from '@okhi/core';

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

export interface OkHiLocationManagerResponse {
  message:
    | 'location_selected'
    | 'location_created'
    | 'location_updated'
    | 'exit_app'
    | 'fatal_exit';
  response: string | { user: any; location: any } | string;
}
