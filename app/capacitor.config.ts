import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'online.refuapp.app',
  appName: 'RefuApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
