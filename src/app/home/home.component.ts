import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { API } from '../api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {

    constructor( private router: Router,
        private api: API) { }

    ngOnInit() {
        document.querySelector('body').classList.remove('patern-big');
        if (this.api.booking.countDown)
            this.api.booking.setCountDown(0);
    }
    goToNext() {
        // clear status
        this.api.booking.clearStatus();
        this.router.navigate(['/select-date']);
    }
}
