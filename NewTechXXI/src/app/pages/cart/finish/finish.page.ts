// Importação dos módulos necessários
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// Decorador que define o componente FinishPage
@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
  standalone: false
})
export class FinishPage implements OnInit {

  // Injecção do serviço de navegação
  constructor(
    private router: Router
  ) { }

  // Método do ciclo de vida do Angular, chamado na inicialização
  ngOnInit() {
  }

  // Método para voltar à página inicial e continuar a comprar
  continuarComprando(): void {
    this.router.navigateByUrl('/tabs/home');
  }
}
