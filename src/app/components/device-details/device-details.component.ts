import { Component, OnInit, Input } from '@angular/core';
import { Device, Mode, Fan, Swing } from 'src/app/models/device';
import { ModalController, AlertController } from '@ionic/angular';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-device-details',
  templateUrl: './device-details.component.html',
  styleUrls: ['./device-details.component.scss'],
})
export class DeviceDetailsComponent implements OnInit {

  @Input() device: Device;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private mqttService: MqttService) { }

  ngOnInit() {}

  private f2c(f: number): number {
    return Math.floor((f - 32) * (5 / 9));
  }

  dismiss() {
    this.modalController.dismiss({ }, 'close');
  }

  async power(): Promise<void> {
    const payload = this.device.state.power === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/power`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  getFanspeed2Number(): number {
    switch (this.device.state.fanspeed) {
      case 'Auto':
        return 0;
      case 'Min':
        return 1;
      case 'Low':
        return 2;
      case 'Medium':
        return 3;
      case 'High':
        return 4;
      case 'Max':
        return 5;
      default:
        return 0;
    }
  }

  getNumber2Fanspeed(value: number): Fan {
    switch (value) {
      case 0:
        return 'Auto';
      case 1:
        return 'Min';
      case 2:
        return 'Low';
      case 3:
        return 'Medium';
      case 4:
        return 'High';
      case 5:
        return 'Max';
      default:
        return 'Auto';
    }
  }

  getSwing2Number(swing: Swing): number {
    // 'Off' | 'Auto' | 'Highest' | 'High' | 'Middle' | 'Low' | 'Lowest'
    switch (swing) {
      case 'Off':
        return -1;
      case 'Auto':
        return 0;
      case 'Lowest':
        return 1;
      case 'Low':
        return 2;
      case 'Middle':
        return 3;
      case 'High':
        return 4;
      case 'Highest':
        return 5;
      default:
        return 0;
    }
  }

  getNumber2Swing(value: number): Swing {
    switch (value) {
      case -1:
        return 'Off';
      case 0:
        return 'Auto';
      case 1:
        return 'Lowest';
      case 2:
        return 'Low';
      case 3:
        return 'Middle';
      case 4:
        return 'High';
      case 5:
        return 'Highest';
      default:
        return 'Auto';
    }
  }

  async changeFanspeed(e: { detail: { value: number } }): Promise<void> {
    const newFanspeed = e.detail.value;
    const currentFanspeed = this.getFanspeed2Number();
    if (newFanspeed !== currentFanspeed) {
      const payload = this.getNumber2Fanspeed(newFanspeed);
      const topic = `${this.device.topic}/ac/cmnd/fanspeed`;
      console.log(topic, payload);
      try {
        this.mqttService.unsafePublish(topic, payload);
      } catch (reason) {
        console.log(reason);
        const alert = await this.alertController.create({
          header: 'MQTT Error',
          message: `Error trying to publish message to MQTT server. Please try again.`,
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  getTempColor(): string {
    let celsius = this.device.state.use_celsius === 'on' ?
      this.device.state.temp : this.f2c(this.device.state.temp);
    if (celsius < 16) {
      celsius = 16;
    } else if (celsius > 32) {
      celsius = 32;
    }
    return `temp-${celsius}`;
  }

  async changeTemp(e: { detail: { value: number } }): Promise<void> {
    const newTemp = e.detail.value;
    const currentTemp = parseInt(this.device.state.temp.toString(), 10);
    if (newTemp !== currentTemp) {
      const topic = `${this.device.topic}/ac/cmnd/temp`;
      console.log(topic, newTemp);
      try {
        this.mqttService.unsafePublish(topic, newTemp.toString());
      } catch (reason) {
        console.log(reason);
        const alert = await this.alertController.create({
          header: 'MQTT Error',
          message: `Error trying to publish message to MQTT server. Please try again.`,
          buttons: ['OK']
        });
        alert.present();
      }
    }
  }

  async mode(mode: Mode): Promise<void> {
    const topic = `${this.device.topic}/ac/cmnd/mode`;
    console.log(topic, mode);
    try {
      this.mqttService.unsafePublish(topic, mode);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async swingv(): Promise<void> {
    let newSwing = this.getSwing2Number(this.device.state.swingv) + 1;
    if (newSwing >= 6) {
      newSwing = -1;
    }
    const payload = this.getNumber2Swing(newSwing);
    const topic = `${this.device.topic}/ac/cmnd/swingv`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async swingh(): Promise<void> {
    let newSwing = this.getSwing2Number(this.device.state.swingh) + 1;
    if (newSwing >= 6) {
      newSwing = -1;
    }
    const payload = this.getNumber2Swing(newSwing);
    const topic = `${this.device.topic}/ac/cmnd/swingh`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async quiet(): Promise<void> {
    const payload = this.device.state.quiet === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/quiet`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async turbo(): Promise<void> {
    const payload = this.device.state.turbo === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/turbo`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async econo(): Promise<void> {
    const payload = this.device.state.econo === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/econo`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async light(): Promise<void> {
    const payload = this.device.state.light === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/light`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async filter(): Promise<void> {
    const payload = this.device.state.filter === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/filter`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async clean(): Promise<void> {
    const payload = this.device.state.clean === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/clean`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async beep(): Promise<void> {
    const payload = this.device.state.beep === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/beep`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async sleep(): Promise<void> {
    const payload = this.device.state.sleep === 'on' ? 'off' : 'on';
    const topic = `${this.device.topic}/ac/cmnd/sleep`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async changeProtocol(e: { detail: { value: string } }): Promise<void> {
    const payload = e.detail.value;
    const topic = `${this.device.topic}/ac/cmnd/protocol`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  async changeModel(e: { detail: { value: number } }): Promise<void> {
    const payload = e.detail.value.toString();
    const topic = `${this.device.topic}/ac/cmnd/model`;
    console.log(topic, payload);
    try {
      this.mqttService.unsafePublish(topic, payload);
    } catch (reason) {
      console.log(reason);
      const alert = await this.alertController.create({
        header: 'MQTT Error',
        message: `Error trying to publish message to MQTT server. Please try again.`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

}
