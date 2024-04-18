import { Component, OnInit } from '@angular/core';
import { LastPageComponent } from '../last-page/last-page.component';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.scss'],
})
export class PicturePageComponent  implements OnInit {
  component = LastPageComponent;
  picture: string | undefined = '';
  constructor() {}
  registerContacts = async () => {
    let permStatus = await Camera.checkPermissions()
    if (permStatus.camera === 'prompt') {
      await Camera.requestPermissions()
    }
    if (permStatus.camera !== 'granted') {
      throw new Error('User denied permissions!')
    }
  }
  async selfie() {
    let permStatus = await Camera.checkPermissions()
    if (permStatus.camera === 'prompt') {
      await Camera.requestPermissions()
    }
    if (permStatus.camera !== 'granted') {
      throw new Error('User denied permissions!')
    }

  const image = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.DataUrl
  });
  this.picture = image.dataUrl;
  }

  ngOnInit() {
    this.registerContacts;
  }

}
