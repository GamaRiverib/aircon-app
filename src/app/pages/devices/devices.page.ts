import { Component, OnInit } from '@angular/core';
import { ToastController, ModalController, AlertController } from '@ionic/angular';
import { Router, Navigation } from '@angular/router';
import { DevicesRepository } from '../../repositories/devices.repository';
import { Device } from '../../models/device';
import { EditDeviceComponent } from '../../components/edit-device/edit-device.component';

@Component({
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {

  private all: Array<Device> = [];
  private devices: Array<Device> = [];
  message = '';

  constructor(
    private devicesRepository: DevicesRepository,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router) {
      const navigation: Navigation = this.router.getCurrentNavigation();
      if (navigation.extras.state) {
        if (navigation.extras.state.action && navigation.extras.state.action === 'add') {
          this.addDevice();
        }
      }
    }

    private async getDevices(): Promise<void> {
      this.message = '';
      try {
        this.all = await this.devicesRepository.getAll();
        this.devices = this.all;
        console.log('Devices', this.devices);
      } catch (error) {
        this.message = 'An error occurred while trying to get the device list';
        const toast = await this.toastController.create({
          message: 'Something was wrong',
          duration: 2000,
          position: 'bottom'
        });
        toast.present();
      }
    }

  async ngOnInit() {
    this.getDevices();
  }

  onSearchChange(ev: any) {
    if (ev && ev.detail) {
      if (!ev.detail.value) {
        this.devices = this.all;
        return;
      }
      const query: string = ev.detail.value.toLowerCase();
      this.devices = this.all.filter((v: Device) => {
        const name = v.name.toLocaleLowerCase();
        return name.indexOf(query) >= 0;
      });
    }
  }

  async editDevice(device: Device): Promise<void> {
    console.log('edit device', JSON.stringify(device));
    console.log('edit device', device);
    const modal = await this.modalController.create({
      component: EditDeviceComponent,
      componentProps: { device }
    });
    modal.onWillDismiss().then(async (res: any) => {
      try {
        if (res.role === 'updated') {
          const toast = await this.toastController.create({
            message: 'Successful updated',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
        } else if (res.role === 'removed') {
          const toast = await this.toastController.create({
            message: 'Successful removed',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          if (res.data.device) {
            const index = this.all.findIndex(d => d.uuid === res.data.device.uuid);
            if (index >= 0) {
              this.all.splice(index, 1);
            }
          }
        } else if (res.role === 'error') {
          const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'Error updating',
            message: 'Something was wrong. Try again please.',
            buttons: ['OK']
          });
          await alert.present();
        }
      } catch (reason) {
        console.log(reason);
      }
    }).catch((reason: any) => {
      console.log('ERROR', reason);
    }).finally(() => {
      // TODO
    });
    return await modal.present();
  }

  async addDevice(): Promise<void> {
    const device: Device = { uuid: '', name: '', topic: '' };
    const modal = await this.modalController.create({
      component: EditDeviceComponent,
      componentProps: { device }
    });
    modal.onWillDismiss().then(async (res: any) => {
      try {
        if (res.role === 'saved') {
          const toast = await this.toastController.create({
            message: 'Successful saved',
            duration: 2000,
            position: 'bottom'
          });
          toast.present();
          if (res.data && res.data.device) {
            this.all.unshift(res.data.device);
          }
        } else if (res.role === 'error') {
          const alert = await this.alertController.create({
            header: 'Error',
            subHeader: 'Error saving',
            message: 'Something was wrong. Try again please.',
            buttons: ['OK']
          });
          await alert.present();
        }
      } catch (reason) {
        console.log(reason);
      }
    }).catch((reason: any) => {
      console.log('ERROR', reason);
    }).finally(() => {
      // TODO
    });
    return await modal.present();
  }

}
