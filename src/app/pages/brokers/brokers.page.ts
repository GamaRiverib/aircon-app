import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, Platform, NavController } from '@ionic/angular';
import { BrokersRepository } from '../../repositories/brokers.repository';
import { Broker } from '../../models/broker';
import { SettingsService } from '../../services/settings.service';
import { Navigation, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.page.html',
  styleUrls: ['./brokers.page.scss'],
})
export class BrokersPage implements OnInit, OnDestroy {

  broker: Broker;
  returnTo: string;

  private backButtonSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private brokersRepository: BrokersRepository,
    private settingsService: SettingsService,
    private platform: Platform,
    private navController: NavController) {
      this.broker = {
        uuid: '',
        name: '',
        connectOptions: {
          hosts: [''],
          ports: [1883],
          clientId: '',
          useSSL: false,
          username: '',
          password: ''
        }
      };

      const navigation: Navigation = this.router.getCurrentNavigation();
      if (navigation.extras.state) {
        if (navigation.extras.state.returnTo) {
          this.returnTo = navigation.extras.state.returnTo;
        }
      }
    }

  async ngOnInit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribe(() => this.navController.back());
    const await1 = this.brokersRepository.getAll();
    const await2 = this.settingsService.getDefaultBrokerUuid();
    const brokers = await await1;
    const uuid = await await2;
    if (brokers.length > 0) {
      const index = brokers.findIndex(b => b.uuid === uuid);
      if (index >= 0) {
        this.broker = brokers[index];
      } else {
        this.broker = brokers[0];
      }
    }
  }

  async ngOnDestroy() {
    if (this.backButtonSubscription !== undefined) {
      this.backButtonSubscription.unsubscribe();
    }
  }

  async save(): Promise<void> {
    if (this.broker.uuid) {
      await this.brokersRepository.update(this.broker.uuid, this.broker);
      const toast = await this.toastController.create({
        message: 'Successful updated',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    } else {
      const uuid = await this.brokersRepository.add(this.broker);
      this.settingsService.setDefaultBrokerUuid(uuid);
      const toast = await this.toastController.create({
        message: 'Successful saved',
        duration: 2000,
        position: 'bottom'
      });
      toast.present();
    }
    if (this.returnTo) {
      this.router.navigate([ this.returnTo ]);
    }
  }

}
