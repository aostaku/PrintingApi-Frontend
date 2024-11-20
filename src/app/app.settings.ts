const env = (<any>window)?.env ?? {};
const appName = 'Smart POS PWA Prototype';

export const AppSettings = {
  appName: appName,
  appVersion: '1.0.0',
  appDescription: 'A Progressive Web App prototype for a Smart POS system.',
  localServerUrl: env.localServerUrl ?? 'http://localhost:5236',
  offlineServerUrl: 'http://localhost:44316',
};
