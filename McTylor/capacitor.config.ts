import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'McTylor',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.1.14:4200'
  }
};

export default config;
