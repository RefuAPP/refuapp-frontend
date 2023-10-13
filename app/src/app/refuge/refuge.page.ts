import { Component, OnInit } from '@angular/core';
import {Refuge} from "../schemas/refuge";
import {ActivatedRoute} from "@angular/router";
import {RefugeService} from "../services/refuge/refuge.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit {

  refuge: Refuge | undefined;

  constructor(private route: ActivatedRoute,
              private refugeService: RefugeService
  ) {
    const refugeId = this.route.snapshot.paramMap.get("id");
    if (refugeId != null)
      this.refugeService.getRefugeFrom(refugeId).pipe().subscribe(refuge => {
        this.refuge = refuge
        console.log(refuge);
      });
  }

  getImageUrl() : string | undefined {
    if (this.refuge == undefined) return undefined;
    const imageUrl = environment.API + "/static/images/refuges/" + this.refuge.image;
    console.log(imageUrl)
    return imageUrl;
  }

  clickButton() {
    console.log("click");
  }

  ngOnInit() {}


}
