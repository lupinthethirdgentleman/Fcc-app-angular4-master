import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { API } from '../../api.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {

  constructor( private api: API) { }

    ngOnInit() {
        if (this.api.booking.countDown)
            this.api.booking.setCountDown(0);
    }

}
