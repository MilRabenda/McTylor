import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Photo } from '../../../../shared/Models/Photo'
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Category } from '../../../../shared/Models/Category';
import { CopyFilesService } from '../copyFilesService';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';

export interface PhotoWithCategory extends Photo {
  categoryName?: string;
}

@Component({
  selector: 'app-photos',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  copyFilesService = inject(CopyFilesService);

  allPhotos: PhotoWithCategory[] = [];

  photos: PhotoWithCategory[] = [];

  isLoading = true;

  paginatedPhotos!: PhotoWithCategory[];

  pageSize = 5;

  currentPage = 0;

  categories!: Category[];

  isShown: boolean = false;

  isSorted: boolean = false;

  categoryControl = new FormControl();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
 
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.copyFilesService.getPhotos().subscribe(photos => {
      this.photos = photos;
      this.copyFiles();
    });

    this.categoryControl.valueChanges.subscribe(value =>{
      if(value == undefined){
        this.photos = this.allPhotos;
        this.updatePaginatedPhotos();
      } else {
        console.log(value)
        this.photos = this.allPhotos.filter(photo => photo.categoryId === value);
        console.log(this.photos)
        this.updatePaginatedPhotos();
      }
    })
  }

  copyFiles() {
    this.copyFilesService.copyPhotosToTemporaryFolder(this.photos).subscribe(response => {
      console.log(response);
      this.photos = response.photos;
      this.allPhotos = this.photos;
      this.getCategories();
    });
  }

  getCategories() : void {
    this.http
    .get<Category[]>('https://localhost:44391/Main/GetCategories')
    .subscribe(response =>{
      this.categories = response;

      this.photos.map(photo =>{
      const category = this.categories.find(category => category.id === photo.categoryId);
      photo.categoryName = category ? category.name : undefined;
      });
          
      console.log(this.photos)
      this.updatePaginatedPhotos();

    });
  }

  openGoogleMaps(latitude: number, longitude: number) : void {
    window.open(`https://www.google.pl/maps/place/ ${this.convertLatLonToDMS(latitude, longitude)}`, '_blank');
  }

  updatePaginatedPhotos() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedPhotos = this.photos.slice(startIndex, startIndex + this.pageSize);
    this.isLoading = false;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedPhotos();
  }

  toDMS(degree: number): { degrees: number, minutes: number, seconds: number } {
    const absolute = Math.abs(degree);
    const degrees = Math.floor(absolute);
    const minutes = Math.floor((absolute - degrees) * 60);
    const seconds = ((absolute - degrees) * 60 - minutes) * 60;

    return { degrees, minutes, seconds };
}

convertLatLonToDMS(lat: number, lon: number): string {
    const latDMS = this.toDMS(lat);
    const lonDMS = this.toDMS(lon);

    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';

    const latString = `${latDMS.degrees}°${latDMS.minutes}'${latDMS.seconds.toFixed(1)}"${latDirection}`;
    const lonString = `${lonDMS.degrees}°${lonDMS.minutes}'${lonDMS.seconds.toFixed(1)}"${lonDirection}`;

    return `${latString}+${lonString}`;
}

sort() : void {
  this.isSorted = ! this.isSorted;
  if(this.isSorted){
    this.photos.sort((a, b) =>{
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    console.log(this.photos)
  } else {
    this.photos.reverse();
    console.log(this.photos)

  }
  this.updatePaginatedPhotos();

}

toggle() : void {
  this.isShown = !this.isShown;
}

}
