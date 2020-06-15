import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DevicesPage } from './devices.page';

import { ComponentsModule } from 'src/app/components/components.module';
import { EditDeviceComponent } from 'src/app/components/edit-device/edit-device.component';

const routes: Routes = [
  {
    path: '',
    component: DevicesPage
  }
];

@NgModule({
  entryComponents: [
    EditDeviceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DevicesPage]
})
export class DevicesPageModule {}
