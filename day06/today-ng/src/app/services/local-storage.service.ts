import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public set(key: string, value: any): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public get<T>(key: string): T {
    const v = localStorage.getItem(key);
    if (v) {
      return JSON.parse(v) as T;
    } else {
      return undefined;
    }
  }

  public getList<T>(key: string): T[] {
    const v = localStorage.getItem(key);
    if (v) {
      return JSON.parse(v) as T[];
    } else {
      return [];
    }
  }
}
