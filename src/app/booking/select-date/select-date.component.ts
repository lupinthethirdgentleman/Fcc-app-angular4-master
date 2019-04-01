import { Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild } from '@angular/core';
import {DatePickerComponent} from 'ng2-date-picker';
import * as moment from 'moment';
import {Observable, Subscription} from 'rxjs/Rx';
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { API } from '../../api.service';

@Component({
selector: 'app-select-date',
templateUrl: './select-date.component.html',
encapsulation : ViewEncapsulation.None,
styleUrls: ['../booking.component.scss', './select-date.component.scss'],
})

export class SelectDateComponent implements OnInit, OnDestroy {

    public config;
    public selectedDate = null;
    public dates;
    public countDown = 0;
    public isLoad = false;
    public currentDate = null;
    public isCurHoliday = false;
    // Subscription object
    private sub: Subscription;

    constructor(
        private router: Router,
        private datepipe: DatePipe,
        private api: API) {
        this.config = {
        monthFormat: 'MMMM YYYY',
        weekDayFormat: 'dd',
        showNearMonthDays: false,
        enableMonthSelector: false,
        dayBtnFormat: 'D',
        isDayDisabledCallback: function(e) {
                return api.isHoliday(e);
            }
        };
    }

    // public function
    ngOnInit() {
        this._init();
    }

    ngOnDestroy() {
        // unsubscribe here
        if (this.sub) {
            this.sub.unsubscribe();         
            this.api.booking.setCountDown(this.countDown);
        }
    }

    goBack() {
        this.api.booking.setCountDown(0);    
        this.router.navigate(['/']);        
    }

    goToNext() {
        const formattedDate = this.datepipe.transform(this.selectedDate, 'yyyy-MM-dd');
        // update status
        this.api.booking.setStatus({date:formattedDate});
        this.router.navigate(['/select-time']);
    }

    // private function
    private _init() {

        // get settings from server
        this.api.getSettings().subscribe(
            result => {
                // rules set
                this.api.booking.setRules(result.data.rules);
                this.api.booking.setGeneral(result.data.general);
                this.api.booking.setCountDown( this.api.booking.general.BookingAppTimer * 60 );
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
                // get booking status
                const data = this.api.booking.getStatus();
                if (data && data.date) {
                    this.selectedDate = moment(data.date);                    
                } else {
                    this.selectedDate = moment(new Date());
                }

                this.currentDate = this.selectedDate;

                if (this.api.isHoliday(this.selectedDate)) {

                    const endDay = this.selectedDate.daysInMonth();
                    const currentDay = this.selectedDate.date();

                    for (var i = 1; i <= endDay - currentDay; i++) {
                        const theDate = moment(this.selectedDate, "DD-MM-YYYY").add('days', i);
                        if (!this.api.isHoliday(theDate)) {
                            this.selectedDate = theDate;
                            break;
                        }
                    }

                    if (this.api.isHoliday(this.selectedDate)) {
                        this.isCurHoliday = true;
                    }
                }
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
}
