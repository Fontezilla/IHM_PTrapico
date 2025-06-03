import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent {
  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      // Travar orientação para modo retrato
      ScreenOrientation.lock({ orientation: 'portrait' });
    });
  }
}
