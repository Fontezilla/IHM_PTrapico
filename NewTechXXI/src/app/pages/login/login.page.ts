import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  emailOuTelefone: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private apiService: ApiService,
    private storage: Storage,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  async onSubmit() {
    try {
      const res: any = await this.apiService.post('utilizadores/login', {
        identificador: this.emailOuTelefone,
        password: this.password
      }).toPromise();

      const utilizador = res.utilizador;

      await this.storage.set('utilizador', utilizador);

      const searchKey = `searchHistory_user_${utilizador.id}`;
      const existingHistory = await this.storage.get(searchKey);

      if (!existingHistory) {
        await this.storage.set(searchKey, []);
      }

      this.router.navigateByUrl('/tabs/home');

    } catch (err) {
      this.mostrarAlerta('Login falhou', 'Credenciais inválidas. Verifica os dados introduzidos.');
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  esqueciSenha() {
    this.mostrarAlerta('Recuperar Palavra-passe', 'Funcionalidade não implementada nesta versão.');
  }

  loginWithGoogle() {
    this.mostrarAlerta('Google Login', 'Login com Google ainda não disponível.');
  }

  loginWithFacebook() {
    this.mostrarAlerta('Facebook Login', 'Login com Facebook ainda não disponível.');
  }

  irParaRegistar() {
    this.router.navigateByUrl('/register');
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }
}