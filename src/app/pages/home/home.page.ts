import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController, AlertController, ModalController, Platform } from '@ionic/angular';
import { MqttService, IMqttServiceOptions, IMqttMessage,
         IOnConnectEvent, IOnErrorEvent } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { DevicesRepository } from '../../repositories/devices.repository';
import { SettingsService } from '../../services/settings.service';
import { BrokersRepository } from '../../repositories/brokers.repository';
import { Device } from '../../models/device';
import { Broker } from '../../models/broker';
import { DeviceDetailsComponent } from '../../components/device-details/device-details.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private online = false;
  private all: Array<Device> = [];
  private devices: Array<Device> = [];
  private subscriptions: Array<Subscription> = [];
  private reconnectCount = 0;
  private backButtonSubscription: Subscription | undefined;

  constructor(
    private devicesRepository: DevicesRepository,
    private settings: SettingsService,
    private brokersRepository: BrokersRepository,
    private mqttService: MqttService,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private appMinimize: AppMinimize,
    private platform: Platform,
    private router: Router) { }

  async ngOnDestroy(): Promise<void> {
    console.log('Unsubscribing...');
    if (this.backButtonSubscription !== undefined) {
      this.backButtonSubscription.unsubscribe();
    }
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    console.log('Disconnecting from MQTT...');
    this.mqttService.disconnect();
  }

  async ngOnInit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribe(() => {
        console.log('Minimize app');
        this.appMinimize.minimize();
      });
    this.getDevices();
    this.connect();
  }

  private async getDevices(): Promise<void> {
    try {
      this.all = await this.devicesRepository.getAll();
      this.all.forEach(d => d.state = {});
      this.devices = this.all;
      console.log('Devices', this.devices);
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Something was wrong',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  async onMessage(message: IMqttMessage): Promise<void> {
    const statePattern = /(?<topic>[a-zA-Z0-9.-_]+){1}\/ac\/stat\/(?<trait>[a-zA-Z0-9.-_]+)$/gis;
    const statusPattern = /(?<topic>[a-zA-Z0-9.-_]+){1}\/status$/gis;
    const fullTopic = message.topic;
    const payload = message.payload.toString() || '';
    console.log(fullTopic, payload);
    if (fullTopic.match(statePattern) ) {
      const exec = statePattern.exec(fullTopic);
      if (exec && exec.groups) {
        const topic = exec.groups.topic;
        const trait = exec.groups.trait;
        const match = this.all.filter(d => topic.startsWith(d.topic));
        match.forEach(d => d.state[trait] = payload);
      }
    } else if (fullTopic.match(statusPattern)) {
      const exec = statusPattern.exec(fullTopic);
      if (exec && exec.groups) {
        const topic = exec.groups.topic;
        const match = this.all.filter(d => topic.startsWith(d.topic));
        const status = payload.toUpperCase() === 'ONLINE' ? 'Online' : 'Offline';
        match.forEach(d => d.status = status);
      }
    } else {
      console.log('Topic not match');
    }
  }

  async onClose(): Promise<void> {
    console.log('MQTT closed');
  }

  async onConnected(event: IOnConnectEvent): Promise<void> {
    console.log('onConnected', event);
    this.online = true;
    this.reconnectCount = 0;
    const devices = await this.devicesRepository.getAll();
    const topics = devices.map(d => d.topic + '/#');
    topics.forEach(topic => {
      const subscription = this.mqttService
        .observe(topic)
        .subscribe(this.onMessage.bind(this));
      this.subscriptions.push(subscription);
    });
  }

  async onError(event: IOnErrorEvent): Promise<void> {
    console.log('onError', event);
  }

  async onOffline(): Promise<void> {
    console.log('MQTT Offline');
    this.online = false;
  }

  async onReconnect(): Promise<void> {
    this.reconnectCount++;
    console.log(`MQTT Reconnecting (${this.reconnectCount})...`);
    if (this.reconnectCount > 10) {
      this.mqttService.disconnect();
      this.reconnectCount = 0;
    }
  }

  async connect(): Promise<void> {
    // Loading settings
    if (this.online === false) {
      const defaultBrokerUuid = await this.settings.getDefaultBrokerUuid();
      if (defaultBrokerUuid) {
        console.log('Connect to broker', defaultBrokerUuid);
        const broker: Broker = await this.brokersRepository.getByUuid(defaultBrokerUuid);
        const options: IMqttServiceOptions = {
          hostname: broker.connectOptions.hosts[0],
          port: broker.connectOptions.ports[0],
          clientId: broker.connectOptions.clientId,
          protocol: broker.connectOptions.protocol,
          connectOnCreate: true
        };
        console.log({options});
        try {
          const service = this.mqttService;
          this.mqttService.connect(options);
          this.subscriptions.push(service.onConnect.subscribe(this.onConnected.bind(this)));
          this.subscriptions.push(service.onClose.subscribe(this.onClose.bind(this)));
          this.subscriptions.push(service.onError.subscribe(this.onError.bind(this)));
          this.subscriptions.push(service.onOffline.subscribe(this.onOffline.bind(this)));
          this.subscriptions.push(service.onReconnect.subscribe(this.onReconnect.bind(this)));
        } catch (reason) {
          console.log('catch', reason);
          const alert = await this.alertController.create({
            header: 'MQTT Error',
            message: `Error trying to connect to MQTT server: <b>${broker.name}</b>. Please check the connection data.`,
            buttons: ['OK']
          });
          await alert.present();
        }
      }
    }
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

  async showDevice(device: Device): Promise<void> {
    console.log('Show device', device);
    const modal = await this.modalController.create({
      component: DeviceDetailsComponent,
      componentProps: { device }
    });
    modal.onWillDismiss().then(async (res: any) => {
      console.log(res);
    }).catch((reason: any) => {
      console.log('ERROR', reason);
    }).finally(() => {
      // TODO
    });
    return await modal.present();
  }

  async addDevice(): Promise<void> {
    const extras: NavigationExtras = { state: { action: 'add' } };
    this.router.navigate([ 'devices' ], extras);
  }

  getTempColor(device: Device): string {
    let celsius = device.state.use_celsius === 'on' ?
      device.state.temp :  Math.floor((device.state.temp - 32) * (5 / 9));
    if (celsius < 16) {
      celsius = 16;
    } else if (celsius > 32) {
      celsius = 32;
    }
    return `temp-${celsius}`;
  }

}
