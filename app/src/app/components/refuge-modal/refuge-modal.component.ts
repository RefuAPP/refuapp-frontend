import { Component } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { ModalComponentStore } from './modal.store';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-refuge-modal',
  templateUrl: './refuge-modal.component.html',
  styleUrls: ['./refuge-modal.component.scss'],
})
export class RefugeModalComponent {
  modalState$ = combineLatest([this.modal.isOpen$, this.modal.refuge$]).pipe(
    map(([isOpen, refuge]) => ({ isOpen, refuge })),
  );

  constructor(
    private store: Store<AppState>,
    private modal: ModalComponentStore,
  ) {}

  dismissedModal() {
    this.modal.closeModal();
  }

  changeCurrentModalSize(modal: IonModal) {
    modal.getCurrentBreakpoint().then((breakpoint) => {
      if (breakpoint == 1) modal.setCurrentBreakpoint(0.3).then();
      if (breakpoint == 0.3) modal.setCurrentBreakpoint(1).then();
    });
  }
}
