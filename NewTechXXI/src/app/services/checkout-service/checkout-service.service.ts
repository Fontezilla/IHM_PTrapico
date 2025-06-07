import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiEndpoints } from '../api/api-endpoints.enum';
import { Observable, forkJoin } from 'rxjs';

// Interface que define a estrutura de um produto no carrinho
export interface ProdutoCarrinho {
  id: number;
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

// Interface que define a estrutura das informações de pagamento
export interface PagamentoInfo {
  metodo: string;
  dados: string;
}

// Decorador que define o serviço como injetável e disponível globalmente
@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  // Propriedades privadas do serviço
  private tipoEntrega: 'LOJA' | 'MORADA' | null = null; // Tipo de entrega selecionado
  private moradaId: number | null = null; // ID da morada selecionada
  private lojaMorada: string | null = null; // Morada da loja selecionada
  private pagamento: PagamentoInfo | null = null; // Informações de pagamento
  private produtos: ProdutoCarrinho[] = []; // Lista de produtos no carrinho
  private total: number = 0; // Valor total da compra
  private carrinhoId: number | null = null; // ID do carrinho

  // ─── GETTERS ───────────────────────────────

  // Obtém o tipo de entrega selecionado
  getTipoEntrega(): 'LOJA' | 'MORADA' | null {
    return this.tipoEntrega;
  }

  // Obtém o ID da morada selecionada
  getMoradaId(): number | null {
    return this.moradaId;
  }

  // Obtém a morada da loja selecionada
  getLojaMorada(): string | null {
    return this.lojaMorada;
  }

  // Obtém as informações de pagamento
  getPagamento(): PagamentoInfo | null {
    return this.pagamento;
  }

  // Obtém a lista de produtos no carrinho
  getProdutos(): ProdutoCarrinho[] {
    return this.produtos;
  }

  // Obtém o valor total da compra
  getTotal(): number {
    return this.total;
  }

  // Obtém o ID do carrinho
  getCarrinhoId(): number | null {
    return this.carrinhoId;
  }

  // ─── SETTERS ───────────────────────────────

  // Define o tipo de entrega
  setTipoEntrega(tipo: 'LOJA' | 'MORADA') {
    this.tipoEntrega = tipo;
  }

  // Define o ID da morada
  setMoradaId(id: number) {
    this.moradaId = id;
  }

  // Define a morada da loja
  setLojaMorada(loja: string) {
    this.lojaMorada = loja;
  }

  // Define as informações de pagamento
  setPagamento(dados: PagamentoInfo) {
    this.pagamento = dados;
  }

  // Define a lista de produtos
  setProdutos(produtos: ProdutoCarrinho[]) {
    this.produtos = produtos;
  }

  // Define o valor total
  setTotal(valor: number) {
    this.total = valor;
  }

  // Define o ID do carrinho
  setCarrinhoId(id: number) {
    this.carrinhoId = id;
  }

  // ─── RESET ───────────────────────────────

  // Limpa todas as informações do checkout
  limparTudo() {
    this.tipoEntrega = null;
    this.moradaId = null;
    this.lojaMorada = null;
    this.pagamento = null;
    this.produtos = [];
    this.total = 0;
    this.carrinhoId = null;
  }

  // ─── VALIDACOES ───────────────────────────

  // Verifica se o tipo de entrega é válido
  isEntregaValida(): boolean {
    return this.tipoEntrega === 'LOJA' || this.tipoEntrega === 'MORADA';
  }

  // Verifica se a morada é válida
  isMoradaValida(): boolean {
    if (this.tipoEntrega === 'MORADA') {
      return this.moradaId !== null;
    } else if (this.tipoEntrega === 'LOJA') {
      return !!this.lojaMorada && this.lojaMorada.trim() !== '';
    }
    return false;
  }

  // Verifica se o pagamento é válido
  isPagamentoValido(): boolean {
    if (!this.pagamento || !this.pagamento.metodo) return false;

    if (this.pagamento.metodo === 'cartao') {
      const dados = this.pagamento.dados.split(';');
      return dados.length === 5 && dados.every(d => d.trim() !== '');
    }

    return true;
  }

  // Verifica se o checkout está completo
  isCheckoutCompleto(): boolean {
    return (
      this.isEntregaValida() &&
      this.isMoradaValida() &&
      this.isPagamentoValido() &&
      this.produtos.length > 0 &&
      this.total > 0
    );
  }

  // Finaliza a compra criando a encomenda e seus produtos
  async finalizarCompra(utilizadorId: number, api: ApiService): Promise<Observable<any>> {
    await api.ensureReady();

    // Prepara o payload da encomenda
    const encomendaPayload: any = {
      utilizador_id: utilizadorId,
      morada_id: this.tipoEntrega === 'MORADA' ? this.moradaId : null,
      estado: 'Pendente',
      total: this.total,
      local_entrega: this.tipoEntrega
    };

    // Adiciona a morada da loja se necessário
    if (this.tipoEntrega === 'LOJA') {
      encomendaPayload.loja_morada = this.lojaMorada;
    }

    // Cria a encomenda e seus produtos
    return new Observable<any>((observer) => {
      api.post(ApiEndpoints.ENCOMENDAS, encomendaPayload).subscribe({
        next: (encomenda) => {
          const encomendaId = encomenda.id;

          // Cria os produtos da encomenda
          const produtosRequests = this.produtos.map(p =>
            api.post(ApiEndpoints.ENCOMENDA_PRODUTOS, {
              encomenda_id: encomendaId,
              produto_id: p.produtoId,
              quantidade: p.quantidade,
              preco_unitario: p.precoUnitario
            })
          );

          // Executa todas as requisições de produtos em paralelo
          forkJoin(produtosRequests).subscribe({
            next: (res) => {
              this.limparTudo();
              observer.next({ encomenda, produtos: res });
              observer.complete();
            },
            error: (err) => observer.error(err)
          });
        },
        error: (err) => observer.error(err)
      });
    });
  }
}