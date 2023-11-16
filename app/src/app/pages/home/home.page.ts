import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { openModal } from '../../state/components/modal/modal.actions';
import { filter, map, takeWhile } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { getRefuges } from '../../state/refuges/refuges.selectors';
import { minorError } from '../../state/errors/error.actions';
import { ResourceErrors } from '../../schemas/errors/resource';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  refuge$ = this.store.select(getRefuges).pipe(
    takeWhile(() => this.route.snapshot.paramMap.get('id') !== null),
    filter((refuges) => refuges.length > 0),
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
      if (refuge === undefined)
        this.store.dispatch(minorError({ error: ResourceErrors.NOT_FOUND }));
      else this.store.dispatch(openModal({ refuge }));
    });
  }

  ngOnInit() {}
}
