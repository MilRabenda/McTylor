import { Component, OnInit } from '@angular/core';
import { PicturePageComponent } from '../picture-page/picture-page.component';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent  implements OnInit {
  component = PicturePageComponent;

  width: number | undefined;
  
  height: number | undefined;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      this.width=platform.width();
      this.height = platform.height();
    });
  }

  ngOnInit() {}

}
