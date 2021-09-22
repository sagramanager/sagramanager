import { Component } from '@angular/core';
import { NavbarVisibilityService } from './_services/navbar-visibility.service';
import { LocationBackService } from './_services/location-back.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SagraManager';
  showMenu = false;

  constructor(
    public navbarVisibilityService: NavbarVisibilityService,
    private locationBackService: LocationBackService
  ) {}
}
