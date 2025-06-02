import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-return-success',
  templateUrl: './return-success.page.html',
  styleUrls: ['./return-success.page.scss'],
  standalone: false,
})
export class ReturnSuccessPage {
  constructor(
    private navCtrl: NavController
  ) {}

  voltar() {
    this.navCtrl.back();
  }
}
