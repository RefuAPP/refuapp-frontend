import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RefugeService } from '../../services/refuge/refuge.service';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { loadRefuges } from '../../state/refuges/refuges.actions';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-refuge',
  templateUrl: './refuge.page.html',
  styleUrls: ['./refuge.page.scss'],
})
export class RefugePage implements OnInit, AfterViewInit {
  @Input() refuge?: Refuge;
  @Output() clickedBar = new EventEmitter();


  constructor(
    private refugeService: RefugeService,
    private store: Store<AppState>,
  ) {}

  getImageUrl(): string | undefined {
    if (this.refuge == undefined) return undefined;
    return this.refugeService.getImageUrlFor(this.refuge);
  }

  refreshButton() {
    this.store.dispatch(loadRefuges());
    // TODO: fetch reservations here
  }

  ngOnInit() {}

  openFullModal() {
    this.clickedBar.emit();
  }

  ngAfterViewInit() {
    if (this.refuge) {
      return;
    }
    // TODO: fetch refuge here
  }
}
