import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
  standalone: false
})
export class FinishPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  continuarComprando(): void {
    this.router.navigateByUrl('/tabs/home');
  }
}
