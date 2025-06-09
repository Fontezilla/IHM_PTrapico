// Importação dos módulos necessários do Angular
import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Decorador que define o componente ReturnSuccessPage
@Component({
  selector: 'app-return-success',
  templateUrl: './return-success.page.html',
  styleUrls: ['./return-success.page.scss'],
  standalone: false,
})
export class ReturnSuccessPage {
  // Injeção do serviço Router para navegação
  constructor(private router: Router) {}

  // Método para voltar à página inicial da loja
  voltarParaLoja() {
    this.router.navigate(['/tabs/home']);
  }
}
