import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';
import { SplashScreen } from '@capacitor/splash-screen';
import { StringService } from './services/string/string.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform, private stringService: StringService) {
    this.platform.ready().then(async () => {
      await ScreenOrientation.lock({ orientation: 'portrait' });
      await this.stringService.loadStrings();
      this.initializeApp();
    });
  }

  
  initializeApp() {
    setTimeout(() => {
      SplashScreen.hide(); 
    }, 5000);
  }
}
