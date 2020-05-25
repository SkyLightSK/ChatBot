import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private chatSub = new Subject<any>();
  
  constructor(
    private http: HttpClient
  ) { }
  
  watchChat(): Observable<any> {
      return this.chatSub.asObservable();
  }

  setChat(activeChat) {
      this.chatSub.next(activeChat);
  }

  createUser(): Observable<any[]> {
    return this.http.get<any>(`${environment.apiUrl}/users/create`);
  }

  public getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/users`);
  }
}
