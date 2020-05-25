import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketOne } from './socet-one.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export class Message {
  id: string;
  msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private socket: SocketOne,
    private http: HttpClient
    ) { 
    socket.on('connect', () => {
      console.log('Connected');

      socket.emit('events', { test: 'test' });
    });
  }

  authUser() {
    return this.socket.emit('authUser');
  }

  getAuth(): Observable<any> {
    return this.socket.fromEvent<any>('authUser');
  }

  getMessage(): Observable<any> {
    return this.socket.fromEvent<any>('message');
  }

  newMessage(text: string, receiver: any ) {
    return this.socket.emit('message', { text, receiver });
  }

  getUsers(): Observable<any> {
    return this.socket.fromEvent<any>('usersConnection');
  }

  usersList(): Observable<any> {
    return this.socket.fromEvent<any>('usersList');
  }

  startChat(receiver) {
    return this.socket.emit('startChat', {receiver})
  }

  getMessages(participant1: number, participant2: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/message?participant1=${participant1}&participant2=${participant2}`);
  }

}
