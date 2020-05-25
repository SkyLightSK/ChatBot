import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  @Input() message: any;

  constructor(
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
  }

  isClientMsg() : boolean {
    return JSON.parse(this.localStorage.getItem('user')).id === this.message.sender.id;
  }

  formatAMPM(dateString): string {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes().toString();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = +minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }
  
}
