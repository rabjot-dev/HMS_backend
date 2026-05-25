import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.css',
})
export class PageHeader {

  @Input() title = '';

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }

}