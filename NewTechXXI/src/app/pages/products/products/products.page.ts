import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { Location } from '@angular/common';
import { ViewChild } from '@angular/core';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';

export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number | null;
  description?: string;
  stock?: number;
  destaque?: boolean;
  categoryId?: number;
  categoryid?: number;
  marca: string;
  brand?: string;
  avaliacao?: number;
  vendas?: number;
  desconto?: number;
  image: string;
}

interface Category {
  id: number;
  nome: string;
}

@Component({
  selector: 'app-produtos-por-categoria',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
  standalone: false
})
export class ProductsPage implements OnInit {

  nomeCategoria = 'Produtos';
  termoPesquisa = '';

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];

  currentPage: number = 1;
  pageSize: number = 12;

  pesquisaAberta = false;
  filtroMenuAberto = false;
  ordenarMenuAberto = false;

  filtroMarcas: string[] = [];
  marcasDisponiveis: string[] = [];
  filtroAvaliacao: number | null = null;

  searchExpanded: boolean = false;

  selectedOrder = 'relevancia';
  opcoesOrdenacao = [
    { label: 'Relevância', value: 'relevancia' },
    { label: 'Melhor avaliação', value: 'melhor-avaliacao' },
    { label: 'Mais vendidos', value: 'mais-vendidos' },
    { label: 'Melhor desconto', value: 'melhor-desconto' },
    { label: 'Preço mais alto', value: 'preco-desc' },
    { label: 'Preço mais baixo', value: 'preco-asc' }
  ];

  mostrarTodasMarcas = false;

  selectedPrecoMin: number | null = null;
  selectedPrecoMax: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoriaId = params.get('id');
      console.log('[DEBUG] Categoria ID:', categoriaId);
      if (categoriaId) {
        this.carregarProdutosPorCategoriaId(categoriaId);
      }
    });

    this.route.queryParams.subscribe(params => {
      const nome = params['nome'];
      console.log('[DEBUG] Nome de pesquisa (queryParam):', nome);
      if (nome) {
        this.nomeCategoria = `Resultados para "${nome}"`;
        this.termoPesquisa = nome;
        this.carregarProdutosPorNome(nome);
      } else if (!this.route.snapshot.paramMap.get('id')) {
        this.nomeCategoria = 'Todos os produtos';
        this.termoPesquisa = '';
        this.carregarTodosOsProdutos();
      }
    });
  }

  voltar(): void {
    this.location.back();
  }

  abrirPesquisa(): void {
    this.pesquisaAberta = true;
  }

  fecharPesquisa(): void {
    this.pesquisaAberta = false;
    this.termoPesquisa = '';
    this.aplicarFiltro();
  }

  onPesquisar(): void {
    console.log('[DEBUG] Termo de pesquisa:', this.termoPesquisa);
    this.aplicarFiltro();
  }

  toggleFiltro(): void {
    this.filtroMenuAberto = !this.filtroMenuAberto;
  }

  fecharFiltro(): void {
    this.filtroMenuAberto = false;
  }

  toggleOrdenar(): void {
    this.ordenarMenuAberto = !this.ordenarMenuAberto;
  }

  fecharOrdenar(): void {
    this.ordenarMenuAberto = false;
  }

  toggleMarca(marca: string): void {
    const idx = this.filtroMarcas.indexOf(marca);
    if (idx >= 0) {
      this.filtroMarcas.splice(idx, 1);
    } else {
      this.filtroMarcas.push(marca);
    }
    console.log('[DEBUG] Marcas filtradas:', this.filtroMarcas);
    this.aplicarFiltro();
  }

  limparFiltro(): void {
    this.filtroMarcas = [];
    this.selectedPrecoMin = null;
    this.selectedPrecoMax = null;
    this.filtroAvaliacao = null;
    console.log('[DEBUG] Filtros limpos');
    this.aplicarFiltro();
  }

  setPrecoRapido(min: number, max: number | null): void {
    this.selectedPrecoMin = min;
    this.selectedPrecoMax = max;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    const termo = this.termoPesquisa?.toLowerCase().trim() ?? '';
    console.log('[DEBUG] Aplicar filtros. Termo:', termo);

    this.filteredProducts = this.allProducts.filter(prod => {
      const nomeOk = this.route.snapshot.queryParamMap.has('nome')
        ? prod.name.toLowerCase().includes(termo)
        : true;

      const marcaOk = this.filtroMarcas.length === 0 ||
        this.filtroMarcas.includes(prod.marca ?? prod.brand ?? '');

      const precoOk =
        (this.selectedPrecoMin === null || prod.price >= this.selectedPrecoMin) &&
        (this.selectedPrecoMax === null || prod.price <= this.selectedPrecoMax);

      const avaliacaoOk =
        !this.filtroAvaliacao || (prod.avaliacao ?? 0) >= this.filtroAvaliacao;

      return nomeOk && marcaOk && precoOk && avaliacaoOk;
    });

    console.log('[DEBUG] Produtos filtrados (length):', this.filteredProducts.length);
    console.log('[DEBUG] Produtos filtrados (lista):', this.filteredProducts);
    this.ordenarProdutos(this.selectedOrder);
  }

  ordenarProdutos(criterio: string): void {
    this.selectedOrder = criterio;
    console.log('[DEBUG] Ordenar por:', criterio);

    switch (criterio) {
      case 'preco-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'preco-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'melhor-avaliacao':
        this.filteredProducts.sort((a, b) => (b.avaliacao ?? 0) - (a.avaliacao ?? 0));
        break;
      case 'mais-vendidos':
        this.filteredProducts.sort((a, b) => (b.vendas ?? 0) - (a.vendas ?? 0));
        break;
      case 'melhor-desconto':
        this.filteredProducts.sort((a, b) => (b.desconto ?? 0) - (a.desconto ?? 0));
        break;
    }

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  private processarProdutos(produtos: any[]): void {
    console.log('[DEBUG] Produtos recebidos da API:', produtos);
    this.allProducts = [];
    const temp: Product[] = [];

    if (produtos.length === 0) {
      console.warn('[DEBUG] Nenhum produto encontrado');
      this.filteredProducts = [];
      return;
    }

    produtos.forEach((p: any) => {
      const prod: Product = {
        id: p.id,
        name: p.nome ?? p.name ?? '',
        price: Number(p.preco ?? p.price),
        oldPrice: p.preco_antigo ?? p.oldPrice ?? null,
        description: p.descricao ?? p.description,
        stock: p.stock,
        destaque: p.destaque,
        marca: p.marca ?? p.brand,
        brand: p.brand,
        avaliacao: p.avaliacao,
        vendas: p.vendas,
        desconto: p.desconto,
        categoryId: p.categoryId,
        categoryid: p.categoryid ?? p.categoryId,
        image: 'assets/images/no_image.jpg'
      };

      temp.push(prod);

      this.apiService.getImageBlob(ApiEndpoints.PRODUTOS, p.id).subscribe({
        next: (blob: Blob) => {
          prod.image = URL.createObjectURL(blob);
        },
        error: () => {
          prod.image = 'assets/images/no_image.jpg';
        }
      });
    });

    this.allProducts = temp;
    this.marcasDisponiveis = Array.from(
      new Set(this.allProducts.map(p => p.marca ?? p.brand).filter((m): m is string => !!m))
    );
    console.log('[DEBUG] Marcas disponíveis:', this.marcasDisponiveis);
    this.currentPage = 1;
    this.filteredProducts = [...this.allProducts];
    this.aplicarFiltro();
  }

  carregarProdutosPorCategoriaId(id: string): void {
    console.log('[DEBUG] Carregar produtos por categoria ID:', id);
    this.apiService.get(ApiEndpoints.CATEGORIAS).subscribe((categorias: Category[]) => {
      const categoria = categorias.find(c => String(c.id) === String(id));
      if (!categoria) {
        console.warn('[DEBUG] Categoria não encontrada:', id);
        this.nomeCategoria = 'Categoria não encontrada';
        this.termoPesquisa = '';
        this.allProducts = [];
        this.filteredProducts = [];
        return;
      }

      this.nomeCategoria = categoria.nome;
      this.termoPesquisa = categoria.nome;

      this.apiService.get(ApiEndpoints.PRODUTOS).subscribe((produtos: any[]) => {
        const filtrados = produtos.filter(p => {
          const catId = p.categoryId ?? p.categoryid ?? p.categoria_id;
          return catId != null && String(catId) === String(id);
        });
        this.processarProdutos(filtrados);
      });
    });
  }

  carregarProdutosPorNome(nome: string): void {
    console.log('[DEBUG] Carregar produtos por nome:', nome);
    this.apiService.get(ApiEndpoints.PRODUTOS).subscribe((produtos: any[]) => {
      const filtrados = produtos.filter(p =>
        (p.nome ?? p.name)?.toLowerCase().includes(nome.toLowerCase())
      );
      this.processarProdutos(filtrados);
    });
  }

  carregarTodosOsProdutos(): void {
    console.log('[DEBUG] Carregar todos os produtos');
    this.apiService.get(ApiEndpoints.PRODUTOS).subscribe((produtos: any[]) => {
      this.processarProdutos(produtos);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get pagedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(startIndex, startIndex + this.pageSize);
  }

  get pagesForDisplay(): Array<number | '...'> {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: Array<number | '...'> = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push('...');
    pages.push(total);

    return pages;
  }

  goToPage(pageOrEllipsis: number | string): void {
    if (typeof pageOrEllipsis === 'number' &&
        pageOrEllipsis >= 1 &&
        pageOrEllipsis <= this.totalPages) {
      this.currentPage = pageOrEllipsis;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;
  
  collapseSearchBar() {
    this.searchBar.collapseSearch();
  }

  abrirOrdenar(): void {
    this.ordenarMenuAberto = true;
  }

  abrirFiltro(): void {
    this.filtroMenuAberto = true;
  }
}