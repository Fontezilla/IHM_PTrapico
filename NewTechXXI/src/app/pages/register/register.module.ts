// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas e do componente de registo
import { RegisterPageRoutingModule } from './register-routing.module';
import { RegisterPage } from './register.page';

// Definição do módulo de registo
@NgModule({
  imports: [
    CommonModule,        // Módulo comum do Angular
    FormsModule,         // Módulo para formulários básicos
    ReactiveFormsModule, // Módulo para formulários reativos
    IonicModule,         // Módulo do Ionic
    RegisterPageRoutingModule // Módulo de rotas do registo
  ],
  declarations: [RegisterPage] // Declaração do componente de registo
})
export class RegisterPageModule {}
