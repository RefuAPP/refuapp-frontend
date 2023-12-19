import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Refuge } from '../../schemas/refuge/refuge';
import { AppState } from '../../state/app.state';
import { Store } from '@ngrx/store';
import { RefugeService } from '../../services/refuge/refuge.service';
import { concatMap, filter, map, Observable, tap } from 'rxjs';
import { minorError } from '../../state/errors/error.actions';
import { DeviceErrors } from '../../schemas/errors/device';
import { GetRefugeResponse } from '../../schemas/refuge/get-refuge-schema';
import { Location } from '@angular/common';

export interface ModalState {
  refuge?: Refuge;
  counter: number;
  isLoading: boolean;
}

@Injectable()
export class ModalComponentStore extends ComponentStore<ModalState> {
  readonly isOpen$ = this.select((state) => state.refuge).pipe(
    map((refuge) => refuge !== undefined),
  );
  readonly refuge$ = this.select((state) => {
    return {
      refuge: state.refuge,
      counter: state.counter,
    };
  }).pipe(filter((refuge) => refuge.refuge !== undefined)) as Observable<{
    refuge: Refuge;
    counter: number;
  }>;

  readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private readonly refugeService: RefugeService,
    private readonly store: Store<AppState>,
    private readonly location: Location,
  ) {
    super({ isLoading: false, counter: 0 });
  }

  readonly openWithRefuge = this.effect((refuge: Observable<Refuge>) =>
    refuge.pipe(
      tap((refuge) =>
        this.patchState((state) => {
          return { refuge: refuge, counter: state.counter + 1 };
        }),
      ),
      tap((refuge) =>
        console.log('Patched state with new refuge: ' + JSON.stringify(refuge)),
      ),
      tap((refuge) => this.location.go('/home/' + refuge.id)),
    ),
  );

  readonly closeModal = this.effect((obs) =>
    obs.pipe(
      tap(() => this.location.go('/home')),
      tap(() => this.patchState({ refuge: undefined })),
      tap(() => console.log('Patched state with undefined refuge')),
    ),
  );

  readonly openFromRefugeId = this.effect((refugeId: Observable<string>) =>
    refugeId.pipe(
      tap(() => this.patchState({ isLoading: true })),
      concatMap((id) => this.refugeService.getRefugeFrom(id)),
      tap(() => this.patchState({ isLoading: false })),
      tapResponse(
        (refuge: GetRefugeResponse) => {
          if (refuge.status === 'correct') {
            this.patchState((state) => {
              return { counter: state.counter + 1, refuge: refuge.data };
            });
            this.location.go('/home/' + refuge.data.id);
          }
          // TODO: Handle error
        },
        (error) => {
          this.store.dispatch(
            minorError({ error: DeviceErrors.NOT_CONNECTED }),
          );
        },
      ),
    ),
  );
}
