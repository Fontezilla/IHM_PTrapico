// Importação dos módulos necessários para testes
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

// Suite de testes para o serviço de API
describe('ApiService', () => {
  let service: ApiService; // Instância do serviço

  // Configuração antes de cada teste
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService); // Injeta o serviço
  });

  // Teste para verificar se o serviço é criado corretamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
