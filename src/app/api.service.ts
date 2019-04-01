
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Resource } from 'angular2-rest-resource';
import * as moment from 'moment';

// API Endpoint
@Injectable()
export class API extends Resource {
    //  create, get, update, and delete functions are automatically available after setting url
    // baseUrl = 'http://localhost:8000/api';
    baseUrl = 'http://fcc-api.wodebox.com/api';

    // booking status
    booking = {
        countDown: JSON.parse(localStorage.getItem('timer-count')),
        setCountDown: (count:any) => {
            this.booking.countDown = count;
            localStorage.setItem('timer-count', JSON.stringify(count));            
        },
        rules: JSON.parse(localStorage.getItem('booking-rules')),
        setRules: (rules: any) => {
            this.booking.rules = rules;
            localStorage.setItem('booking-rules', JSON.stringify(rules));    
        },
        general: JSON.parse(localStorage.getItem('booking-general')),
        setGeneral: (general: any) => {
            this.booking.general = general;
            localStorage.setItem('booking-general', JSON.stringify(general));    
        },
        status: JSON.parse(localStorage.getItem('booking-status')),
        setStatus: (data:any) => {

            let status = this.booking.status === null ? new Object() : this.booking.status;
            for (let item in data) {
                status[item] = data[item];
            }
            this.booking.status = status;     
            localStorage.setItem('booking-status', JSON.stringify(status));            
        },
        getStatus: () => {
            // console.log(this.booking.status);
            return this.booking.status;
        },
        clearStatus: () => {
            localStorage.removeItem('booking-status');            
            this.booking.status = null;
        }
    }

    // current user api
    cu = {
        data: JSON.parse(localStorage.getItem('current-user')),
        signIn:(data:any)=>{
            this.cu.data = data;
            localStorage.setItem('current-user', JSON.stringify(data));
        },
        signOut:()=>{
            localStorage.removeItem('current-user');     
            this.cu.data = null;
        },
        isLogin:()=>{
            if (this.cu.data) {
                return true;
            } else {
                return false;
            }
        }
    };

    // language
    lang = {
        data:JSON.parse(localStorage.getItem('current-lang')),
        setLang:(data: any) => {
            this.lang.data = data;
            localStorage.setItem('current-lang', JSON.stringify(data));
        },
        getLang:() => {
            return this.lang.data ? this.lang.data : 'en';
        }
    }

    // for app
    public getTimeSlots(data: any): Observable<any> {
        data.lang =  this.lang.getLang();
        return this.request('GET', this.baseUrl + '/app/timeslots', data);
    }

    public sendSMSCode(data: any): Observable<any> {
        data.lang =  this.lang.getLang();        
        return this.request('POST', this.baseUrl + '/app/sms', null, data, {'Content-Type':'application/json'});
    }

    public getSettings(): Observable<any> {
        const data = {
            lang : this.lang.getLang()
        }       
        return this.request('GET', this.baseUrl + '/app/settings', data);
    }

    public getAvailableTableCount(data: any): Observable<any> {
        data.lang =  this.lang.getLang();   
        return this.request('GET', this.baseUrl + '/app/tables', data);
    }

    public signup(data: any): Observable<any> {
        data.lang =  this.lang.getLang();   
        return this.request('POST', this.baseUrl + '/app/guests', null, data, {'Content-Type':'application/json'});
    }

    public login(data: any): Observable<any> {
        data.lang =  this.lang.getLang();   
        return this.request('POST', this.baseUrl + '/app/login', null, data, {'Content-Type':'application/json'});
    }

    public getUser(id: number): Observable<any> {
        const data = {
            lang : this.lang.getLang()
        }
        return this.request('GET', this.baseUrl + '/app/guests/:id', {id: id, token: this.cu.data.token}, data); 
    }

    public updateUser(data: any): Observable<any> {
        data.token = this.cu.data.token;
        data.lang =  this.lang.getLang();   
        const id = data.id;
        return this.request('PUT', this.baseUrl + '/app/guests/:id', {id: id}, data, {'Content-Type':'application/json'}); 
    }

    public createBooking(data: any): Observable<any> {
        data.token = this.cu.data.token;
        data.lang =  this.lang.getLang();   
        return this.request('POST', this.baseUrl + '/app/bookings', null, data, {'Content-Type':'application/json'}); 
    }

    public getBooking(data: any): Observable<any> {
        data.token = this.cu.data.token;
        data.lang =  this.lang.getLang();   
        return this.request('GET', this.baseUrl + '/app/bookings/:id', data); 
    }
    // Check Holidays
    public isHoliday(date: any) {        
        let today = moment(new Date());
        
        //set default time
        today.set('hour', 0);
        today.set('minute',0);
        today.set('second',0);

        let validday = parseInt(this.booking.general.EarliestBookingAllowedinAdvance);
        let diff = date.diff(today, 'day');        
        if( diff >= validday || diff < 0 ) 
            return true;

        const formattedDate = date.format('YYYY-MM-DD');
        for (let i = 0; i < this.booking.rules.length; i++) {
            const rule = this.booking.rules[i];
            if (rule.repeat_end === null || rule.repeat_end > formattedDate) {
                if ((rule.repeat === 'none' && rule.start === formattedDate) ||
                    (rule.repeat === 'everyDay') ||
                    (rule.repeat === 'everyWeek' && moment(rule.start).day() === date.day()) ||
                    (rule.repeat === 'everyMonth' && moment(rule.start).date() === date.date()) ||
                    (rule.repeat === 'everyYear' && moment(rule.start).month() === date.month()
                    && moment(rule.start).date() === date.date())) {
                        if (rule.shift_package_id === null) {
                            return true;
                        } else {
                            return false;
                        }
                }
            }
        }
        return false;
    }

    public checkToken(): Observable<any> {
        const data = {
            "token" : this.cu.data.token
        }
        return this.request('GET', this.baseUrl + '/app/token', data); 
    }}

// Auth Guard for login
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private api: API
    ) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.api.cu.isLogin()) {
            return this.api.checkToken( )
                .map((res: Response) => { return true; })
                .catch((error: any) => { return this.handleErrors(error) });
        }

        // not logged in so redirect to login page with the return url and return false
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
    private handleErrors( error: Response )
    {
        if( error[0] == "token_expired"){
            this.api.cu.signOut();
            this.router.navigate(['/login']);
        }
        else
            this.router.navigate(['/error']);

        return Observable.throw(error);
    }
}
