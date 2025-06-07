// Importação dos módulos necessários para testes
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsPage } from './tabs.page';

// Suite de testes para o componente TabsPage
describe('TabsPage', () => {
  let component: TabsPage; // Instância do componente
  let fixture: ComponentFixture<TabsPage>; // Fixture para testes

  // Configuração antes de cada teste
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsPage], // Declaração do componente
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Esquema para elementos personalizados
    }).compileComponents();
  });

  // Inicialização antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage); // Cria o componente
    component = fixture.componentInstance; // Obtém a instância
    fixture.detectChanges(); // Detecta mudanças
  });

  // Teste para verificar se o componente é criado corretamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
