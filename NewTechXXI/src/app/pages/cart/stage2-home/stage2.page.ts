import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { CheckoutService } from 'src/app/services/checkout-service/checkout-service.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-stage2-home',
  templateUrl: './stage2-home.page.html',
  styleUrls: ['./stage2-home.page.scss'],
  standalone: false,
})
export class Stage2HomePage implements OnInit {
  total: number = 0;

  morada = {
    rua: '',
    codigoPostal: '',
    cidade: '',
    pais: ''
  };

  savedAddresses: any[] = [];
  selectedAddressId: number | null = null;
  isFormValid: boolean = false;
  utilizadorId!: number;

  constructor(
    private router: Router,
    private api: ApiService,
    private storage: Storage,
    private checkoutService: CheckoutService,
    private toastController: ToastController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.inicializarUtilizadorEMoradas();
    this.total = this.checkoutService.getTotal();
  }

  // Busca o utilizador do storage e as moradas associadas
  async inicializarUtilizadorEMoradas() {
    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) {
      // Proteção: se não houver login válido, redireciona
      this.router.navigateByUrl('/login');
      return;
    }

    const user = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    this.utilizadorId = user.id;

    this.api.get(`${ApiEndpoints.MORADAS}/utilizador/${this.utilizadorId}`).subscribe({
      next: (moradas) => {
        this.savedAddresses = moradas || [];
        console.log('Moradas recebidas:', moradas);
      },
      error: () => {
        this.savedAddresses = [];
      }
    });
  }

  // Atualiza flag do formulário válido
  checkFormValidity() {
    const { rua, codigoPostal, cidade, pais } = this.morada;
    this.isFormValid = !!(rua && codigoPostal && cidade && pais);
  }

  // Selecionar morada existente
  selectAddress(id: number) {
    this.selectedAddressId = id;
    this.isFormValid = true;
  }

  // Submeter morada nova ou usar morada existente
  async continuar() {
    if (!this.selectedAddressId && !this.isFormValid) {
      this.presentToast('Seleciona ou introduz uma morada.', 'warning');
      return;
    }

    if (this.selectedAddressId) {
      this.checkoutService.setMoradaId(this.selectedAddressId);
      this.router.navigateByUrl('/stage3');
      return;
    }

    // Verificar duplicado com comparação padronizada
    const normalizar = (str: string) => str.trim().toLowerCase();
    const existe = this.savedAddresses.some(addr =>
      normalizar(addr.rua) === normalizar(this.morada.rua) &&
      normalizar(addr.codigo_postal) === normalizar(this.morada.codigoPostal) &&
      normalizar(addr.cidade) === normalizar(this.morada.cidade) &&
      normalizar(addr.pais) === normalizar(this.morada.pais)
    );

    if (existe) {
      this.presentToast('Morada já existente. Seleciona-a abaixo ou introduz outra.', 'warning');
      return;
    }

    // Submeter nova morada
    const payload = {
      utilizador_id: this.utilizadorId,
      rua: this.morada.rua,
      cidade: this.morada.cidade,
      codigo_postal: this.morada.codigoPostal,
      pais: this.morada.pais
    };

    this.api.post(ApiEndpoints.MORADAS, payload).subscribe({
      next: (novaMorada) => {
        this.checkoutService.setMoradaId(novaMorada.id);
        this.presentToast('Morada registada com sucesso!', 'success');
        this.router.navigateByUrl('/stage3');
      },
      error: () => {
        this.presentToast('Erro ao criar morada. Tenta novamente.', 'danger');
      }
    });
  }

  // Toast reutilizável
  async presentToast(msg: string, color: 'success' | 'warning' | 'danger') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      color: color
    });
    await toast.present();
  }

  // Voltar para a etapa anterior
  goBack() {
    this.navCtrl.back();
  }
}