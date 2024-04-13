import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  picture: string | undefined = '';
  constructor() {}

  async selfie() {
  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.DataUrl
  });
  this.picture = image.dataUrl;
  }

}
