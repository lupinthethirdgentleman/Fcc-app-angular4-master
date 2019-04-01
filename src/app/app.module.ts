import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { DpDatePickerModule } from 'ng2-date-picker';
import { DatePipe } from '@angular/common';

import { RestResourceModule } from 'angular2-rest-resource';
import { InternationalPhoneModule } from 'ng4-intl-phone';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { BookingComponent } from './booking/booking.component';
import { NoOfPeopleComponent } from './booking/no-of-people/no-of-people.component';
import { SelectDateComponent } from './booking/select-date/select-date.component';
import { SelectTimeComponent } from './booking/select-time/select-time.component';
import { BookingOverviewComponent } from './booking/booking-overview/booking-overview.component';
import { BookingPaymentComponent } from './booking/booking-payment/booking-payment.component';
import { UserComponent } from './user/user.component';
import { AccountComponent } from './user/account/account.component';
import { LanguageComponent } from './user/language/language.component';

import { TRANSLATION_PROVIDERS, TranslatePipe, TranslateService } from './translate';
import { API, AuthGuard } from './api.service';
import { FormatTimer, FormatTimerHHMM } from './app.pipe';

import { appRouting } from './app.routing';
import { ModalsComponent } from './modals/modals.component';
import { BookingConfirmComponent } from './modals/booking-confirm/booking-confirm.component';
import { TimeUpComponent } from './modals/time-up/time-up.component';
import { ErrorComponent } from './modals/error/error.component';
import { WaitingListComponent } from './waiting-list/waiting-list.component';
import { NoAvailabilityComponent } from './waiting-list/no-availability/no-availability.component';
import { JoinWaitingListComponent } from './waiting-list/join-waiting-list/join-waiting-list.component';
import { MenuComponent } from './user/menu/menu.component';
import { MyBookingsComponent } from './user/my-bookings/my-bookings.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    BookingComponent,
    NoOfPeopleComponent,
    SelectDateComponent,
    SelectTimeComponent,
    BookingOverviewComponent,
    BookingPaymentComponent,
    UserComponent,
    AccountComponent,
    LanguageComponent,
    TranslatePipe,
    FormatTimer,
    FormatTimerHHMM,
    ModalsComponent,
    BookingConfirmComponent,
    TimeUpComponent,
    ErrorComponent,
    WaitingListComponent,
    NoAvailabilityComponent,
    JoinWaitingListComponent,
    MenuComponent,
    MyBookingsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    appRouting,
    DpDatePickerModule,
    RestResourceModule,
    InternationalPhoneModule
  ],
  providers: [DatePipe, TRANSLATION_PROVIDERS, TranslateService, API, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
