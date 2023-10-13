import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.component.html',
  styleUrls: ['./refuge.component.scss'],
})
export class RefugeComponent  implements OnInit {

  constructor(private route: ActivatedRoute) {
    console.log(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit() {}

}
