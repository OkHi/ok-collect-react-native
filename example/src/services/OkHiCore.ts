import OkHiCore, {OkHiMode} from '@okhi/core';

export default new OkHiCore({
  auth: 'eHVBR2dseGlmUTpiYTMxYTE1Zi1kODE3LTRjZDQtYmM1MC1lNDY5ZGUwZDM5NmE=',
  context: {
    mode: OkHiMode.DEV,
    app: {
      name: 'OkHi Demo App',
      version: '1.0.0',
    },
  },
});
