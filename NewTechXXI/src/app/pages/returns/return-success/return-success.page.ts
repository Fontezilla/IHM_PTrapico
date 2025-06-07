import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-return-success',
  templateUrl: './return-success.page.html',
  styleUrls: ['./return-success.page.scss'],
  standalone: false,
})
export class ReturnSuccessPage {
  constructor(private router: Router) {}

  voltarParaLoja() {
    this.router.navigate(['/tabs/home']);
  }
}
