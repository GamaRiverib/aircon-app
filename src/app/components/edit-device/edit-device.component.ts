import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Device } from '../../models/device';
import { DevicesRepository } from 'src/app/repositories/devices.repository';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.scss'],
})
export class EditDeviceComponent implements OnInit {

  @Input() device: Device;

  constructor(
    private modalController: ModalController,
    private devicesRepository: DevicesRepository,
    private alertController: AlertController) { }

  ngOnInit() {
    console.log('ngOnInit', this.device);
  }

  dismiss() {
    this.modalController.dismiss({ }, 'close');
  }

  async save() {
    if (this.device) {
      console.log('save', JSON.stringify(this.device));
      console.log('save', this.device);
      try {
        if (this.device.uuid) {
          await this.devicesRepository.update(this.device.uuid, this.device);
          this.modalController.dismiss({ device: this.device }, 'updated');
        } else {
          const uuid: string = await this.devicesRepository.add(this.device);
          this.modalController.dismiss({ uuid, device: this.device }, 'saved');
        }
      } catch (reason) {
        console.log(reason);
        this.modalController.dismiss({ error: 'Error saving device', details: reason }, 'error');
      }
    } else {
      this.modalController.dismiss({ error: 'Something was wrong' }, 'error');
    }
  }

  async remove() {
    const alert = await this.alertController.create({
      header: 'Remove device',
      message: `Remove device <b>${this.device.name}</b><br/>Are you sure?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes',
          handler: async () => {
            const device = this.device;
            await this.devicesRepository.remove(this.device.uuid);
            this.modalController.dismiss({ device }, 'removed');
          }
        }
      ]
    });

    await alert.present();
  }

}
