import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { UserLogin } from '../Models/UserLogin';
import { BehaviorSubject, Observable, catchError, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../Models/User';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedInSubject = new BehaviorSubject<boolean>(this.storageService.get('isLoggedIn') || false);
  
  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService,
    private storageService: StorageService,
    private router: Router
  ) { }

  login(user: UserLogin): Observable<any> {
    return this.http.post('https://localhost:44391/Auth/login', user, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        return response;
      }),
      catchError(error => {
        return error; 
      })
    );
  }

  auth(token: string) {
    const decodedToken = this.jwtHelperService.decodeToken(token);
    let userObject : User;
    if (decodedToken) {
      const accountId= decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      this.http.get<User>(`https://localhost:44391/User/${accountId}`).subscribe((account)=>{
        userObject=account;
        this.storageService.set('token', token);
        this.storageService.set('user', userObject);
        this.storageService.set('isLoggedIn', true);
        this.router.navigateByUrl('/Photos').then(() => { location.reload()});
        this.loggedInSubject.next(true);
      });
    }
  }

  logout(): void {
    this.storageService.clear();
    this.loggedInSubject.next(false);
    this.router.navigateByUrl('');

  }

  getUserLoginStatus(): Observable<boolean> {
    return this.loggedInSubject.asObservable();
  }

  getUserRole(): string {
    const user = this.storageService.get('user');
    return user ? user.accountType : '';
  }
}
