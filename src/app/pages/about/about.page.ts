import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, OnDestroy {

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
