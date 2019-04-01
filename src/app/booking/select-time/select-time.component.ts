import { Component, OnInit, OnDestroy } from '@angular/core';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router, ActivatedRoute} from '@angular/router';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-select-time',
  templateUrl: './select-time.component.html',
  styleUrls: ['../booking.component.scss', './select-time.component.scss'],
})
export class SelectTimeComponent implements OnInit, OnDestroy {

    public countDown = 0;
    public shifts: any[];
    public timeslots: any[];
    public isLoad = false;
    // Subscription object
    private sub: Subscription;
    private date = '';
    private time = '';
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

        this.countDown = this.api.booking.countDown;        

        this.api.getTimeSlots(status).subscribe(
            result => {
                this.shifts = result.data;
                for (let i = 0; i < this.shifts.length; i++) {
                    this.shifts[i].options = [this.shifts[i].time_slots.length];
                    for (let j = 0; j < this.shifts[i].time_slots.length; j++) {
                        if (i === 0 && j === 0) {
                            this.time = this.shifts[i].time_slots[j];
                            this.shift_id = this.shifts[i].id;
                        }
                    }
                }
                // if time is in status params, set the time as initial value
                if (status && status.time) {
                    this.time = status.time;
                    this.shift_id = status.shift_id;
                }
                // Timer set
                this.sub = Observable.timer(this.countDown, 1000).subscribe(t => {
                    if (this.countDown > 0) {
                        this.countDown--;
                    } else {
                        this.router.navigate(['/time-up']);
                    }
                });
                this.isLoad = true;
            },
            error => {
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

    // go to next step
    goToNext() {
        // update status
        this.api.booking.setStatus({time:this.time, shift_id: this.shift_id});
        this.router.navigate(['/booking-person']);
    }

    // timeslot select
    selectedTimeSlot(shift_index, timeslot_index) {
        this.time = this.shifts[shift_index].time_slots[timeslot_index];
        this.shift_id = this.shifts[shift_index].id;
    }
}
