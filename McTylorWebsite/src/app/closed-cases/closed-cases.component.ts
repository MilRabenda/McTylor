import { AfterViewInit, Component, inject } from '@angular/core';
import { CopyFilesService } from '../Services/copyFilesService';
import { FormControl } from '@angular/forms';
import { PhotoService } from '../Services/photo.service';
import { CategoryService } from '../Services/category.service';
import { Category } from '../../../../shared/Models/Category';
import { ArchivedPhoto } from '../Models/ArchivedPhoto';
import { PageEvent } from '@angular/material/paginator';
import { Photo } from '../../../../shared/Models/Photo';
import { UserService } from '../Services/user.service';
import { trigger, transition, style, animate } from '@angular/animations';



export interface ArchivedPhotoWithCategory extends ArchivedPhoto {
  categoryName?: string;
  userEmail?: string;
}

@Component({
  selector: 'app-closed-cases',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './closed-cases.component.html',
  styleUrls: ['./closed-cases.component.scss']
})
export class ClosedCasesComponent implements AfterViewInit{

  copyFilesService = inject(CopyFilesService);

  photoService = inject(PhotoService);

  categoryService = inject(CategoryService);

  userService = inject(UserService);

  allPhotos: ArchivedPhotoWithCategory[] = [];

  photos: ArchivedPhotoWithCategory[] = [];

  isLoading = true;

  isShown: boolean = false;

  isSorted: boolean = false;

  categories!: Category[];

  categoryControl = new FormControl();

  paginatedPhotos!: ArchivedPhotoWithCategory[];

  pageSize = 5;

  currentPage = 0;

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.photoService.getArchivedPhotos().subscribe((photos) => {
      this.photos = photos;
      this.copyFiles();
    });

    this.categoryControl.valueChanges.subscribe((value) => {
      if (value == undefined) {
        this.photos = this.allPhotos;
        this.updatePaginatedPhotos();
      } else {
        this.photos = this.allPhotos.filter(
          (photo) => photo.categoryId === value
        );
        this.updatePaginatedPhotos();
      }
    });
  }

  copyFiles() {
    this.copyFilesService
      .copyPhotosToTemporaryFolder(this.photos)
      .subscribe((response) => {
        this.photos.forEach(photo => {
          response.photos.map((e: Photo) =>{
              if(photo.photoId == e.id) {
                photo.temporaryPath = e.temporaryPath
                this.allPhotos.push(photo);
              }
          })
        })
      this.getCategories();
    });
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories;
      this.photos.map((photo) => {
        const category = this.categories.find(
          (category) => category.id === photo.categoryId
        );
        photo.categoryName = category ? category.name : undefined;
      });
      this.getUser();
    });
  }

  getUser() {
    this.photos.forEach(photo=>{
      this.userService.getUser(photo.userId).subscribe( response =>{
        photo.userEmail = response.email;
      })
    })
    this.updatePaginatedPhotos();
  }

  openGoogleMaps(latitude: number, longitude: number): void {
    window.open(
      `https://www.google.pl/maps/place/ ${this.convertLatLonToDMS(
        latitude,
        longitude
      )}`,
      '_blank'
    );
  }

  toDMS(degree: number): { degrees: number; minutes: number; seconds: number } {
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

    const latString = `${latDMS.degrees}°${
      latDMS.minutes
    }'${latDMS.seconds.toFixed(1)}"${latDirection}`;
    const lonString = `${lonDMS.degrees}°${
      lonDMS.minutes
    }'${lonDMS.seconds.toFixed(1)}"${lonDirection}`;

    return `${latString}+${lonString}`;
  }

  toggle(): void {
    this.isShown = !this.isShown;
  }

  
  sort(): void {
    this.isSorted = !this.isSorted;
    if (this.isSorted) {
      this.photos.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      });
    } else {
      this.photos.reverse();
    }
    this.updatePaginatedPhotos();
  }

  updatePaginatedPhotos() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedPhotos = this.photos.slice(
      startIndex,
      startIndex + this.pageSize
    );
    this.isLoading = false;
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedPhotos();
  }
}

