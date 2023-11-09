import { Injectable } from '@angular/core';
import { Device } from '@capacitor/device';
import { distinctUntilChanged, mergeMap, Observable, timer } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { StorageService } from '../storage/storage.service';

const LANGUAGE_KEY = 'language';

@Injectable({
  providedIn: 'root',
})
export class LanguageStorage {
  constructor(private storageService: StorageService) {}

  async getLanguageCode(): Promise<string | null> {
    return await this.storageService.get(LANGUAGE_KEY);
  }

  async setLanguageCode(languageCode: string): Promise<void> {
    await this.storageService.set(LANGUAGE_KEY, languageCode);
  }

  async removeLanguageCode(): Promise<void> {
    await this.storageService.remove(LANGUAGE_KEY);
  }
}
