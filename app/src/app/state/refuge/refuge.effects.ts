import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { setRefuge } from './refuge.actions';
import { map } from 'rxjs';
import { setOpen } from '../modal/modal.actions';

@Injectable()
export class RefugeEffects {
  constructor(private actions$: Actions) {}

  onRefugeSetShowTheModal$ = this.actions$.pipe(
    ofType(setRefuge),
    map(() => setOpen()),
  );
}
