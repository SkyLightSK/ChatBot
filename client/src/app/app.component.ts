import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService, Message } from './services/message.service';
import { UsersService } from './services/users.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'Chat bots';
  client: any;
  
  constructor(
    private messageService: MessageService,
    private usersService: UsersService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {

    this.client = JSON.parse(this.localStorage.getItem('user'));
    if ( !this.client ) {
      this.messageService.authUser()
      this.messageService.getAuth().subscribe( user=> { 
        this.localStorage.setItem('user', JSON.stringify(user)); this.client = user; 
      });
    }
  }

  
}
