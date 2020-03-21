export interface OkHiError {
  code:
    | 'invalid_auth_token'
    | 'fatal_exit'
    | 'invalid_response'
    | 'invalid_phone';
  message: string;
}
