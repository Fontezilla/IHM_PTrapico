// Importação dos módulos necessários do Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';

// Decorador que define o módulo compartilhado
@NgModule({
  declarations: [SearchHeaderComponent], // Declaração do componente de cabeçalho de pesquisa
  imports: [
    CommonModule, // Módulo comum do Angular
    FormsModule, // Módulo para formulários
    IonicModule // Módulo do Ionic
  ],
  exports: [SearchHeaderComponent] // Exporta o componente para uso em outros módulos
})
export class SharedModule {}