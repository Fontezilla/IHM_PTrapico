import { Injectable } from '@angular/core';

// Interface que define a estrutura de um rascunho de devolução
export interface DevolucaoDraft {
  produto_id: number; // ID do produto a ser devolvido
  motivo?: string; // Motivo da devolução (opcional)
  imagemBase64?: string; // Imagem do produto em base64 (opcional)
  faturaBase64?: string; // Imagem da fatura em base64 (opcional)
}

// Decorador que define o serviço como injetável e disponível globalmente
@Injectable({
  providedIn: 'root'
})
export class ReturnService {
  // Rascunho atual da devolução
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
