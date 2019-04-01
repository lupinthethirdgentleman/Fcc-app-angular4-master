import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { API } from '../../api.service';

@Component({
  selector: 'app-booking-confirm',
  templateUrl: './booking-confirm.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./booking-confirm.component.scss'],
})
export class BookingConfirmComponent implements OnInit {

    isWaiting: any;
    public date;
    public time;
    public seats;
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private api: API) { }

    ngOnInit() {
        this.route
        .queryParams
        .subscribe(params => {
            this.isWaiting = (params['isWaiting'] === 'true') || 0;
        });
        document.querySelector('body').classList.add('patern-big');

        // get booking status
        const status = this.api.booking.getStatus();
        if( !status ){
            this.router.navigate(['/error']);
            return;
        }
        this.date = status.date;
        this.time = status.time;
        this.seats = status.seats;
        this.api.booking.clearStatus();
    }
}
