// Importação dos módulos necessários
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Decorador que define o componente de verificação de conexão
@Component({
  selector: 'app-connection-check', // Seletor do componente
  templateUrl: './connection-check.page.html', // Caminho para o template HTML
  styleUrls: ['./connection-check.page.scss'], // Caminho para o ficheiro de estilos
  standalone: false // Indica que o componente não é independente
})
export class ConnectionCheckPage implements OnInit {

  // Injeção dos serviços necessários no construtor
  constructor(
    private storage: Storage, // Serviço de armazenamento local
    private http: HttpClient, // Serviço para fazer requisições HTTP
    private router: Router // Serviço de navegação
  ) {}

  // Método chamado ao inicializar o componente
  async ngOnInit() {
    // Inicializa o armazenamento local
    await this.storage.create();
    // Obtém a URL da API armazenada
    const apiUrl = await this.storage.get('apiUrl');

    // Se não houver URL da API configurada, redireciona para as definições de conexão
    if (!apiUrl) {
      this.router.navigateByUrl('/connection-settings', { replaceUrl: true });
      return;
    }

    // Tenta fazer uma requisição de teste para a API
    this.http.get(`${apiUrl}/ping`, { responseType: 'text' }).subscribe({
      // Se a conexão for bem-sucedida, redireciona para a página de login
      next: () => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      // Se houver erro na conexão, redireciona para as definições de conexão após um pequeno delay
      error: () => {
        setTimeout(() => {
          this.router.navigateByUrl('/connection-settings', { replaceUrl: true });
        }, 250);
      }
    });
  }
}