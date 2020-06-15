import { Component, OnInit, Input } from '@angular/core';
import { Device } from 'src/app/models/device';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit {

  @Input() device: Device;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({ }, 'close');
  }

}
