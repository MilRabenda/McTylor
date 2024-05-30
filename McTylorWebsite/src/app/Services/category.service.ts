import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs';
import { Category } from '../../../../shared/Models/Category';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
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

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>('https://localhost:44391/Main/GetCategories', {
        headers: this.headers,
      });
  }

  insertCategory(categoryName : string): Observable<Object> {
    return this.http.post('https://localhost:44391/Main/AddCategory/' + categoryName, {
      headers: this.headers,
    });
  }

  deleteCategory(id : number): Observable<Object> {
    return this.http
    .delete<any>('https://localhost:44391/Main/DeleteCategory/' + id, {
      headers: this.headers,
    });
  }
  
  editCategoryName(categoryId : number, categoryName : string): Observable<Object> {
    return this.http.post(`https://localhost:44391/Main/EditCategory/${categoryId}?newName=${categoryName}`, null, {
      headers: this.headers,
    });
  }
}
