import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { distinctUntilChanged, mergeMap, Observable, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class DeviceLanguageService {
  constructor() {}

  async getCurrentLanguageCode(): Promise<string> {
    const languageCode = await Device.getLanguageCode();
    return languageCode.value;
  }

  /**
   * Gets the language code of the device, fetching it every 3 seconds.
   * TODO: This is a workaround for the fact that Capacitor's Device plugin
   * doesn't have an observable for getting the language code, so we have to
   * poll it every N seconds.
   */
  getLanguageCode(): Observable<string> {
    return timer(0, 5_000).pipe(
      mergeMap(() => fromPromise(this.getCurrentLanguageCode())),
      distinctUntilChanged(),
    );
  }
}
