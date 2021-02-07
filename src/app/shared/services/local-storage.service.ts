import { Injectable } from '@angular/core';

type storageKey = 'userId';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  public has(key: storageKey): boolean {
    return key in localStorage;
  }

  public get(key: storageKey): string {
    return localStorage.getItem(key);
  }

  public getJson(key: storageKey): any {
    return JSON.parse(this.get(key));
  }

  public set(key: storageKey, value: string) {
    localStorage.setItem(key, value);
  }

  public setJson(key: storageKey, value: any) {
    this.set(key, JSON.stringify(value));
  }

  public remove(key: storageKey) {
    localStorage.removeItem(key);
  }

  public clear() {
    localStorage.clear();
  }
}
