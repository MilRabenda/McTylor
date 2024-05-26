import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../../../../shared/Models/Photo';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CopyFilesService {
  token: any;

  headers: any;

  constructor(
      private http: HttpClient,
      private storageService: StorageService,
  ) 
  {
    this.token = this.storageService.get('token');
    if (!this.token) {
      console.error('No token found.');
    }
    this.headers = new HttpHeaders()
    .set('Authorization', `Bearer ${this.token}`)
    .set('Accept', 'text/plain');
  }
  
copyPhotosToTemporaryFolder(photos: Photo[]): Observable<any> {
    return this.http.post(
        'https://localhost:44391/Main/CopyPhotosToTemporary',
        photos, { headers: this.headers }
    );
}
}
