import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { ApiEndpoints } from 'src/app/services/api/api-endpoints.enum';
import { NavController } from '@ionic/angular';
import { ReturnService } from 'src/app/services/returns-service/returns-service.service';

@Component({
  selector: 'app-return-details',
  templateUrl: './return-details.page.html',
  styleUrls: ['./return-details.page.scss'],
  standalone: false
})
export class ReturnDetailsPage implements OnInit {
  devolucaoForm: FormGroup;
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
    private apiService: ApiService,
    private navCtrl: NavController,
    private returnService: ReturnService
  ) {
    this.devolucaoForm = this.fb.group({
      foto: [null, Validators.required],
      fotoFatura: [null]
    });
  }

  ngOnInit() {
    const draft = this.returnService.getDraft();
    if (draft) {
      this.product = draft;
    } else {
      this.erroGeral = 'Erro: produto não selecionado para devolução.';
    }
  }

  abrirFileInput(tipo: 'produto' | 'fatura') {
    if (tipo === 'produto') {
      this.fileInputProduto?.nativeElement?.click();
    } else if (tipo === 'fatura') {
      this.fileInputFatura?.nativeElement?.click();
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

    const draft = this.returnService.getDraft();
    if (!draft) {
      this.erroGeral = 'Erro interno: Produto não definido.';
      return;
    }

    const formData = new FormData();
    formData.append('produto_id', draft.produto_id.toString());
    formData.append('motivo', motivoFinal);
    formData.append('imagem_url', this.devolucaoForm.value.foto);
    if (this.devolucaoForm.value.fotoFatura) {
      formData.append('fatura_url', this.devolucaoForm.value.fotoFatura);
    }

    this.apiService.post(ApiEndpoints.DEVOLUCOES, formData).subscribe({
      next: (response) => {
        console.log('Devolução enviada:', response);
        this.returnService.clearDraft();
        this.router.navigate(['/return-success']);
      },
      error: (error) => {
        console.error('Erro ao enviar devolução:', error);
        this.erroGeral = 'Erro ao enviar o pedido de devolução.';
      }
    });
  }

  voltar() {
    this.navCtrl.back();
  }
}
