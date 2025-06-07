// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponent } from './explore-container.component';

// Decorador que define o módulo do componente de exploração
@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule], // Importação dos módulos necessários
  declarations: [ExploreContainerComponent], // Declaração do componente
  exports: [ExploreContainerComponent] // Exporta o componente para uso em outros módulos
})
export class ExploreContainerComponentModule {}
