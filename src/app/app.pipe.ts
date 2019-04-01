import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from './translate';
import * as moment from 'moment';

@Pipe({name: 'formatTimer'})

export class FormatTimer implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(input: number): any {
        function z(n) { return (n < 10 ? '0' : '') + n; }
        const seconds = input % 60;
        const minutes = Math.floor(input / 60);

        if ( input === 0 ) {
            return ' ';
        }

        return (minutes + this._translate.instant('MINUTE_UNIT') + ' '
        + z(seconds) + this._translate.instant('SECOND_UNIT'));
    }
}

@Pipe({name: 'formatTimerHHMM'})

export class FormatTimerHHMM implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(input: string): any {
        return moment(input, "HH:mm").format('hh:mm A');
    }
}

