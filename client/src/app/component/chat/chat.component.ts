import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { MessageService } from 'src/app/services/message.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewChecked, OnDestroy {

  activeContact: any;
  text: string;
  messages = [];
  messageSub: any;
  
  private unsubscribeOnDestroy = new Subject<void>();

  @ViewChild('scroll') private chatContainer: ElementRef;

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.scrollToBottom();

    this.usersService.watchChat()
    .pipe(takeUntil(this.unsubscribeOnDestroy))
    .subscribe( user => {
      this.activeContact = user;
      const client = JSON.parse(this.localStorage.getItem('user'));
      if (this.activeContact){
        this.messageService.getMessages(client.id, this.activeContact.id)
            .pipe(takeUntil(this.unsubscribeOnDestroy))
            .subscribe(messages => this.messages = messages);

        if (this.messageSub) {
            this.messageSub.unsubscribe();
        }

        this.messageService.startChat(this.activeContact)
        this.messageSub = this.messageService.getMessage()
            .pipe(takeUntil(this.unsubscribeOnDestroy))
            .subscribe( msg => {
              if ( msg.sender.id === client.id && msg.receiver.id === this.activeContact.id 
                || msg.sender.id === this.activeContact.id && msg.receiver.id === client.id ) {
                  this.messages.push(msg);
              }

        } );
      }
    } );
  }

  public ngOnDestroy() {
    this.unsubscribeOnDestroy.next();
    this.unsubscribeOnDestroy.complete();
  }

  ngAfterViewChecked() {
      this.scrollToBottom();
  }

  send(): void {
    if (this.text && this.text.trim() !== '' && this.activeContact) {
      this.messageService.newMessage(this.text, this.activeContact);
      this.text = '';
    }
  }

  scrollToBottom(): void {
    try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { }
}
}
