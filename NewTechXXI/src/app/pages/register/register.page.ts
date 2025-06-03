import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  nome = '';
  email = '';
  telefone = '';
  password = '';
  showPassword = false;
  isLoading = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private apiService: ApiService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.isLoading) return;

    try {
      if (!this.validateForm()) {
        return;
      }

      const loading = await this.showLoading('A criar conta...');

      await this.apiService.ensureReady();

      const userData = {
        nome: this.nome.trim(),
        email: this.email.trim().toLowerCase(),
        telefone: this.telefone.trim(),
        password: this.password,
        dataCriacao: new Date().toISOString(),
        ativo: true
      };

      console.log('Enviando dados:', userData);

      this.apiService.post(ApiEndpoints.UTILIZADORES, userData).subscribe({
        next: async (response: any) => { 
          await loading.dismiss();
          console.log('Utilizador criado com sucesso:', response);
          
          await this.showAlert('Success', 'Conta criada com sucesso!');
          this.clearForm();
          this.router.navigate(['/login']);
        },
        error: async (error: any) => { 
          await loading.dismiss();
          console.error('Erro ao criar utilizador:', error);
          
          let errorMessage = 'Erro ao criar conta. Por favor tente novamente.';
          
          if (error.status === 409) {
            errorMessage = 'Email ou telemóvel já existe!';
          } else if (error.status === 400) {
            errorMessage = 'Informação inválida. Por favor verifique os dados!';
          } else if (error.status === 0) {
            errorMessage = 'Erro de conexão. Por favor verifique a sua internet.';
          }
          
          await this.showAlert('Error', errorMessage);
        }
      });

    } catch (error) {
      console.error('Erro inesperado:', error);
      await this.showAlert('Error', 'An unexpected error occurred.');
    }
  }

  private validateForm(): boolean {
    if (!this.nome.trim()) {
      this.showAlert('Error', 'Por favor introduza o seu nome completo.');
      return false;
    }
    
    if (this.nome.trim().length < 2) {
      this.showAlert('Error', 'O Nome deve ter no mínimo duas letras.');
      return false;
    }
    
    if (!this.email.trim() || !this.isValidEmail(this.email)) {
      this.showAlert('Error', 'Por favor tente um email válido.');
      return false;
    }
    
    if (!this.telefone.trim()) {
      this.showAlert('Error', 'Por favor introduza o seu número de telemóvel.');
      return false;
    }
    
    if (!this.isValidPhone(this.telefone)) {
      this.showAlert('Error', 'Por favor introduza um número de telemóvel válido.');
      return false;
    }
    
    if (!this.password.trim() || this.password.length < 6) {
      this.showAlert('Error', 'A password deve conter 6 digitos no mínimo.');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\+\-\(\)]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  private clearForm() {
    this.nome = '';
    this.email = '';
    this.telefone = '';
    this.password = '';
    this.showPassword = false;
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showLoading(message: string) {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message,
      spinner: 'crescent'
    });
    await loading.present();
    
    setTimeout(async () => {
      if (this.isLoading) {
        await loading.dismiss();
        this.isLoading = false;
      }
    }, 30000);
    
    return loading;
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
