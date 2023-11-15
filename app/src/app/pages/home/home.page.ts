import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { openModal } from '../../state/components/modal/modal.actions';
import { map, takeWhile } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { resourceNotFound } from '../../state/errors/error.actions';
import { getRefuges } from '../../state/refuges/refuges.selectors';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  refuge$ = this.store.select(getRefuges).pipe(
    takeWhile(() => this.route.snapshot.paramMap.get('id') !== null),
    map((refuges) =>
      refuges.find(
        (refuge) => refuge.id === this.route.snapshot.paramMap.get('id'),
      ),
    ),
  );

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.refuge$.pipe(takeUntilDestroyed()).subscribe((refuge) => {
      if (refuge === undefined) this.store.dispatch(resourceNotFound());
      else this.store.dispatch(openModal({ refuge }));
    });
  }

  ngOnInit() {}
}
