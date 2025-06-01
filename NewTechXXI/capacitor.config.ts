import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'NewTechXXI',
  webDir: 'www',

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_INSIDE',
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;