import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-no-of-people',
  templateUrl: './no-of-people.component.html',
  styleUrls: ['../booking.component.scss', './no-of-people.component.scss'],
})
export class NoOfPeopleComponent implements OnInit, OnDestroy {

    public countDown = 0;
    public persons: any[];
    public isLoad = false;
    public tables = 0;
    public person = 0;
    public showLoading = false;
    // Subscription object
    private sub: Subscription;
    private date;
    private time;
    private shift_id;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private api: API,
        private location: Location) { }

    ngOnInit() {

        // get booking status
        const status = this.api.booking.getStatus();
        if (status) {
            this.date = status.date;
            this.time = status.time;
            this.shift_id = status.shift_id;
            this.person = status.seats;
        }

        // Timer set
        this.countDown = this.api.booking.countDown;
        this.sub = Observable.timer(this.countDown, 1000).subscribe(t => {
            if (this.countDown > 0) {
                this.countDown--;
            } else {
                this.router.navigate(['/time-up']);
            }
        });
        // Set Persons
        if (this.api.booking.general !== null && this.api.booking.general.MaximumNumberofPeoplePerBooking !== null) {
            this.persons = [this.api.booking.general.MaximumNumberofPeoplePerBooking];
            for (let i = 0; i < this.api.booking.general.MaximumNumberofPeoplePerBooking; i++) {
                this.persons[i] = i + 1;
            }
        }

        if (this.person && this.person <= this.api.booking.general.MaximumNumberofPeoplePerBooking) {
            this.selectedPerson(this.person - 1);
        } else {
            this.person = 0;
        }
        
        this.isLoad = true;
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

    selectedPerson(index) {
        this.showLoading = true;
        this.person = 0;
        this.tables = 0;

        const data = {
            date: this.date,
            time: this.time,
            seats: this.persons[index]
        };
        this.api.getAvailableTableCount(data).subscribe(
            result => {
                this.showLoading = false;
                this.tables = result.data;
                this.person = this.persons[index];
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

    goToNext() {
        // update status
        this.api.booking.setStatus({seats : this.person});
        this.api.booking.setStatus({isWaiting : false});
        this.router.navigate(['/booking-overview']);
    }    
    goToJoin() {
        // update status
        this.showLoading = true;
        this.api.booking.setStatus({seats : this.person});
        this.api.booking.setStatus({isWaiting : true});

        const date = {
            date: this.date
        };
        let cur_shift;
        this.api.getTimeSlots(date).subscribe(
            result => {
                const shifts = result.data;
                for (let i = 0; i < shifts.length; i++) {
                    if (shifts[i].id == this.shift_id) {
                        cur_shift = shifts[i];
                        this.api.booking.setStatus({cur_shift : cur_shift});
                        break;
                    }
                }
                this.isLoad = true;
                this.showLoading = false;
                this.router.navigate(['/no-availability']);
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
