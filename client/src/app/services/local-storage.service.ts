import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export const localStorageProps = {
    accessToken: 'access_token',
    currentUser: 'currentUser'
};

@Injectable()
export class LocalStorageService {

    private storageSub = new Subject<string>();

    watchStorage(): Observable<any> {
        return this.storageSub.asObservable();
    }

    setItem(key: string, data: string) {
        localStorage.setItem(key, data);
        this.storageSub.next('added');
    }

    getItem(key: string) {
        return localStorage.getItem(key);
    }

    removeItem(key) {
        localStorage.removeItem(key);
        this.storageSub.next('removed');
    }

    clearStorage() {
        localStorage.clear();
        this.storageSub.next('clear');
    }

}
