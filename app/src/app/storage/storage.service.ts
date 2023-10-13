import { Injectable } from '@angular/core';
import {Preferences} from "@capacitor/preferences";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public async set(key: string, value: any) {
    await Preferences.set({ key, value });
  }

  public async get(key: string) {
    const { value } = await Preferences.get({ key });
    return value;
  }

  public async remove(key: string) {
    await Preferences.remove({ key });
  }
}
