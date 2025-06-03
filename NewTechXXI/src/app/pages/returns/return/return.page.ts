import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Storage } from '@ionic/storage-angular';
import { ReturnService } from 'src/app/services/returns-service/returns-service.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-return',
  templateUrl: './return.page.html',
  styleUrls: ['./return.page.scss'],
  standalone: false,
})
export class ReturnPage implements OnInit {
  recentProducts: any[] = [];
  selectedProduct: any = null;
  utilizadorId: number = 0;

  constructor(
    private api: ApiService,
    private storage: Storage,
    private returnService: ReturnService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    const raw = await this.storage.get('utilizador');
    const utilizador = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (utilizador?.id) {
      this.utilizadorId = utilizador.id;
      this.carregarProdutosRecentes();
    } else {
      console.error('ID do utilizador não encontrado no storage.');
    }
  }

  carregarProdutosRecentes() {
    this.api.get(`${ApiEndpoints.ENCOMENDAS}/encomendas-recentes/${this.utilizadorId}`)
      .subscribe((produtos: any[]) => {
        this.recentProducts = produtos;

        this.recentProducts.forEach((p) => {
          this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.produto_id).subscribe({
            next: (blob: Blob) => {
              p.image = URL.createObjectURL(blob);
            },
            error: () => {
              p.image = 'assets/images/no_image.jpg';
            }
          });
        });
      }, (erro) => {
        console.error('Erro ao carregar produtos recentes:', erro);
      });
  }

  selectProduct(prod: any) {
    this.selectedProduct = prod;
  }

  proceedToDetails() {
    if (!this.selectedProduct) return;

    this.returnService.setDraft({
      produto_id: this.selectedProduct.produto_id,
      motivo: '',
      imagemBase64: '',
      faturaBase64: ''
    });

    this.router.navigate(['/return-details']);
  }

  voltar() {
    this.navCtrl.back();
  }
}