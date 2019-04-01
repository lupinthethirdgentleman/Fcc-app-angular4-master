import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  encapsulation : ViewEncapsulation.None,
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

    isLogged: any;
    name;
    cu;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: API,
        private location: Location) { }

    ngOnInit() {
        this.cu = this.api.cu.data;
        this.name = this.cu.name;
    }

    // go to prev step
      goBack() {
        this.location.back();
    }

    logout() {
        this.api.cu.signOut();
        this.router.navigate(['/']);
    }
}
