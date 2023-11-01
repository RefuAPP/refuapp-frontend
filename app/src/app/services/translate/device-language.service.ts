import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { map, mergeMap, Observable, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root',
})
export class DeviceLanguageService {
  constructor() {}

  async getCurrentLanguageCode(): Promise<string> {
    return Device.getLanguageTag().then((languageTag) => languageTag.value);
  }
  /**
   * Gets the language code of the device, fetching it every 3 seconds.
   * TODO: This is a workaround for the fact that Capacitor's Device plugin
   * doesn't have an observable for getting the language code, so we have to
   * poll it every 3 seconds.
   */
  getLanguageCode(): Observable<string> {
    return timer(0, 3_000).pipe(
      mergeMap(() => {
        return fromPromise(Device.getLanguageTag()).pipe(
          map((languageTag) => languageTag.value),
        );
      }),
    );
  }
}
