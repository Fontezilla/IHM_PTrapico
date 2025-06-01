import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

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
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const user = await this.storage.get('utilizador');
    this.userName = user?.nome || 'Utilizador';
  }

  abrirNotificacoes() {
    this.router.navigate(['/notificacoes']);
  }

  navigateToWorkingOnIt() {
    this.router.navigate(['/working-on-it']);
  }

  async logout() {
    await this.storage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  handleOptionClick(option: string) {
    switch (option) {
      case 'Notificações':
        this.abrirNotificacoes();
        break;
      case 'Terminar Sessão':
        this.logout();
        break;
      default:
        this.navigateToWorkingOnIt();
        break;
    }
  }
}
