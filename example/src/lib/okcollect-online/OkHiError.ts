export interface OkHiError {
  code:
    | 'invalid_auth_token'
    | 'fatal_exit'
    | 'invalid_response'
    | 'network_request_failed'
    | 'invalid_phone';
  message: string;
}
