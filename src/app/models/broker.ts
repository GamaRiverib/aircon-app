import { BaseEntity } from '../repositories/crud.repository';

export type MQTTProtocol = 'wss' | 'ws'; // | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs';

export interface ConnectOptions {
    timeout?: number;
    clientId?: string;
    username?: string;
    password?: string;
    cleanSession?: boolean;
    useSSL?: boolean;
    hosts: Array<string>;
    ports: Array<number>;
    protocol?: MQTTProtocol;
    reconnect?: boolean;
    mqttVersion?: number;
}

export interface IBroker {
    name: string;
    connectOptions: ConnectOptions;
    lastConnectedAt?: Date;
}

export class Broker extends BaseEntity implements IBroker {
    name: string;
    connectOptions: ConnectOptions;
    lastConnectedAt?: Date;

    constructor() {
        super();
        this.name = '';
        this.connectOptions = null;
    }
}
