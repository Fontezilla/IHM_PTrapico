// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas específico da página
import { LoginPageRoutingModule } from './login-routing.module';

// Importação do componente da página
import { LoginPage } from './login.page';

// Decorador que define o módulo LoginPageModule
@NgModule({
  // Importação dos módulos necessários para esta página
  imports: [
    CommonModule, // Módulo com diretivas comuns do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    LoginPageRoutingModule // Módulo de rotas específico da página de login
  ],
  // Declaração do componente LoginPage neste módulo
  declarations: [LoginPage]
})
export class LoginPageModule {}
