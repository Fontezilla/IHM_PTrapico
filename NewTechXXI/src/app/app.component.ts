// Importação dos módulos necessários do Angular e Ionic
import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ScreenOrientation } from '@capacitor/screen-orientation';

// Decorador que define este componente como o componente raiz da aplicação
@Component({
  selector: 'app-root', // Seletor usado para identificar este componente no HTML
  templateUrl: 'app.component.html', // Template HTML associado a este componente
  standalone: false // Indica que este componente não é independente
})
export class AppComponent {
  // Construtor do componente que injeta o serviço Platform
  constructor(private platform: Platform) {
    // Quando a plataforma estiver pronta, executa o código dentro do then
    this.platform.ready().then(() => {
      // Trava a orientação da tela para modo retrato (vertical)
      ScreenOrientation.lock({ orientation: 'portrait' });
    });
  }
}
