import { Component } from '@angular/core';
import { IonModal, ModalController } from '@ionic/angular';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { ModalComponentStore } from './modal.store';
import { combineLatest, map, takeUntil } from 'rxjs';
import { RefugePage } from '../refuge/refuge.page';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-refuge-modal',
  templateUrl: './refuge-modal.component.html',
  styleUrls: ['./refuge-modal.component.scss'],
})
export class RefugeModalComponent {
  refuge$ = this.modal.refuge$;

  constructor(
    private store: Store<AppState>,
    private modal: ModalComponentStore,
    private modalComponent: ModalController,
  ) {
    this.refuge$.pipe(takeUntilDestroyed()).subscribe({
      next: (state) => {
        this.modalComponent
          .create({
            component: RefugePage,
            componentProps: {
              refuge: state.refuge,
            },
            initialBreakpoint: 0.3,
            breakpoints: [0, 0.3, 1],
          })
          .then((r) => {
            r.present().then(() => console.log('Presented modal'));
            console.log('Created modal');
          });
      },
    });
    this.modal.isOpen$.pipe(takeUntilDestroyed()).subscribe({
      next: (isOpen) => {
        if (!isOpen) {
          this.dismissedModal();
        }
      },
    });
  }

  dismissedModal() {
    this.modalComponent.dismiss().then(() => console.log('Dismissed!'));
  }
}
