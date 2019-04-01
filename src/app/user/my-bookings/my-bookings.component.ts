import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})

export class MyBookingsComponent implements OnInit {
    upcomingBookings = [];
    previousBookings = [];
    bookingTab = 0;
    showLoading = false;
    constructor(        
        private router: Router,
        private route: ActivatedRoute,
        private api: API,
        private location: Location,
        private datepipe: DatePipe
    ) { }

    ngOnInit() {
        this.showLoading = true;
        const data = {
            id: this.api.cu.data.id
        };
        this.api.getBooking(data).subscribe(
            result => {
                this.showLoading = false;
                const bookings = result.data;
                
                for (let i = 0; i < bookings.length; i++) {
                    let datetime = moment(bookings[i].date +' ' + bookings[i].time).toDate();

                    if (new Date() > datetime) {
                        this.previousBookings.push(bookings[i]);
                    }   else {
                        this.upcomingBookings.push(bookings[i]);                        
                    } 
                }
            },
            error => {
                this.showLoading = false;
                if( error[0] == "token_expired"){
                    this.api.cu.signOut();
                    this.router.navigate(['/']);
                }
                else
                    this.router.navigate(['/error']);
            }
        );
    }

    // go to prev step
    goBack() {
        this.location.back();
    }

}
