// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo do Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas e do componente de devolução
import { ReturnPageRoutingModule } from './return-routing.module';
import { ReturnPage } from './return.page';

// Definição do módulo de devolução
@NgModule({
  imports: [
    CommonModule,        // Módulo comum do Angular
    FormsModule,         // Módulo para formulários básicos
    IonicModule,         // Módulo do Ionic
    ReturnPageRoutingModule // Módulo de rotas da devolução
  ],
  declarations: [ReturnPage] // Declaração do componente de devolução
})
export class ReturnPageModule {}
