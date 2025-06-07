// Importação dos módulos necessários do Angular e Ionic
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

// Importação do módulo de rotas específico da página
import { ConnectionCheckPageRoutingModule } from './connection-check-routing.module';

// Importação do componente da página
import { ConnectionCheckPage } from './connection-check.page';

// Decorador que define o módulo da página de verificação de conexão
@NgModule({
  imports: [
    CommonModule, // Módulo comum do Angular
    FormsModule, // Módulo para formulários
    IonicModule, // Módulo do Ionic
    ConnectionCheckPageRoutingModule // Módulo de rotas específico
  ],
  declarations: [ConnectionCheckPage] // Declaração do componente da página
})
export class ConnectionCheckPageModule {}
