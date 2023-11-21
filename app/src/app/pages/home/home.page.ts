import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { openModalWithRefugeId } from '../../state/components/modal/modal.actions';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    const refugeId = this.route.snapshot.paramMap.get('id');
    if (refugeId !== null)
      this.store.dispatch(openModalWithRefugeId({ refugeId }));
  }

  ngOnInit() {}
}
