import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.state';
import { openModalWithRefugeId } from '../../state/modal/modal.actions';
import { MapComponentStore } from 'src/app/components/map/map.store';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [MapComponentStore],
})
export class HomePage implements OnInit {
  canShowComponents$ = this.mapStore.areLibrariesLoaded$;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private mapStore: MapComponentStore,
  ) {
    const refugeId = this.route.snapshot.paramMap.get('id');
    if (refugeId !== null)
      this.store.dispatch(openModalWithRefugeId({ refugeId }));
    this.mapStore.loadLibraries();
  }

  ngOnInit() {}
}
