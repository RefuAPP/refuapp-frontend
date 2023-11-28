import { Component, Input, OnInit } from '@angular/core';
import { Refuge } from '../../schemas/refuge/refuge';

@Component({
  selector: 'app-refuge-info',
  templateUrl: './refuge-info.component.html',
  styleUrls: ['./refuge-info.component.scss'],
})
export class RefugeInfoComponent {
  @Input() refuge!: Refuge;

  constructor() {}
}
