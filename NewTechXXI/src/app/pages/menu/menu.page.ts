import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { AlertController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { SearchHeaderComponent } from 'src/app/components/search-header/search-header.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  activeTab: 'produtos' | 'servicos' = 'produtos';
  searchExpanded = false;

  categorias: any[] = [];

  servicos = [
    'Serviços para Casa',
    'Reparações e Manutenções',
    'Instalações e Configurações',
    'Suporte Técnico Online',
    'Devoluções'
  ];

  @ViewChild('searchBar') searchBar!: SearchHeaderComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab'] === 'servicos') {
        this.activeTab = 'servicos';
      }
    });
    this.carregarCategorias();
  }

  carregarCategorias() {
    this.apiService.get(ApiEndpoints.CATEGORIAS).subscribe({
      next: categorias => {
        this.categorias = categorias;
      },
      error: () => {
        this.mostrarAlerta('Erro', 'Não foi possível carregar as categorias.');
      }
    });
  }

  abrirCategoria(categoria: any) {
    this.router.navigate(['/products', categoria.id]);
  }

  abrirServico(servico: string) {
    if (servico === 'Devoluções') {
      this.router.navigate(['/return']);
    } else {
      this.mostrarAlerta('Serviço', `Serviço "${servico}" não implementado nesta versão.`);
    }
  }

  async mostrarAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });
    await alert.present();
  }

  collapseSearchBar() {
    this.searchBar.collapseSearch();
  }
}