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
  isLoading: boolean;
}

@Injectable()
export class ModalComponentStore extends ComponentStore<ModalState> {
  readonly isOpen$ = this.select((state) => state.refuge).pipe(
    map((refuge) => refuge !== undefined),
  );
  readonly refuge$ = this.select((state) => state.refuge).pipe(
    filter((refuge) => refuge !== undefined),
  ) as Observable<Refuge>;

  readonly isLoading$ = this.select((state) => state.isLoading);

  constructor(
    private readonly refugeService: RefugeService,
    private readonly store: Store<AppState>,
    private readonly location: Location,
  ) {
    super({ isLoading: false });
  }

  readonly openWithRefuge = this.effect((refuge: Observable<Refuge>) =>
    refuge.pipe(
      tap(() => this.patchState({ isLoading: true })),
      tap((refuge) => this.patchState({ refuge })),
      tap((refuge) => this.location.go('/home/' + refuge.id)),
      tap(() => this.patchState({ isLoading: false })),
    ),
  );

  readonly closeModal = this.effect((obs) =>
    obs.pipe(
      tap(() => this.patchState({ isLoading: true, refuge: undefined })),
      tap(() => this.location.go('/home')),
      tap(() => this.patchState({ isLoading: false })),
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
            this.patchState({ refuge: refuge.data });
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
