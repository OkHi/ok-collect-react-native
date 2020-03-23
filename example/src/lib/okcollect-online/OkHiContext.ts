export const OkHiMode = {
  SANDBOX: 'sandbox',
  PROD: 'prod',
  DEV: 'dev',
};

export const OkHiPlatformType = {
  WEB: 'web',
  ANDROID: 'android',
  IOS: 'ios',
  HYBRID: 'hybrid',
  DESKTOP: 'desktop',
};

export const OkHiIntergrationType = {
  OKHI: 'okhi',
  EXTERNAL: 'external',
};

export interface OkHiAppContext {
  app: {name: string; version: string; build: number};
  mode: string;
  platform: {name: string};
  developer?: {name: string};
}
