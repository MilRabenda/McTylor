import { Component, OnInit } from '@angular/core';
import { LastPageComponent } from '../last-page/last-page.component';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { Category } from '../../../../shared/Models/Category'
import {ExifParserFactory} from "ts-exif-parser";

@Component({
  selector: 'app-picture-preview',
  templateUrl: './picture-preview.component.html',
  styleUrls: ['./picture-preview.component.scss'],
})
export class PicturePreviewComponent implements OnInit {
  position!: string;

  picture!: string;

  comment: string ="";

  latitude!: number;

  longitude!: number;

  exifLatitude!: number;

  exifLongitude!: number;

  selectedCategory: Category | undefined;

  categories: Category[] = [];

  component = LastPageComponent;
  metaData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.selfie();

    this.location();

    this.http
      .get<Category[]>('https://localhost:44391/Main/GetCategories')
      .subscribe(response =>{
        this.categories = response;
      });
  }

  async selfie() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.Uri,
    });

    this.picture = image.webPath ? image.webPath : '';

    if(this.picture){
      this.processImage();
    }
  }

  async location() {
    const location = await Geolocation.getCurrentPosition();

    this.position =
      location.coords.latitude.toString() +
      ' ' +
      location.coords.longitude.toString();

    this.longitude = location.coords.longitude;
    this.latitude = location.coords.latitude;
  }

  async uriToBlob(uri: string): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('Failed to convert URI to Blob'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri);
      xhr.send();
    });
  }
  
  async getExifDataFromImage(imageUri: string): Promise<any> {
    try {
      const blob = await this.uriToBlob(imageUri);
      const arrayBuffer = await blob.arrayBuffer();
      const exifData = ExifParserFactory.create(arrayBuffer).parse();
      return exifData;
    } catch (error) {
      console.error('Error getting EXIF data:', error);
      return null;
    }
  }
  
  async processImage() {
    try {
      const imageUri = this.picture;
      const exifData = await this.getExifDataFromImage(imageUri);
      console.log('EXIF Data:', exifData);
      this.exifLatitude = exifData.tags?.GPSLatitude ? exifData.tags?.GPSLatitude : 0;
      this.exifLongitude = exifData.tags?.GPSLongitude ? exifData.tags?.GPSLongitude : 0;
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }

  async send() : Promise<void> {
    try {
      const blob = await this.uriToBlob(this.picture);
      const formData = new FormData();
      const timestamp = new Date().getTime();
      const filename = `photo_${timestamp}.jpg`;

      formData.append('picture', blob, filename);
      formData.append('date', new Date().toISOString());
      formData.append('categoryId', this.selectedCategory!.id.toString());
      formData.append('comment', this.comment);

      if(this.exifLatitude != 0 && this.exifLongitude !=0){
        formData.append('latitude', this.exifLatitude.toString());
        formData.append('longitude', this.exifLongitude.toString());
      } else {
        formData.append('latitude', this.latitude.toString());
        formData.append('longitude', this.longitude.toString());
      }

      this.http.post<any>('https://localhost:44391/Main/AddPhoto', formData)
        .subscribe(
          response => {
            console.log('Image successfully sent to the backend', response);
          },
          error => {
            console.error('Error sending image to the backend', error);
          }
        );
    } catch (error) {
      console.error('Error processing image:', error);
    }
  }
}
