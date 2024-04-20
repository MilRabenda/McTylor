import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera'
import { WelcomePageComponent } from '../welcome-page/welcome-page.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  component = WelcomePageComponent;

  constructor() {}
  

}
