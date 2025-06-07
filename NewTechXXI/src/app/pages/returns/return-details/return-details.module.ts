// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Importação do módulo do Ionic
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas e do componente de detalhes da devolução
import { ReturnDetailsPageRoutingModule } from './return-details-routing.module';
import { ReturnDetailsPage } from './return-details.page';

// Importação do módulo de formulários reativos
import { ReactiveFormsModule } from '@angular/forms';

// Definição do módulo de detalhes da devolução
@NgModule({
  imports: [
    CommonModule,        // Módulo comum do Angular
    FormsModule,         // Módulo para formulários básicos
    IonicModule,         // Módulo do Ionic
    ReturnDetailsPageRoutingModule, // Módulo de rotas dos detalhes da devolução
    ReactiveFormsModule  // Módulo para formulários reativos
  ],
  declarations: [ReturnDetailsPage] // Declaração do componente de detalhes da devolução
})
export class ReturnDetailsPageModule {}
