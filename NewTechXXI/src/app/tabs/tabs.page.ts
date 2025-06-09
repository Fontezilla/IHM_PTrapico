// Importação dos módulos necessários
import { Component } from '@angular/core';

// Decorador que define o componente de tabs
@Component({
  selector: 'app-tabs', // Seletor do componente
  templateUrl: 'tabs.page.html', // Caminho para o template HTML
  styleUrls: ['tabs.page.scss'], // Caminho para o ficheiro de estilos
  standalone: false, // Indica que o componente não é independente
})
export class TabsPage {

  // Construtor do componente
  constructor() {}

}
