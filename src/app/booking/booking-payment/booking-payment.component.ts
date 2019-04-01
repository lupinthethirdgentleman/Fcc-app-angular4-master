import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['../booking.component.scss', './booking-payment.component.scss'],
})
export class BookingPaymentComponent implements OnInit, OnDestroy {
    public countDown = 0;
    public isLoad = false;
    public totalPrice;
    public seats;
    public price;
    public showLoading;
    public isWaiting;

    // Subscription object
    private sub: Subscription;
    private date;
    private time;
    private shift_id;
    private note;
    private cur_shift;
    constructor( 
        private router: Router,
        private route: ActivatedRoute,
        private api: API,
        private location: Location) { }

    ngOnInit() {
        // get booking status
        const status = this.api.booking.getStatus();
        this.showLoading = true;

        this.date = status.date;
        this.time = status.time;
        this.shift_id = status.shift_id;
        this.seats = status.seats;
        this.note = status.note;
        this.isWaiting = status.isWaiting;

        // Timer set
        this.countDown = this.api.booking.countDown;
        this.sub = Observable.timer(this.countDown, 1000).subscribe(t => {
            if (this.countDown > 0) {
                this.countDown--;
            } else {
                this.router.navigate(['/time-up']);
            }
        });

        const date = {
            date: this.date
        };
        this.api.getTimeSlots(date).subscribe(
            result => {
                this.showLoading = false;
                const shifts = result.data;
                for (let i = 0; i < shifts.length; i++) {
                    if (shifts[i].id == this.shift_id) {
                        this.price = shifts[i].deposit_amount;
                        this.totalPrice = this.price * this.seats;
                        this.cur_shift = shifts[i];
                        break;
                    }
                }
                this.isLoad = true;
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
        // create booking
        this.showLoading = true;
        let booking_status = "Booked";
        if( this.isWaiting == true )
            booking_status = "Waiting in bar";          

        const data = {
            date: this.date,
            time: this.time,
            hours: this.cur_shift.shift_atb,
            number_of_people: this.seats,
            guest_id: this.api.cu.data.id,
            status: booking_status,
            shift_package_id: this.cur_shift.shift_package_id,
            shift_id: this.cur_shift.id,
            floor_package_id: this.cur_shift.floor_package_id,
            notes_by_guest:this.note,
        };

        this.api.createBooking(data).subscribe(
            result => {
                this.showLoading = false;
                this.router.navigate(['/confirm'], { queryParams: { isWaiting: this.isWaiting }});
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
}
