import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.page.html',
  styleUrls: ['./return-details.page.scss'],
  standalone: false
})
export class ReturnDetailsPage implements OnInit {
  devolucaoForm: FormGroup;
  productId: number | null = null;
  product: any = null;
  fotoPreview: string | null = null;
  fotoFaturaPreview: string | null = null;
  motivoSelecionado: string | null = null;
  motivoOutro: string = '';
  mostrarDropdown: boolean = false;
  erroGeral: string | null = null;

  @ViewChild('fileInputProduto') fileInputProduto!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInputFatura') fileInputFatura!: ElementRef<HTMLInputElement>;

  motivosPredefinidos = [
    'Produto com defeito',
    'Produto não corresponde à descrição',
    'Produto danificado',
    'Tamanho incorreto',
    'Outros'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {
    this.devolucaoForm = this.fb.group({
      foto: [null, Validators.required],
      fotoFatura: [null]
    });
  }

  ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.apiService.get(`${ApiEndpoints.PRODUTOS}/${this.productId}`).subscribe({
        next: (product) => {
          this.product = product;
        },
        error: (error) => {
          console.error('Erro ao carregar produto:', error);
          this.erroGeral = 'Erro ao carregar detalhes do produto.';
        }
      });
    }
  }

  abrirFileInput(tipo: 'produto' | 'fatura') {
    if (tipo === 'produto' && this.fileInputProduto) {
      this.fileInputProduto.nativeElement.click();
    } else if (tipo === 'fatura' && this.fileInputFatura) {
      this.fileInputFatura.nativeElement.click();
    }
  }

  onFotoChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.devolucaoForm.patchValue({ foto: file });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onFotoFaturaChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.devolucaoForm.patchValue({ fotoFatura: file });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoFaturaPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  enviarPedido() {
    const motivoFinal = this.motivoSelecionado === 'Outros' ? this.motivoOutro : this.motivoSelecionado;
    if (!motivoFinal || !this.devolucaoForm.value.foto) {
      this.erroGeral = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.devolucaoForm.valid) {
      const formData = new FormData();
      formData.append('encomenda_produto_id', this.productId?.toString() || '');
      formData.append('motivo', motivoFinal);
      formData.append('imagem_url', this.devolucaoForm.value.foto);
      if (this.devolucaoForm.value.fotoFatura) {
        formData.append('fatura_url', this.devolucaoForm.value.fotoFatura);
      }

      this.apiService.post(ApiEndpoints.DEVOLUCOES, formData).subscribe({
        next: (response) => {
          console.log('Pedido de devolução enviado com sucesso:', response);
          this.router.navigate(['return-success']);
        },
        error: (error) => {
          console.error('Erro ao enviar pedido de devolução:', error);
          this.erroGeral = 'Erro ao enviar pedido de devolução.';
        }
      });
    }
  }

  voltar() {
    this.router.navigate(['return']);
  }
}
