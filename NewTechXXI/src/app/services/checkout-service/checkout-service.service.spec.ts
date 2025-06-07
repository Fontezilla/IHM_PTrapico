// Importação dos módulos necessários para testes
import { TestBed } from '@angular/core/testing';

import { CheckoutService } from './checkout-service.service';

// Suite de testes para o serviço de checkout
describe('CheckoutServiceService', () => {
  let service: CheckoutService; // Instância do serviço

  // Configuração antes de cada teste
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckoutService); // Injeta o serviço
  });

  // Teste para verificar se o serviço é criado corretamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
