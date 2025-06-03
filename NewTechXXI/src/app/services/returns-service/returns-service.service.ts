import { Injectable } from '@angular/core';

export interface DevolucaoDraft {
  produto_id: number;
  motivo?: string;
  imagemBase64?: string;
  faturaBase64?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  private draft: DevolucaoDraft | null = null;

  /**
   * Define o rascunho completo de uma devolução.
   * Substitui completamente qualquer draft anterior.
   */
  setDraft(draft: DevolucaoDraft): void {
    this.draft = draft;
  }

  /**
   * Atualiza apenas os campos fornecidos do draft atual.
   */
  updateDraft(data: Partial<DevolucaoDraft>): void {
    if (!this.draft) {
      console.warn('[ReturnService] Nenhum draft inicial definido.');
      return;
    }
    this.draft = { ...this.draft, ...data };
  }

  /**
   * Retorna o draft atual da devolução.
   */
  getDraft(): DevolucaoDraft | null {
    return this.draft;
  }

  /**
   * Limpa o draft armazenado em memória.
   */
  clearDraft(): void {
    this.draft = null;
  }
}
