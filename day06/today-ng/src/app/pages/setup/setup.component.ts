import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  username: string;

  constructor(private store: LocalStorageService) { }

  ngOnInit() {
  }

  saveSettings(): void {
    this.store.setInited();
    this.store.setStartDate();
    this.store.setUsername(this.username);
  }

}
