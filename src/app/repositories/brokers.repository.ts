import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { CrudRespository } from './crud.repository';
import { Broker } from '../models/broker';

const KEY = 'AIRCON::BROKERS';

@Injectable({
  providedIn: 'root'
})
export class BrokersRepository extends CrudRespository<Broker> {

  constructor(protected nativeStorage: NativeStorage) {
    super(nativeStorage, KEY);
  }

}
