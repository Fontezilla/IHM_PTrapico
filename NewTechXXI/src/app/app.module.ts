// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';

// Decorador que define o módulo principal da aplicação
@NgModule({
  // Declaração dos componentes que pertencem a este módulo
  declarations: [
    AppComponent,
  ],
  // Importação dos módulos necessários para a aplicação
  imports: [
    BrowserModule, // Módulo necessário para aplicações web
    IonicModule.forRoot(), // Configuração do Ionic
    AppRoutingModule, // Módulo de rotas da aplicação
    IonicStorageModule.forRoot(), // Módulo para armazenamento local
  ],
  // Provedores de serviços disponíveis em toda a aplicação
  providers: [
    provideHttpClient() // Provedor para fazer requisições HTTP
  ],
  // Componente que será inicializado quando a aplicação iniciar
  bootstrap: [AppComponent],
})
export class AppModule {}
