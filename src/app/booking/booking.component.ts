import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NoOfPeopleComponent } from './no-of-people/no-of-people.component';
import { SelectDateComponent } from './select-date/select-date.component';
import { SelectTimeComponent } from './select-time/select-time.component';
import { BookingOverviewComponent } from './booking-overview/booking-overview.component';
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  encapsulation : ViewEncapsulation.None,
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {

  public step;
  public isLoggedIn = false;
  constructor() {

    this.step = 1;
  }

  ngOnInit() {
  }

  goToNext() {
    this.step++;
  }
  onVotedBooking(step: number) {
    this.step = step;
  }

}
