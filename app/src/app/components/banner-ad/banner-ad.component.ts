// banner-ad.component.ts

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-banner-ad',
  templateUrl: './banner-ad.component.html',
  styleUrls: ['./banner-ad.component.scss']
})
export class BannerAdComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onButtonClick(): void {
    // Handle button click event (you can add your logic here)
    console.log('Button clicked! Redirect to the product page or perform other actions.');
  }
}
