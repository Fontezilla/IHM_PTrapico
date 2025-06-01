import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { SearchHeaderComponent } from '../components/search-header/search-header.component';

@NgModule({
  declarations: [SearchHeaderComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [SearchHeaderComponent]
})
export class SharedModule {}