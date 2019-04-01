import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['../booking.component.scss', './booking-overview.component.scss'],
})
export class BookingOverviewComponent implements OnInit, OnDestroy {

    public isLoggedIn: boolean;
    public countDown = 0;
    public isLoad = false;
    public name;
    public note;
    step = 0;
    // Subscription object
    private sub: Subscription;
    private date;
    private time;
    private seats;
    private shift_id;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: API,
        private location: Location) {

    }

    ngOnInit() {
        // get booking status
        const status = this.api.booking.getStatus();

        this.date = status.date;
        this.time = status.time;
        this.shift_id = status.shift_id;
        this.seats = status.seats;
        this.note = status.note;
        // Timer set
        this.countDown = this.api.booking.countDown;
        this.sub = Observable.timer(this.countDown, 1000).subscribe(t => {
            if (this.countDown > 0) {
                this.countDown--;
            } else {
                this.router.navigate(['/time-up']);
            }
        });

        this.isLoad = true;
        this.name = this.api.cu.data.name;
    }

    ngOnDestroy() {
        // unsubscribe here
        if (this.sub) {
            this.sub.unsubscribe();         
            this.api.booking.setCountDown(this.countDown);
        }
    }

    // go to prev step
    goBack() {
        this.location.back();
    }

    goToNext() {
        // update status
        this.api.booking.setStatus({note: this.note});
        this.router.navigate(['/booking-payment']);
    }
}
