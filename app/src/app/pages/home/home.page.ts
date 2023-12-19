import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponentStore } from 'src/app/components/map/map.store';
import { ModalComponentStore } from '../../components/refuge-modal/modal.store';
import { Refuge } from '../../schemas/refuge/refuge';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers: [MapComponentStore, ModalComponentStore],
})
export class HomePage {
  canShowComponents$ = this.mapStore.areLibrariesLoaded$;

  constructor(
    private route: ActivatedRoute,
    private mapStore: MapComponentStore,
    private modal: ModalComponentStore,
  ) {
    const refugeId = this.route.snapshot.paramMap.get('id');
    if (refugeId !== null) this.modal.openFromRefugeId(refugeId);
    this.mapStore.loadLibraries();
  }

  clickedRefuge($event: { refuge: Refuge; counter: number }) {
    this.modal.openWithRefuge($event.refuge);
  }
}
