import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';
import { AlertController } from '@ionic/angular';

// Interface que define a estrutura de uma avaliação
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

// Interface que define a estrutura de um produto
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

// Decorador que define este componente como uma página de detalhes do produto
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: false
})
export class ProductDetailsPage implements OnInit {
  product: Product | null = null; // Produto atual
  productId!: number; // ID do produto
  carrinhoId: number | null = null; // ID do carrinho
  utilizadorId!: number; // ID do utilizador
  searchExpanded: boolean = false; // Estado da barra de pesquisa

  // Construtor que injeta os serviços necessários
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private apiService: ApiService,
    private toastCtrl: ToastController,
    private storage: Storage,
    private sanitizer: DomSanitizer,
    private alertCtrl: AlertController
  ) {}

  // Método chamado quando o componente é inicializado
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

    await this.initCarrinho(); // Inicializa o carrinho

    this.loadProduct(); // Carrega os dados do produto
  }

  // Método para mostrar uma mensagem toast
  private async showToast(message: string, color: 'success' | 'warning' | 'danger', buttons?: any[]) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      buttons: buttons || []
    });
    await toast.present();
  }

  // Método para inicializar o carrinho do utilizador
  private initCarrinho(): Promise<void> {
    console.log('initCarrinho chamado com utilizadorId:', this.utilizadorId);
    return new Promise<void>((resolve) => {
      this.apiService
        .get(`${ApiEndpoints.CARRINHOS}/utilizador/${this.utilizadorId}`)
        .subscribe(
          async (res: any[]) => {
            if (res && res.length > 0) {
              this.carrinhoId = res[0].id;

              // Guarda o ID do carrinho no storage
              await this.storage.set('carrinho_id', this.carrinhoId);

              resolve();
            } else {
              const payloadCreate = { utilizador_id: this.utilizadorId };
              this.apiService.post(ApiEndpoints.CARRINHOS, payloadCreate).subscribe(
                async (novoCarrinho: any) => {
                  this.carrinhoId = novoCarrinho.id;

                  // Guarda o ID do carrinho no storage
                  await this.storage.set('carrinho_id', this.carrinhoId);

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

  // Método para carregar os dados do produto
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

        // Carrega a imagem do produto
        this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, this.productId).subscribe({
          next: (blob: Blob) => {
            this.product!.image = URL.createObjectURL(blob);
          },
          error: () => {
            this.product!.image = 'assets/images/no_image.jpg';
          }
        });

        // Carrega o nome da categoria
        const catId = this.product!.categoryId;
        if (catId != null) {
          this.apiService.get(`${ApiEndpoints.CATEGORIAS}/${catId}`).subscribe(
            (catRes: any) => {
              this.product!.categoryName = catRes.nome ?? catRes.name ?? '';
            },
            () => (this.product!.categoryName = '')
          );
        }

        // Carrega as avaliações do produto
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

  // Método para voltar à página anterior
  voltar() {
    this.navCtrl.back();
  }

  // Método para adicionar o produto ao carrinho
  async adicionarAoCarrinho() {
    if (!this.carrinhoId) {
      await this.showToast('Carrinho não disponível no momento.', 'warning');
      return;
    }

    this.apiService.get(`${ApiEndpoints.CARRINHO_PRODUTOS}?carrinho_id=${this.carrinhoId}`).subscribe(
      async (existingItems: any[]) => {
        const existingItem = existingItems.find(item => item.produto_id === this.productId);

        if (existingItem) {
          const novaQuantidade = existingItem.quantidade + 1;
          this.apiService.put(`${ApiEndpoints.CARRINHO_PRODUTOS}/${existingItem.id}`, { quantidade: novaQuantidade }).subscribe(
            async () => {
              await this.showToast('Quantidade do produto atualizada no carrinho.', 'success', [
                {
                  text: 'Ver carrinho',
                  handler: () => {
                    this.navCtrl.navigateForward('/tabs/cart');
                  }
                }
              ]);
            },
            async (err) => {
              console.error('Erro ao atualizar a quantidade do produto:', err.error || err);
              await this.showToast('Não foi possível atualizar a quantidade do produto no carrinho.', 'danger');
            }
          );
        } else {
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
              console.error('Erro ao adicionar produto ao carrinho:', err.error || err);
              await this.showToast('Não foi possível adicionar o produto ao carrinho.', 'danger');
            }
          );
        }
      },
      async (err) => {
        console.error('Erro ao verificar produtos no carrinho:', err.error || err);
        await this.showToast('Não foi possível verificar os produtos no carrinho.', 'danger');
      }
    );
  }

  // Método para calcular a média das avaliações
  getAverageRating(): number {
    if (!this.product?.reviews || this.product.reviews.length === 0) {
      return 0;
    }
    const sum = this.product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / this.product.reviews.length;
  }

  // Método para escrever uma avaliação
  async escreverAvaliacao() {
    // Implementação pendente
  }

  // Referência ao componente de pesquisa
  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;

  // Método para colapsar a barra de pesquisa
  collapseSearchBar() {
  }
}
