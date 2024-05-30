import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { User } from '../Models/User';
import { UserCategory } from '../Models/UserCategory';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  token: any;

  headers: any;

  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.get('token');
    if (!this.token) {
      console.error('No token found.');
    }
    this.headers = new HttpHeaders()
      .set('Authorization', `Bearer ${this.token}`)
      .set('Accept', 'text/plain');
  }

  getUser(id : number) : Observable<User> {
    return this.http
    .get<User>('https://localhost:44391/User/' + id, {
      headers: this.headers,
    })
    .pipe();
  }
  
  getAllUsers() : Observable<User[]> {
    return this.http
    .get<User[]>('https://localhost:44391/User/GetAllUsers', {
      headers: this.headers,
    })
    .pipe();
  }

  addUserToCategory(userId: number, categoryId: number) : Observable<Object> {
    const body : UserCategory = {
      userId : userId,
      categoryId : categoryId
    }
    return this.http
    .post('https://localhost:44391/User/AddUserToCategory', body, {
      headers: this.headers,
    })
    .pipe();
  }
  
  changeUserCategory(userId: number, categoryId: number) : Observable<Object> {
    const body : UserCategory = {
      userId : userId,
      categoryId : categoryId
    }
    return this.http
    .post('https://localhost:44391/User/ChangeUserCategory', body, {
      headers: this.headers,
    })
    .pipe();
  }

  getUsersByCategory(categoryId: number): Observable<User[]> {
    return this.http
      .get<User[]>('https://localhost:44391/User/GetUsersByCategory/' + categoryId, {
        headers: this.headers,
      })
      .pipe();
  }
  
}
