import { BaseEntity } from '../repositories/crud.repository';

export interface IDevice {
    name: string;
    topic: string;
}

export type Mode = 'off' | 'auto' | 'cool' | 'heat' | 'dry' | 'fan_only';
export type Fan = 'Auto' | 'Min' | 'Low' | 'Medium' | 'High' | 'Max';
export type Swing = 'Off' | 'Auto' | 'Highest' | 'High' | 'Middle' | 'Low' | 'Lowest';
export type OnOff = 'on' | 'off';

export interface State {
    protocol?: string;
    model?: string;
    power?: OnOff;
    mode?: Mode;
    temp?: number;
    use_celsius?: OnOff;
    fanspeed?: Fan;
    swingh?: Swing;
    swingv?: Swing;
    quiet?: OnOff;
    turbo?: OnOff;
    econo?: OnOff;
    light?: OnOff;
    filter?: OnOff;
    clean?: OnOff;
    beep?: OnOff;
    sleep?: OnOff;
}

export class Device extends BaseEntity implements IDevice {
    name: string;
    topic: string;
    state?: State;
    status?: 'Online' | 'Offline';

    constructor() {
        super();
        this.name = '';
        this.topic = '';
    }
}
