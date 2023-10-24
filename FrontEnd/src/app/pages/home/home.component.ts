import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ItemsMenu } from 'src/app/interfaces/itemsMenu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public router: Router){}

  public itemsMenu:ItemsMenu[] = [
    {
      name: 'Cambios',
      url: '/home'
    },
    {
      name: 'Monitoreo',
      url: '/home/monitoreo'
    },
    {
      name: 'APPs',
      url: '/home/apps'
    }
  ]

}
