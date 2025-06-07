// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas específico da página
import { ReturnSuccessPageRoutingModule } from './return-success-routing.module';

// Importação do componente da página
import { ReturnSuccessPage } from './return-success.page';

// Decorador que define o módulo ReturnSuccessPageModule
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReturnSuccessPageRoutingModule
  ],
  declarations: [ReturnSuccessPage]
})
export class ReturnSuccessPageModule {}
