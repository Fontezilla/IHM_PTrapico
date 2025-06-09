// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReturnDetailsPage } from './return-details.page';

// Suite de testes para o componente ReturnDetailsPage
describe('ReturnDetailsPage', () => {
  let component: ReturnDetailsPage;
  let fixture: ComponentFixture<ReturnDetailsPage>;

  // Configuração antes de cada teste
  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Teste para verificar se o componente é criado com sucesso
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
