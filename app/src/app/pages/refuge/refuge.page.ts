import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Refuge } from '../../schemas/refuge/refuge';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit, AfterViewInit {
  @Input() refuge?: Refuge;
  @Output() clickedBar = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private refugeService: RefugeService,
    private platform: Platform,
  ) {}

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  platformIsMobile(): boolean {
    return this.platform.is('mobile');
  }

  clickButton() {
    console.log('click');
  }

  ngOnInit() {}

  openFullModal() {
    this.clickedBar.emit();
  }

  ngAfterViewInit() {
    if (this.refuge) {
      return;
    }
    const refugeId = this.getRefugeIdFromUrl();
    // TODO: fetch refuge here
  }

  private getRefugeIdFromUrl(): string | null {
    return this.route.snapshot.paramMap.get('id');
  }
}
