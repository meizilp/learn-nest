import { Injectable } from '@angular/core';

const GLOBAL_NAMESPACE = 'todayng';
const INIT_FLAG = `${GLOBAL_NAMESPACE}.inited`;
const START_DATE = `${GLOBAL_NAMESPACE}.start_date`;
const USER_NAME = `${GLOBAL_NAMESPACE}.user_name`;

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  setInited(): void {
    this.set(INIT_FLAG, true);
  }
  setStartDate(): void {
    this.set(START_DATE, Date.now());
  }
  setUsername(username: string): void {
    this.set(USER_NAME, username);
  }

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
