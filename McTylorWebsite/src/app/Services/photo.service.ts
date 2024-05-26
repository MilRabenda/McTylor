import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Photo } from '../../../../shared/Models/Photo';
import { ArchivedPhoto } from '../Models/ArchivedPhoto';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
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

  getClosedPhotos(): Observable<Photo[]> {
    return this.http
      .get<Photo[]>('https://localhost:44391/Main/GetVerifiedPhotos', {
        headers: this.headers,
      })
      .pipe();
  }

  getPhotos(): Observable<Photo[]> {
    return this.http
      .get<Photo[]>('https://localhost:44391/Main/GetPhotos', {
        headers: this.headers,
      })
      .pipe();
  }

  verifyPhoto(id : number, description : string) : Observable<Object>{
    return this.http
    .post(`https://localhost:44391/Main/VerifyPhoto/ ${id}?reasonOfArchive=${description}`, null,{
      headers: this.headers,
    }).pipe();
  }

  getArchivedPhotos(): Observable<ArchivedPhoto[]> {
    return this.http
    .get<ArchivedPhoto[]>('https://localhost:44391/Main/GetArchivedPhotos', {
      headers: this.headers,
    })
    .pipe();
  }
}
