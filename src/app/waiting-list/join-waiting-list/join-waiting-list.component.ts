import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-join-waiting-list',
  templateUrl: './join-waiting-list.component.html',
  styleUrls: ['./join-waiting-list.component.scss'],
})
export class JoinWaitingListComponent implements OnInit {

public countDown = 0;
    public isLoad = false;
    public totalPrice;
    public seats;
    public price;
    public showLoading;

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
                const shifts = result.data;
                for (let i = 0; i < shifts.length; i++) {
                    if (shifts[i].id == this.shift_id) {
                        this.price = shifts[i].deposit_amount;
                        this.totalPrice = this.price * this.seats;
                        this.cur_shift = shifts[i];
                        break;
                    }
                }
                this.showLoading = false;
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
}
