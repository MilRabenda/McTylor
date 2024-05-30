import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { Photo } from '../../../../shared/Models/Photo';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Category } from '../../../../shared/Models/Category';
import { CopyFilesService } from '../Services/copyFilesService';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { PhotoService } from '../Services/photo.service';
import { CategoryService } from '../Services/category.service';
import { MatDialog } from '@angular/material/dialog';
import { VerifyPhotoDialogComponent } from './verify-photo-dialog/verify-photo-dialog.component';

export interface PhotoWithCategory extends Photo {
  categoryName?: string;
}

export interface DialogData {
  photoId: number;
  description?: string;
}

@Component({
  selector: 'app-photos',
  animations: [
    trigger('myInsertRemoveTrigger', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit, AfterViewInit {
  copyFilesService = inject(CopyFilesService);

  photoService = inject(PhotoService);

  categoryService = inject(CategoryService);

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

  constructor(public dialog: MatDialog) {}

  ngAfterViewInit(): void {
    this.photoService.getPhotos().subscribe((photos) => {
      this.photos = photos
      .filter(photo => !photo.isVerified);
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

  ngOnInit() {}

  copyFiles() {
    this.copyFilesService
      .copyPhotosToTemporaryFolder(this.photos)
      .subscribe((response) => {
        this.photos = response.photos.filter((photo: Photo) => !photo.isVerified);;
        this.allPhotos = this.photos;
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

      this.updatePaginatedPhotos();
    });
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

  toggle(): void {
    this.isShown = !this.isShown;
  }
  openVerifyDialog(id: number): void {
    console.log("verify hihi")
    const dialogRef = this.dialog.open(VerifyPhotoDialogComponent, {
      data: {photoId: id}
    });

    dialogRef.backdropClick().subscribe(_ => {
      // Close the dialog
      dialogRef.close(null);
    })



    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if(result != null){
        console.log("zamkniecie dialogu")
        console.log(result)
        this.photoService.verifyPhoto(id, result).subscribe(response =>{
          console.log("weryfikacja zdjecia")
          this.photoService.getPhotos().subscribe((photos) => {
          console.log("porbranie zdjecia")
  
            this.photos = photos;
            this.copyFiles();
          });
        })
      }

    });
  }
}

