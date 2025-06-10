import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StringService {
  private strings: any = {};
  isLoaded = false;

  constructor(private http: HttpClient) {}

  async loadStrings(lang: string = 'pt'): Promise<void> {
    try {
      console.log('A tentar carregar:', `/assets/strings/${lang}.json`);
      const data = await firstValueFrom(this.http.get(`/assets/strings/${lang}.json`));
      this.strings = data;
      this.isLoaded = true;
      console.log('✅ JSON carregado:', this.strings);
    } catch (error) {
      console.error('❌ Erro ao carregar JSON:', error);
    }
  }

  getAll(): any {
    return this.strings;
  }
}