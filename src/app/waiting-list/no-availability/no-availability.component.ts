import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable, Subscription} from 'rxjs/Rx';
import { Location } from '@angular/common';
import { API } from '../../api.service';

@Component({
  selector: 'app-no-availability',
  templateUrl: './no-availability.component.html',
  styleUrls: ['./no-availability.component.scss'],
})
export class NoAvailabilityComponent implements OnInit {

	public date;
    public time;
    public seats;
    public countDown = 0;
    public showLoading;
    public isWaiting = false;

    // Subscription object
    private sub: Subscription;
    private shift_id;
    private note;
    private cur_shift;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: API,
        private location: Location) { }
    ngOnInit() {
        // get booking status
        const status = this.api.booking.getStatus();
        if( !status || typeof status.cur_shift === 'undefined'){
            this.router.navigate(['/error']);
            return;
        }

        this.date = status.date;
        this.time = status.time;
        this.shift_id = status.shift_id;
        this.seats = status.seats;
        this.note = status.note;
        this.isWaiting = status.isWaiting;
        this.cur_shift = status.cur_shift;

        if( !this.api.cu.isLogin() ){
            this.router.navigate(['/login'], { queryParams: { returnUrl: '/no-availability' }});
            return;
        }
    }
    // go to prev step
    goBack() {
        this.location.back();
    }
    goToJoin() {
        document.querySelector('body').classList.add('patern-big');
        this.showLoading = true;

        const data = {
            date: this.date,
            time: this.time,
            hours: this.cur_shift.shift_atb,
            number_of_people: this.seats,
            guest_id: this.api.cu.data.id,
            status: "Booked",
            shift_package_id: this.cur_shift.shift_package_id,
            shift_id: this.cur_shift.id,
            floor_package_id: this.cur_shift.floor_package_id,
            notes_by_guest:this.note,
        };

        this.api.createBooking(data).subscribe(
            result => {
                this.showLoading = false;
                this.router.navigate(['/confirm'], {queryParams: { isWaiting: true }});
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
}
