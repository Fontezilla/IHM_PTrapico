// Importação dos módulos necessários do Angular
import { Component, Input } from '@angular/core';

// Decorador que define o componente de exploração
@Component({
  selector: 'app-explore-container', // Seletor do componente
  templateUrl: './explore-container.component.html', // Template HTML
  styleUrls: ['./explore-container.component.scss'], // Estilos SCSS
  standalone: false, // Componente não autónomo
})
export class ExploreContainerComponent {
  @Input() name?: string; // Propriedade de entrada opcional para o nome
}
