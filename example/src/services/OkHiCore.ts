import OkHiCore, {OkHiMode} from '@okhi/core';

export default new OkHiCore({
  auth: 'SWF0ejlENkFOVDphZjNkZGQxMi00ZTI5LTQ1MDItODQyMS1iZTlkNmUzODcwZTU=',
  context: {
    mode: OkHiMode.DEV,
    app: {
      name: 'OkHi Demo App',
      version: '1.0.0',
    },
  },
});
