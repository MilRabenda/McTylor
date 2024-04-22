import { Component, OnInit } from '@angular/core';
import { LastPageComponent } from '../last-page/last-page.component';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-picture-preview',
  templateUrl: './picture-preview.component.html',
  styleUrls: ['./picture-preview.component.scss'],
})
export class PicturePreviewComponent implements OnInit {

  position!: string;

  picture!: string;

  component = LastPageComponent;

  constructor() {}

  ngOnInit() {
    this.selfie();
    this.location();
  }

  async selfie() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
    });

    this.picture = image.dataUrl ? image.dataUrl : '';
  }
  async location() {
    const location = await Geolocation.getCurrentPosition();

    this.position =
      location.coords.latitude.toString() +
      ' ' +
      location.coords.longitude.toString();
  }
}
