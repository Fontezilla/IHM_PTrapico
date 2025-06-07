import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { ApiEndpoints } from '../api/api-endpoints.enum';
import { Observable, forkJoin } from 'rxjs';

export interface ProdutoCarrinho {
  id: number;
  produtoId: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
}

export interface PagamentoInfo {
  metodo: string;
  dados: string;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private tipoEntrega: 'LOJA' | 'MORADA' | null = null;
  private moradaId: number | null = null;
  private lojaMorada: string | null = null;
  private pagamento: PagamentoInfo | null = null;
  private produtos: ProdutoCarrinho[] = [];
  private total: number = 0;
  private carrinhoId: number | null = null;

  // ─── GETTERS ───────────────────────────────

  getTipoEntrega(): 'LOJA' | 'MORADA' | null {
    return this.tipoEntrega;
  }

  getMoradaId(): number | null {
    return this.moradaId;
  }

  getLojaMorada(): string | null {
    return this.lojaMorada;
  }

  getPagamento(): PagamentoInfo | null {
    return this.pagamento;
  }

  getProdutos(): ProdutoCarrinho[] {
    return this.produtos;
  }

  getTotal(): number {
    return this.total;
  }

  getCarrinhoId(): number | null {
    return this.carrinhoId;
  }

  // ─── SETTERS ───────────────────────────────

  setTipoEntrega(tipo: 'LOJA' | 'MORADA') {
    this.tipoEntrega = tipo;
  }

  setMoradaId(id: number) {
    this.moradaId = id;
  }

  setLojaMorada(loja: string) {
    this.lojaMorada = loja;
  }

  setPagamento(dados: PagamentoInfo) {
    this.pagamento = dados;
  }

  setProdutos(produtos: ProdutoCarrinho[]) {
    this.produtos = produtos;
  }

  setTotal(valor: number) {
    this.total = valor;
  }

  setCarrinhoId(id: number) {
    this.carrinhoId = id;
  }

  // ─── RESET ───────────────────────────────

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

  isEntregaValida(): boolean {
    return this.tipoEntrega === 'LOJA' || this.tipoEntrega === 'MORADA';
  }

  isMoradaValida(): boolean {
    if (this.tipoEntrega === 'MORADA') {
      return this.moradaId !== null;
    } else if (this.tipoEntrega === 'LOJA') {
      return !!this.lojaMorada && this.lojaMorada.trim() !== '';
    }
    return false;
  }

  isPagamentoValido(): boolean {
    if (!this.pagamento || !this.pagamento.metodo) return false;

    if (this.pagamento.metodo === 'cartao') {
      const dados = this.pagamento.dados.split(';');
      return dados.length === 5 && dados.every(d => d.trim() !== '');
    }

    return true;
  }

  isCheckoutCompleto(): boolean {
    return (
      this.isEntregaValida() &&
      this.isMoradaValida() &&
      this.isPagamentoValido() &&
      this.produtos.length > 0 &&
      this.total > 0
    );
  }

  async finalizarCompra(utilizadorId: number, api: ApiService): Promise<Observable<any>> {
  await api.ensureReady();

  const encomendaPayload: any = {
    utilizador_id: utilizadorId,
    morada_id: this.tipoEntrega === 'MORADA' ? this.moradaId : null,
    estado: 'Pendente',
    total: this.total,
    local_entrega: this.tipoEntrega
  };

  if (this.tipoEntrega === 'LOJA') {
    encomendaPayload.loja_morada = this.lojaMorada;
  }


  return new Observable<any>((observer) => {
    api.post(ApiEndpoints.ENCOMENDAS, encomendaPayload).subscribe({
      next: (encomenda) => {
        const encomendaId = encomenda.id;

        const produtosRequests = this.produtos.map(p =>
          api.post(ApiEndpoints.ENCOMENDA_PRODUTOS, {
            encomenda_id: encomendaId,
            produto_id: p.produtoId,
            quantidade: p.quantidade,
            preco_unitario: p.precoUnitario
          })
        );

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