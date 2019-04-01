import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import {Observable, Subscription} from 'rxjs/Rx';
import { API } from '../../api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../user/menu/menu.component.scss', './register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {

    public isWechat = false;
    public isPhone = false;
    public isPhoneConfirmation = false;
    public phone = '';
    public name = '';
    public email = '';
    public code;
    public countDown = 60;
    public countDownForSms = 60;
    public smsCodeExpired = true;
    public errors = null;
    private sub: Subscription;
    private subSms: Subscription;
    public returnUrl = null;
    public retUrl = null;
    public showLoading = false;

    constructor(
        private route: ActivatedRoute,
        private api: API,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        this.route
        .queryParams
        .subscribe(params => {
            this.returnUrl = params['returnUrl'];
            this.retUrl = params['retUrl'];
            // && this.retUrl !== '/login'
            if (this.api.cu.isLogin() ) {
                this.location.back();
            }
        });

        // Booking Timer set
        this.countDown = this.api.booking.countDown;
        if (this.countDown) {
            this.sub = Observable.timer(this.countDown, 1000).subscribe(t => {
                if (this.countDown > 0) {
                    this.countDown--;
                } else {
                    this.router.navigate(['/time-up']);
                }
            });
        }
    }

    ngOnDestroy() {
        // unsubscribe here
        if (this.sub) {
            this.sub.unsubscribe();         
            this.api.booking.setCountDown(this.countDown);
        }

        if (this.subSms) {
            this.subSms.unsubscribe();
        }
    }

    goBack() {
        this.location.back();
    }

    goLogin() {
        if (this.retUrl === '/login') {
            this.goBack();
        } else {
            this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl, retUrl: '/signup' }});
        }
    }

    goToWechat() {
        this.isWechat = true;
        this.phone = '+86';
        this.name = '';
        this.email ='';
        this.errors = null;
    }

    goToPhoneRegister() {
        this.isPhone = true;
        this.phone = '+86';
        this.name = '';
        this.email ='';
        this.errors = null;
    }

    sendSMSCode() {
        const phone = this.phone.replace(/_/gi, '');
        this.errors = null;
        const data = {
            phone: phone
        };
        this.smsCodeExpired = false;
        // Sms Timer set
        if (this.subSms) {
            this.subSms.unsubscribe();
        }

        this.subSms = Observable.timer(60, 1000).subscribe(t => {
            if (this.countDownForSms > 0) {
                this.countDownForSms--;
            } else {
                this.subSms.unsubscribe();
                this.countDownForSms = 60;
                this.smsCodeExpired = true;
            }
        });
        this.api.sendSMSCode(data).subscribe(
            result => {
                this.errors = null;
            },
            error => {
                if (typeof error.data === 'object') {
                    this.errors = error.data.phone;
                } else {
                    this.errors = error.data;
                }

                this.countDownForSms = 60;
                this.subSms.unsubscribe();
                this.smsCodeExpired = true;
            }
        );
    }
    
    signup() {
        this.showLoading = true;
        const phone = this.phone.replace(/_/gi, '');
        
        const data = {
            name: this.name,
            code: this.code,
            email: this.email,
            phone: phone
        };
        this.errors = null;
        this.api.signup(data).subscribe(
            result => {
                this.showLoading = false;
                this.errors = null;
                this.api.cu.signIn(result.data);
                // redirection
                if (this.returnUrl) {
                    this.router.navigate([this.returnUrl]);            
                } else {
                    this.router.navigate(['/']);                    
                }
            },
            error => {
                this.showLoading = false;
                if (typeof error.data === 'object') {
                    for (let item in error.data) {
                        this.errors = error.data[item];
                    }
                } else {
                    this.errors = error.data;
                }
                this.countDownForSms = 60;
                if (this.subSms) {
                    this.subSms.unsubscribe();                    
                }
                this.smsCodeExpired = true;
            }
        );
    }

}
