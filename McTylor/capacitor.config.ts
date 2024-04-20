import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'McTylor',
  webDir: 'www',
  server: {
    androidScheme: 'http',
    url: 'http://192.168.1.64:4200',
    cleartext: true
  }
};

export default config;
