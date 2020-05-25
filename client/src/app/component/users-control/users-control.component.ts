import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';
import { UsersService } from 'src/app/services/users.service';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-users-control',
  templateUrl: './users-control.component.html',
  styleUrls: ['./users-control.component.css']
})
export class UsersControlComponent implements OnInit{
  users = [];
  usersConnected = [];
  
  myControl = new FormControl();
  
  usersSub = new Subject<any[]>();
  usersConSub = new Subject<any[]>();

  filteredUsers: Observable<any[]>;

  constructor(
    private messageService: MessageService,
    private usersService: UsersService,
    private localStorage: LocalStorageService
  ) { }

  ngOnInit() {

    const client = JSON.parse(this.localStorage.getItem('user'))

    this.filteredUsers = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterUsers(value) )
    );

    this.filteredUsers.subscribe();

    this.messageService.usersList().subscribe((res: any[]) => {
      this.users = res.map( user => 
        ({...user, connection: this.usersConnected.find(userCon => userCon.name === user.name ) ? true : false })
      ).filter(user => client && client.id !== user.id );
        
      this.usersSub.next(this.users)
      this.usersConSub.next(this.users.filter( user => user.connection ))
    });

    this.messageService.getUsers()
      .subscribe( data => {
        this.usersConnected = data;
        this.users = this.users.map( user => 
          ({...user, connection: this.usersConnected.find(userCon => userCon.name === user.name ) ? true : false })  );

        this.usersSub.next(this.users)
        this.usersConSub.next(this.users.filter( user => user.connection || user.type !== 'client' ))
    });

  }

  selectContact(user){
    this.usersService.setChat(user);
  }

  private _filterUsers(value: string): any[] {
    const filterValue = value.toLowerCase();
    const filteredUsers = this.users.filter(user => user.name.toLowerCase().includes(filterValue))

    this.usersSub.next(filteredUsers)
    this.usersConSub.next(filteredUsers.filter( user => user.connection ))

    return this.users.filter(user => user.name.toLowerCase().includes(filterValue))
  }

}
