import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      ScreenOrientation.lock({ orientation: 'portrait' });
    });
  }
  
  initializeApp() {
    setTimeout(() => {
      SplashScreen.hide(); 
    }, 5000);
  }
}
