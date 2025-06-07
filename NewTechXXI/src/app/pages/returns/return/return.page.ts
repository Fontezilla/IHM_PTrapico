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
  // Lista de produtos recentes do utilizador
  recentProducts: any[] = [];
  // Produto selecionado para devolução
  selectedProduct: any = null;
  // ID do utilizador atual
  utilizadorId: number = 0;

  constructor(
    private api: ApiService,
    private storage: Storage,
    private returnService: ReturnService,
    private router: Router,
    private navCtrl: NavController
  ) {}

  // Inicialização do componente
  async ngOnInit() {
    // Obtenção dos dados do utilizador do storage
    const raw = await this.storage.get('utilizador');
    const utilizador = typeof raw === 'string' ? JSON.parse(raw) : raw;

    if (utilizador?.id) {
      this.utilizadorId = utilizador.id;
      this.carregarProdutosRecentes();
    } else {
      console.error('ID do utilizador não encontrado no storage.');
    }
  }

  // Método para carregar os produtos recentes do utilizador
  carregarProdutosRecentes() {
    this.api.get(`${ApiEndpoints.ENCOMENDAS}/encomendas-recentes/${this.utilizadorId}`)
      .subscribe((produtos: any[]) => {
        const vistos = new Set<number>();
        const unicos: any[] = [];

        // Eliminar produtos repetidos (por produto_id)
        for (let p of produtos) {
          if (!vistos.has(p.produto_id)) {
            vistos.add(p.produto_id);
            unicos.push({ ...p }); // copia do objeto
          }
        }

        // Buscar nome e imagem de cada produto
        unicos.forEach((p) => {
          // Obtenção do nome do produto
          this.api.get(`${ApiEndpoints.PRODUTOS}/${p.produto_id}`).subscribe({
            next: (produtoCompleto: any) => {
              console.log('📦 Produto carregado:', produtoCompleto);
              p.name = produtoCompleto.name || 'Produto';
            },
            error: () => {
              p.name = 'Produto desconhecido';
            }
          });

          // Obtenção da imagem do produto
          this.api.getImageBlob(ApiEndpoints.PRODUTOS, p.produto_id).subscribe({
            next: (blob: Blob) => {
              p.image = URL.createObjectURL(blob);
            },
            error: () => {
              p.image = 'assets/images/no_image.jpg';
            }
          });
        });

        this.recentProducts = unicos;
      }, (erro) => {
        console.error('Erro ao carregar produtos recentes:', erro);
      });
  }

  // Método para selecionar/desselecionar um produto
  selectProduct(prod: any) {
    // Alterna entre selecionar e desselecionar
    if (this.selectedProduct?.produto_id === prod.produto_id) {
      this.selectedProduct = null;
    } else {
      this.selectedProduct = prod;
    }
  }

  // Método para avançar para a página de detalhes da devolução
  proceedToDetails() {
    if (!this.selectedProduct) return;

    // Inicialização do rascunho da devolução
    this.returnService.setDraft({
      produto_id: this.selectedProduct.produto_id,
      motivo: '',
      imagemBase64: '',
      faturaBase64: ''
    });

    this.router.navigate(['/return-details']);
  }

  // Método para voltar à página anterior
  voltar() {
    this.navCtrl.back();
  }
}
