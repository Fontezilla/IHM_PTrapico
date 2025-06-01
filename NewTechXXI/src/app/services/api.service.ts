import { Inject, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string = '';

  constructor(
    private http: HttpClient,
    @Inject(Storage) private storage: Storage
  ) {
    this.init();
  }

  private async init() {
    await this.storage.create();
    this.baseUrl = (await this.storage.get('apiUrl')) || '';
  }

  public async ensureReady(): Promise<void> {
    if (!this.baseUrl) {
      await this.storage.create();
      this.baseUrl = (await this.storage.get('apiUrl')) || '';
    }
  }

  // Autenticação
  login(identificador: string, password: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/utilizadores/login`,
      { identificador, password }
    );
  }

  // CRUD genérico
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, data);
  }

  put(endpoint: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${endpoint}`, data);
  }

  delete(endpoint: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`);
  }

  // ─── NOVOS MÉTODOS ───────────────────────────────

  /**
   * Envia um FormData (por exemplo, para criar/atualizar produto com imagem).
   * @param endpoint ex: 'produtos'
   * @param formData objeto FormData já preenchido com campos + arquivo 'image'
   */
  postForm(endpoint: string, formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${endpoint}`,
      formData
    );
  }

  /**
   * Atualiza usando FormData (quando há imagem opcional).
   * @param endpoint ex: 'produtos'
   * @param id id do recurso a atualizar
   * @param formData objeto FormData
   */
  putForm(endpoint: string, id: number | string, formData: FormData): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/${endpoint}/${id}`,
      formData
    );
  }

  /**
   * Busca a imagem (BYTEA) e devolve como Blob.
   * Útil para converter em objectURL ou mostrar diretamente num <img>.
   * @param endpoint  ex: 'produtos'
   * @param id        id do produto
   */
  getImageBlob(endpoint: string, id: number | string): Observable<Blob> {
    return this.http.get(
      `${this.baseUrl}/${endpoint}/${id}/imagem`,
      { responseType: 'blob' }
    );
  }
}
