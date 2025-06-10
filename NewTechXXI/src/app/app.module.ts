// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { HttpClientModule } from '@angular/common/http';

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
    HttpClientModule
  ],
  // Componente que será inicializado quando a aplicação iniciar
  bootstrap: [AppComponent],
})
export class AppModule {}
