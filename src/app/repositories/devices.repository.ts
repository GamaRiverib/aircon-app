import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CrudRespository } from './crud.repository';
import { Device } from '../models/device';

const KEY = 'AIRCON::DEVICES';

@Injectable({
  providedIn: 'root'
})
export class DevicesRepository extends CrudRespository<Device> {

  constructor(protected nativeStorage: NativeStorage) {
    super(nativeStorage, KEY);
  }

}
