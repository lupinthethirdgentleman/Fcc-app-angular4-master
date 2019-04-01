import { Component, OnInit } from '@angular/core';
import { API } from '../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

    public phone = '';
    public name = '';
    public email = '';
    public errors = null;
    public success = null;
    public showLoading = false;

    constructor(        
        private api: API,
        private location: Location,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.api.cu.data) {
            this.api.getUser(this.api.cu.data.id).subscribe(
                result => {
                    this.name = result.data.name;
                    this.phone = result.data.phone;
                    this.email = result.data.email;
                },
                error => {
                    // sign out
                    this.api.cu.signOut();
                    // redirect to home
                    this.router.navigate(['/']);   
                }
            );
        } else {
            // redirect to home
            this.router.navigate(['/']);   
        }
    }
    updateUser() {
        this.showLoading = true;
        this.success = null;
        this.errors = null;
        const phone = this.phone.replace(/_/gi, '');

        const data = {
            id: this.api.cu.data.id,
            name: this.name,
            email: this.email,
            phone: phone
        };

        this.api.updateUser(data).subscribe(
            result => {
                this.showLoading = false;
                this.errors = null;
                this.success = result.message;
                const data = this.api.cu.data;
                data.name = this.name;
                this.api.cu.signIn(data);
            },
            error => {
                this.showLoading = false;
                this.success = null;
                if (typeof error.data === 'object') {
                    if (error.data.phone) {
                        this.errors = error.data.phone;                        
                    } else if (error.data.name) {
                        this.errors = error.data.name;              
                    } else if (error.data.email) {
                        this.errors = error.data.email;
                    }
                } else {
                    if( error[0] == "token_expired"){
                        this.api.cu.signOut();
                        this.router.navigate(['/']);
                    }
                    this.errors = error.data;
                }
            }
        );
    }
    // go to prev step
    goBack() {
        this.location.back();
    }
}
