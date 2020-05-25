import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from './local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
  })
  export class SocketOne extends Socket {
    
    public constructor(private locatStorageService: LocalStorageService) {
      super(
            {
                url: environment.apiUrl, options: {
                    query:{ user: locatStorageService.getItem('user') }
                }
            }
      );
    }
  }