import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connection-settings',
  templateUrl: './connection-settings.page.html',
  styleUrls: ['./connection-settings.page.scss'],
  standalone: false,
})
export class ConnectionSettingsPage implements OnInit {
  apiUrl: string = '';

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const savedUrl = await this.storage.get('apiUrl');
    if (savedUrl) {
      this.apiUrl = savedUrl;
    }
  }

  async testarLigacao() {
    if (!this.apiUrl || !this.apiUrl.startsWith('http')) {
      alert('Por favor insere uma URL válida (ex: http://192.168.1.23:3000)');
      return;
    }

    try {
      await this.http.get(`${this.apiUrl}/ping`).toPromise();
      alert('Ligação bem-sucedida!');
    } catch (error) {
      alert('Erro na ligação à API.');
    }
  }

  async guardarLigacao() {
    if (!this.apiUrl || !this.apiUrl.startsWith('http')) {
      alert('Por favor insere uma URL válida antes de guardar.');
      return;
    }

    await this.storage.set('apiUrl', this.apiUrl);
    this.router.navigateByUrl('/connection-check', { replaceUrl: true });
  }
}