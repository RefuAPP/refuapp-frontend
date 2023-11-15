import { Component, OnInit } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { closeModal } from '../../state/components/modal/modal.actions';
import { selectModalState } from '../../state/components/modal/modal.selectors';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-refuge-modal',
  templateUrl: './refuge-modal.component.html',
  styleUrls: ['./refuge-modal.component.scss'],
})
export class RefugeModalComponent implements OnInit {
  modalState$ = this.store.select(selectModalState);

  constructor(private store: Store<AppState>) {}

  ngOnInit() {}

  dismissedModal() {
    this.store.dispatch(closeModal());
  }

  changeCurrentModalSize(modal: IonModal) {
    modal.getCurrentBreakpoint().then((breakpoint) => {
      if (breakpoint == 1) modal.setCurrentBreakpoint(0.3).then();
      if (breakpoint == 0.3) modal.setCurrentBreakpoint(1).then();
    });
  }
}
