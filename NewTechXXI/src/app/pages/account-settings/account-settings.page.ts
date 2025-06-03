import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AlertController } from '@ionic/angular'; // <-- Adicionado

@Component({
  selector: 'app-account_settings',
  templateUrl: './account-settings.page.html',
  styleUrls: ['./account-settings.page.scss'],
  standalone: false
})
export class AccountSettingsPage  implements OnInit {
  profileOptions = [
    'Ver conta',
    'As minhas Compras',
    'Os meus Serviços',
    'Dados Pessoais',
    'Contas associadas',
    'Gestão de Moradas',
    'Notificações',
    'Preferencias de Comunicação',
    'Gestão de Cookies',
    'Terminar Sessão'
  ];

  userName: string = 'Utilizador';

  constructor(
    private router: Router,
    private storage: Storage,
    private alertCtrl: AlertController 
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const user = await this.storage.get('utilizador');
    this.userName = user?.nome || 'Utilizador';
  }

  async abrirNotificacoes() {
    const alert = await this.alertCtrl.create({
      header: "Notificações",
      message: "Funcionalidade de serviços não implementada nesta versão.",
      buttons: ['OK']
    });
    await alert.present();
  }

  async logout() {
    await this.storage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  handleOptionClick(option: string, event?: Event) {
    switch (option) {
      case 'Notificações':
        this.abrirNotificacoes();
        break;
      case 'Terminar Sessão':
        this.logout();
        break;
      default:
        let mensagem = '';
        switch (option) {
          case 'Ver conta':
            mensagem = 'Funcionalidade de ver conta não implementada nesta versão.';
            break;
          case 'As minhas Compras':
            mensagem = 'Funcionalidade de compras não implementada nesta versão.';
            break;
          case 'Os meus Serviços':
            mensagem = 'Funcionalidade de serviços não implementada nesta versão.';
            break;
          case 'Dados Pessoais':
            mensagem = 'Funcionalidade de dados pessoais não implementada nesta versão.';
            break;
          case 'Contas associadas':
            mensagem = 'Funcionalidade de contas associadas não implementada nesta versão.';
            break;
          case 'Gestão de Moradas':
            mensagem = 'Funcionalidade de gestão de moradas não implementada nesta versão.';
            break;
          case 'Preferencias de Comunicação':
            mensagem = 'Funcionalidade de preferências de comunicação não implementada nesta versão.';
            break;
          case 'Gestão de Cookies':
            mensagem = 'Funcionalidade de gestão de cookies não implementada nesta versão.';
            break;
          default:
            mensagem = 'Funcionalidade não implementada nesta versão.';
        }
        this.mostrarAlerta(option, mensagem);
        break;
    }
  }
}