import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {

  private backButtonSubscription: Subscription | undefined;

  constructor(
    private platform: Platform,
    private navController: NavController) { }

  ngOnInit() {
    this.backButtonSubscription =
      this.platform.backButton.subscribe(() => this.navController.back());
  }

  ngOnDestroy() {
    if (this.backButtonSubscription !== undefined) {
      this.backButtonSubscription.unsubscribe();
    }
  }

}
