import { Component, OnInit } from '@angular/core';
import { PicturePreviewComponent } from '../picture-preview/picture-preview.component';
import { App, AppPlugin } from '@capacitor/app';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.scss'],
})
export class PicturePageComponent implements OnInit {

  component = PicturePreviewComponent;
  app!: AppPlugin;
  nav!: NavController;
  picture: string = 'assets/icon/image-svgrepo-com.svg';

  constructor() {}

  ngOnInit() {
  }
}
