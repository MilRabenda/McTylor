import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Photo } from '../../../shared/Models/Photo';

@Injectable({
  providedIn: 'root',
})
export class CopyFilesService {
constructor(private http: HttpClient) {}

getPhotos(): Observable<Photo[]> {
    return this.http
    .get<Photo[]>('https://localhost:44391/Main/GetPhotos').pipe();

}

copyPhotosToTemporaryFolder(photos: Photo[]): Observable<any> {
    return this.http.post(
        'https://localhost:44391/Main/CopyPhotosToTemporary',
        photos
    );
}
}
