import { Injectable,  } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Settings } from '../models/settings';

const KEY = 'AIRCON::SETTINGS';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private nativeStorage: NativeStorage) { }

  async getDefaultBrokerUuid(): Promise<string | undefined> {
    try {
      const settings: Settings = await this.nativeStorage.getItem(KEY) || {};
      return settings.defaultBroker;
    } catch (reason) {
      if (reason.code && reason.code === 2) {
        return '';
      }
      console.log(reason);
      return '';
    }
  }

  async setDefaultBrokerUuid(uuid: string): Promise<void> {
    try {
      const settings: Settings = await this.nativeStorage.getItem(KEY) || {};
      settings.defaultBroker = uuid;
      await this.nativeStorage.setItem(KEY, settings);
    } catch (reason) {
      if (reason.code && reason.code === 2) {
        this.nativeStorage.setItem(KEY, { defaultBroker: uuid });
      }
      throw new Error('Error setting default broker');
    }
  }

  async getFavorites(): Promise<Array<string>> {
    try {
      const settings: Settings = await this.nativeStorage.getItem(KEY) || {};
      return settings.favorites || [];
    } catch (reason) {
      if (reason.code && reason.code === 2) {
        return [];
      }
      console.log(reason);
      return [];
    }
  }

  async setFavorites(favorites: Array<string>): Promise<void> {
    try {
      const settings: Settings = await this.nativeStorage.getItem(KEY) || {};
      settings.favorites = favorites;
      await this.nativeStorage.setItem(KEY, settings);
    } catch (reason) {
      if (reason.code && reason.code === 2) {
        this.nativeStorage.setItem(KEY, { favorites });
      }
      throw new Error('Error setting favorites');
    }
  }
}
