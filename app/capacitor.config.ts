import { CapacitorConfig } from '@capacitor/cli';
import {LocalNotifications} from "@capacitor/local-notifications";

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'app',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LocalNotifications: {
      iconColor: '#488AFF',
    }
  }
};

export default config;
