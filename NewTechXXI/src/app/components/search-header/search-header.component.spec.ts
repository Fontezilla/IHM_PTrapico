// Importação dos módulos necessários para testes
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchHeaderComponent } from './search-header.component';

// Suite de testes para o componente SearchHeader
describe('SearchHeaderComponent', () => {
  let component: SearchHeaderComponent; // Instância do componente
  let fixture: ComponentFixture<SearchHeaderComponent>; // Fixture para testes

  // Configuração antes de cada teste
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHeaderComponent ], // Declaração do componente
      imports: [IonicModule.forRoot()] // Importação do módulo Ionic
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHeaderComponent); // Cria o componente
    component = fixture.componentInstance; // Obtém a instância
    fixture.detectChanges(); // Detecta mudanças
  }));

  // Teste para verificar se o componente é criado corretamente
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
