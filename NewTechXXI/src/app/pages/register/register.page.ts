import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {
  formRegister!: FormGroup;
  showPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.formRegister = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Za-zÀ-ÿ\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', [Validators.required, Validators.pattern(/^[\d\s\+\-\(\)]{9,}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.formRegister.invalid || this.isLoading) return;

    const { nome, email, telefone, password } = this.formRegister.value;

    const userData = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefone: telefone.trim(),
      password: password,
      dataCriacao: new Date().toISOString(),
      ativo: true
    };

    const loading = await this.showLoading('A criar conta...');
    await this.apiService.ensureReady();

    this.apiService.post(ApiEndpoints.UTILIZADORES, userData).subscribe({
      next: async (res) => {
        await loading.dismiss();
        await this.showAlert('Successo', 'Conta criada com sucesso!');
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        await loading.dismiss();
        let msg = 'Erro ao criar conta. Tente novamente.';
        if (err.status === 409) msg = 'Email ou telemóvel já existe!';
        if (err.status === 400) msg = 'Informação inválida. Verifique os dados!';
        if (err.status === 0) msg = 'Erro de conexão. Verifique a sua internet.';
        await this.showAlert('Erro', msg);
      }
    });
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
