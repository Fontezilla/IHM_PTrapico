// Importação dos módulos necessários para testes
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';

// Suite de testes para o componente principal da aplicação
describe('AppComponent', () => {

  // Configuração antes de cada teste
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent], // Declaração do componente
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Esquema para elementos personalizados
    }).compileComponents();
  });

  // Teste para verificar se o componente é criado corretamente
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Cria o componente
    const app = fixture.componentInstance; // Obtém a instância
    expect(app).toBeTruthy();
  });

});
