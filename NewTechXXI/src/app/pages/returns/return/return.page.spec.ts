// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnPage } from './return.page';

// Suite de testes para o componente ReturnPage
describe('ReturnPage', () => {
  let component: ReturnPage;
  let fixture: ComponentFixture<ReturnPage>;

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
