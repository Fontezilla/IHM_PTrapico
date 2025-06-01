import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connection-check',
  templateUrl: './connection-check.page.html',
  styleUrls: ['./connection-check.page.scss'],
  standalone: false
})
export class ConnectionCheckPage implements OnInit {

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const apiUrl = await this.storage.get('apiUrl');

    if (!apiUrl) {
      this.router.navigateByUrl('/settings', { replaceUrl: true });
      return;
    }

    this.http.get(`${apiUrl}/ping`, { responseType: 'text' }).subscribe({
      next: () => {
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: () => {
        setTimeout(() => {
          this.router.navigateByUrl('/connection-settings', { replaceUrl: true });
        }, 2000);
      }
    });
  }
}