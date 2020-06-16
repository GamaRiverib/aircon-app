import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SettingsService } from './services/settings.service';
import { Router, NavigationExtras } from '@angular/router';
import { DevicesRepository } from './repositories/devices.repository';
import { MqttService } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: 'home',
      icon: 'home'
    },
    {
      title: 'MQTT',
      url: 'brokers',
      icon: 'cloud'
    },
    {
      title: 'Devices',
      url: 'devices',
      icon: 'hardware-chip'
    },
    {
      title: 'About',
      url: 'about',
      icon: 'information-circle'
    },
    {
      title: 'Account',
      url: 'account',
      icon: 'person'
    }
  ];
  public labels = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private alertController: AlertController,
    private router: Router,
    private mqttService: MqttService,
    private settings: SettingsService,
    private devicesRepository: DevicesRepository
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.platform.resume.subscribe(async () => {
      console.log('app resume');
    });
    this.platform.pause.subscribe(async () => {
      console.log('app pause');
    });
  }

  async ngOnDestroy(): Promise<void> {
    console.log('AppComponent destroy');
    this.mqttService.disconnect();
  }

  async ngOnInit() {
    // Loading settings
    const defaultBrokerUuid = await this.settings.getDefaultBrokerUuid();
    if (!defaultBrokerUuid) {
      const alert = await this.alertController.create({
        header: 'MQTT Broker',
        message: 'Please add MQTT broker',
        buttons: ['OK']
      });
      await alert.present();
      const extras: NavigationExtras = { state: { returnTo: 'home' } };
      this.router.navigate([ 'brokers' ], extras);
    }
    const favorites = await this.settings.getFavorites();
    const devices = await this.devicesRepository.listByUuid(favorites);
    this.labels = devices.map(d => d.name);
  }
}
