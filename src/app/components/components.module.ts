import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';

@NgModule({
  declarations: [
    EditDeviceComponent,
    DeviceDetailsComponent
  ],
  exports: [
    EditDeviceComponent,
    DeviceDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class ComponentsModule { }
