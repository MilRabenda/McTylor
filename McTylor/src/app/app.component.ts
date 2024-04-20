import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  width: number | undefined;
  
  height: number | undefined;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      this.width=platform.width();
      this.height = platform.height();
    });
  }
}
