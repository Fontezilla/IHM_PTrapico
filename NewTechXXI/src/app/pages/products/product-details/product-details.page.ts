import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { ViewChild } from '@angular/core';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';

interface Review {
  id: number;
  produto_id: number;
  utilizador_id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  [key: string]: any;
}

interface Product {
  id: number;
  nome?: string;
  name?: string;
  preco?: number;
  price?: number;
  descricao?: string;
  description?: string;
  stock?: number;
  destaque?: boolean;
  categoryId?: number;
  categoryName?: string;
  marca?: string;
  brand?: string;
  avaliacao?: number;
  vendas?: number;
  desconto?: number;
  image?: string;
  reviews?: Review[];
  [key: string]: any;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: false
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null;
  productId!: number;
  carrinhoId: number | null = null;
  utilizadorId!: number;
  searchExpanded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    const rawId = this.route.snapshot.paramMap.get('id');
    if (!rawId) {
      await this.showToast('ID do produto não informado.', 'warning');
      this.navCtrl.back();
      return;
    }
    this.productId = Number(rawId);

    await this.storage.create();
    const rawUser = await this.storage.get('utilizador');
    if (!rawUser) {
      await this.showToast('Usuário não autenticado.', 'warning');
      this.navCtrl.back();
      return;
    }
    const userObj = typeof rawUser === 'string' ? JSON.parse(rawUser) : rawUser;
    this.utilizadorId = userObj.id;

    if (this.apiService.ensureReady) {
      await this.apiService.ensureReady();
    }

    await this.initCarrinho();
    this.loadProduct();
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger', buttons?: any[]) {
    const toast = await this.toastCtrl.create({ 
      message, 
      duration: 2000, 
      color, 
      buttons: buttons || []
    });
    await toast.present();
  }

  private initCarrinho(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.apiService
        .get(`${ApiEndpoints.CARRINHOS}?utilizador_id=${this.utilizadorId}`)
        .subscribe(
          (res: any[]) => {
            if (res && res.length > 0) {
              this.carrinhoId = res[0].id;
              resolve();
            } else {
              const payloadCreate = { utilizador_id: this.utilizadorId };
              this.apiService.post(ApiEndpoints.CARRINHOS, payloadCreate).subscribe(
                (novoCarrinho: any) => {
                  this.carrinhoId = novoCarrinho.id;
                  resolve();
                },
                async (err) => {
                  console.error('Erro ao criar carrinho:', err.error || err);
                  await this.showToast('Não foi possível criar carrinho.', 'danger');
                  resolve();
                }
              );
            }
          },
          async (err) => {
            console.error('Erro ao buscar carrinho:', err.error || err);
            await this.showToast('Não foi possível obter carrinho.', 'danger');
            resolve();
          }
        );
    });
  }

  private loadProduct() {
    this.apiService.get(`${ApiEndpoints.PRODUTOS}/${this.productId}`).subscribe(
      (res: any) => {
        this.product = {
          id: res.id,
          nome: res.nome ?? res.name,
          name: res.name ?? res.nome,
          preco: res.preco ?? res.price,
          price: res.price ?? res.preco,
          descricao: res.descricao ?? res.description,
          description: res.description ?? res.descricao,
          stock: res.stock,
          destaque: res.destaque,
          categoryId: res.categoryId ?? res.categoryid,
          categoryName: '',
          marca: res.marca,
          brand: res.brand,
          avaliacao: res.avaliacao,
          vendas: res.vendas,
          desconto: res.desconto,
          reviews: [],
          image: ''
        };

        this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, this.productId).subscribe({
          next: (blob: Blob) => {
            this.product!.image = URL.createObjectURL(blob);
          },
          error: () => {
            this.product!.image = 'assets/images/no_image.jpg';
          }
        });

        const catId = this.product!.categoryId;
        if (catId != null) {
          this.apiService.get(`${ApiEndpoints.CATEGORIAS}/${catId}`).subscribe(
            (catRes: any) => {
              this.product!.categoryName = catRes.nome ?? catRes.name ?? '';
            },
            () => (this.product!.categoryName = '')
          );
        }

        this.apiService
          .get(`${ApiEndpoints.AVALIACOES}?produto_id=${this.productId}`)
          .subscribe(
            (reviews: any[]) => {
              this.product!.reviews = reviews.map(r => ({
                id: r.id,
                produto_id: r.produto_id,
                utilizador_id: r.utilizador_id,
                userName: r.userName ?? 'Anónimo',
                rating: r.rating ?? r.pontuacao ?? 0,
                comment: r.comment ?? r.comentario ?? '',
                date: r.date ?? ''
              }));
            },
            () => (this.product!.reviews = [])
          );
      },
      async () => {
        await this.showToast('Erro ao carregar dados do produto.', 'danger');
      }
    );
  }

  voltar() {
    this.navCtrl.back();
  }

  async adicionarAoCarrinho() {
    if (!this.carrinhoId) {
      await this.showToast('Carrinho não disponível no momento.', 'warning');
      return;
    }

    const payload = {
      carrinho_id: this.carrinhoId,
      produto_id: this.productId,
      quantidade: 1
    };

    this.apiService.post(ApiEndpoints.CARRINHO_PRODUTOS, payload).subscribe(
      async () => {
        await this.showToast('Produto adicionado ao carrinho.', 'success', [
          {
            text: 'Ver carrinho',
            handler: () => {
              this.navCtrl.navigateForward('/tabs/cart');
            }
          }
        ]);
      },
      async (err) => {
        console.error('Erro ao adicionar ao carrinho:', err.error || err);
        await this.showToast('Não foi possível adicionar ao carrinho.', 'danger');
      }
    );
  }

  getAverageRating(): number {
    const reviews = this.product?.reviews ?? [];
    if (!reviews.length) return 0;
    const soma = reviews.map(r => r.rating).reduce((acc, curr) => acc + curr, 0);
    return soma / reviews.length;
  }

  escreverAvaliacao() {
    this.navCtrl.navigateForward(`/working-on-it`);
  }

  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;
  
  collapseSearchBar() {
    this.searchBar.collapseSearch();
  }
}