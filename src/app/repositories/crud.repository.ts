import { NativeStorage } from '@ionic-native/native-storage/ngx';
// import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

export abstract class BaseEntity {
    uuid: string;
    createdAt?: number;
    lastUpdateAt?: number;
}

@Injectable({
    providedIn: 'root'
})
export abstract class CrudRespository<T extends BaseEntity> {

    private items: { [uuid: string]: T };

    constructor(protected nativeStorage: NativeStorage, protected namespace: string) {}

    private generateUuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            // tslint:disable-next-line: no-bitwise
            const r = Math.random() * 16 | 0;
            // tslint:disable-next-line: no-bitwise
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private async getItems(): Promise <{ [uuid: string]: T }> {
        if (this.items !== undefined) {
            return this.items;
        }
        try {
            this.items = await this.nativeStorage.getItem(this.namespace) || {};
            return this.items;
        } catch (reason) {
            console.log('Error: getItems', reason);
            this.items = {};
            return this.items;
        }
    }

    async add(item: T): Promise<string> {
        console.log('add', item);
        try {
            const uuid = this.generateUuid();
            const items = await this.getItems();
            if (items[uuid]) {
                throw new Error('Uuid exists');
            }
            const createdAt = Date.now();
            items[uuid] = Object.assign(item, { uuid, createdAt });
            await this.nativeStorage.setItem(this.namespace, items);
            return uuid;
        } catch (reason) {
            console.log('Error: add', reason);
            throw new Error('Error adding new item');
        }
    }

    async addBatch(batch: Array<T>): Promise<Array<string>> {
        try {
            const items: { [uuid: string]: T } = {};
            const uuids: Array<string> = [];
            const now: number = Date.now();
            batch.forEach((item: T) => {
                const uuid: string = this.generateUuid();
                item.uuid = uuid;
                item.createdAt = now;
                items[uuid] = item;
                uuids.push(uuid);
            });
            await this.nativeStorage.setItem(this.namespace, items);
            return uuids;
        } catch (reason) {
            console.log('Error: addBatch', reason);
            throw new Error('Error adding batch');
        }
    }

    async getAll(): Promise<Array<T>> {
        try {
            const items = await this.getItems();
            if (!items) {
                return [];
            }
            const uuids: Array<string> = Object.keys(items);
            return uuids.map(uuid => items[uuid]);
        } catch (reason) {
            console.log('Error: getAll', reason);
            return [];
        }
    }

    async getByUuid(uuid: string): Promise<T | null> {
        try {
            const items = await this.getItems();
            if (!items || !items[uuid]) {
                return null;
            }
            return items[uuid];
        } catch (reason) {
            console.log('Error: getByUuid', reason);
            return null;
        }
    }

    async listByUuid(uuids: Array<string>): Promise<Array<T>> {
        try {
            const list: Array<T> = [];
            const items = await this.getItems();
            if (!items) {
                return list;
            }
            const keys: Array<string> = Object.keys(items);
            const found = uuids.filter(uuid => keys.find(k => k === uuid));
            found.forEach(uuid => list.push(items[uuid]));
            return list;
        } catch (reason) {
            console.log('Error: listByUuid', reason);
            return [];
        }
    }

    async update(uuid: string, item: T): Promise<void> {
        try {
            const items = await this.getItems();
            if (!items || !items[uuid]) {
                throw new Error('Item not found');
            }
            item.uuid = uuid;
            item.lastUpdateAt = Date.now();
            const createdAt = { createdAt: items[uuid].createdAt };
            items[uuid] = Object.assign(items[uuid], item, createdAt);
            await this.nativeStorage.setItem(this.namespace, items);
        } catch (reason) {
            console.log('Error: update', reason);
        }
    }

    async remove(uuid: string): Promise<void> {
        try {
            const items = await this.getItems();
            if (!items || !items[uuid]) {
                throw new Error('Item not found');
            }
            delete items[uuid];
            await this.nativeStorage.setItem(this.namespace, items);
        } catch (reason) {
            console.log('Error: remove', reason);
        }
    }

    async removeAll(): Promise<void> {
        try {
            await this.nativeStorage.setItem(this.namespace, {});
            this.items = undefined;
        } catch (reason) {
            console.log('Error: removeAll', reason);
        }
    }
}
