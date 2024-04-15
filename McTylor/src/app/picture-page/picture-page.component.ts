import { Component, OnInit } from '@angular/core';
import { LastPageComponent } from '../last-page/last-page.component';

@Component({
  selector: 'app-picture-page',
  templateUrl: './picture-page.component.html',
  styleUrls: ['./picture-page.component.scss'],
})
export class PicturePageComponent  implements OnInit {
  component = LastPageComponent;
  constructor() { }

  ngOnInit() {}

}
