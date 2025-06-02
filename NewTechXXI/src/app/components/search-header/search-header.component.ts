import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-header',
  templateUrl: './search-header.component.html',
  styleUrls: ['./search-header.component.scss'],
  standalone: false
})
export class SearchHeaderComponent {
  isExpanded = false;
  searchHistory: string[] = [];
  suggestedCategories: any[] = [];
  selectedCategoryId: number | null = null;

  @Input() modoVoltar: boolean = false;
  @Output() voltar = new EventEmitter<void>();

  @Input() termo: string = '';
  @Output() termoChange = new EventEmitter<string>();

  @Output() expandedChange = new EventEmitter<boolean>();
  private searchSubject = new Subject<string>();
  private historyKey: string = ''; 

  constructor(
    private apiService: ApiService,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
  }

  private async init() {
    await this.storage.create();

    const user = await this.storage.get('utilizador');
    if (user && user.id) {
      this.historyKey = `searchHistory_user_${user.id}`;
    }

    this.loadHistory();
    this.getRandomCategories();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term =>
        term.trim()
          ? this.apiService.get(`${ApiEndpoints.CATEGORIAS}?search=${term}`)
          : this.apiService.get(ApiEndpoints.CATEGORIAS)
      )
    ).subscribe((res: any[]) => {
      this.suggestedCategories = this.shuffle(res).slice(0, 8);
    });
  }

  expandSearch() {
    this.isExpanded = true;
    this.expandedChange.emit(true);
  }

  collapseSearch() {
    this.isExpanded = false;
    this.termo = '';
    this.termoChange.emit('');
    this.expandedChange.emit(false);
  }

  onSearchChange() {
    this.expandSearch();
    this.searchSubject.next(this.termo);
  }

  async onSubmit() {
    const termo = this.termo.trim();
    if (!termo) return;

    await this.saveToHistory(termo);

    const normalizar = (s: string) => s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase();

    const termoNormalizado = normalizar(termo);

    this.apiService.get(ApiEndpoints.CATEGORIAS).subscribe((categorias: any[]) => {
      const categoria = categorias.find(cat =>
        normalizar(cat.nome ?? '') === termoNormalizado
      );

      if (categoria) {
        this.router.navigate(['/products', categoria.id]);
      } else {
        this.router.navigate(['/products'], {
          queryParams: { nome: termo }
        });
      }

      this.collapseSearch();
    });
  }

  onSelectHistory(term: string) {
    this.termo = term;
    this.termoChange.emit(term);
    this.onSubmit();
  }

  onSelectCategory(cat: any) {
    this.saveToHistory(cat.nome);
    this.collapseSearch();
    this.router.navigate(['/products', cat.id]);
  }

  private async loadHistory() {
    const history = await this.storage.get(this.historyKey);
    this.searchHistory = history || [];
  }

  private async saveToHistory(term: string) {
    term = term.trim();
    if (!term) return;

    this.searchHistory = [term, ...this.searchHistory.filter(t => t !== term)].slice(0, 10);
    await this.storage.set(this.historyKey, this.searchHistory);
  }

  private getRandomCategories() {
    this.apiService.get(ApiEndpoints.CATEGORIAS).subscribe((res: any[]) => {
      this.suggestedCategories = this.shuffle(res).slice(0, 8);
    });
  }

  private shuffle(array: any[]): any[] {
    return array.map(a => [Math.random(), a]).sort().map(a => a[1]);
  }
}