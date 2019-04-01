import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { SelectDateComponent } from './booking/select-date/select-date.component';
import { SelectTimeComponent } from './booking/select-time/select-time.component';
import { NoOfPeopleComponent } from './booking/no-of-people/no-of-people.component';
import { BookingOverviewComponent } from './booking/booking-overview/booking-overview.component';
import { BookingPaymentComponent } from './booking/booking-payment/booking-payment.component';
import { BookingComponent } from './booking/booking.component';
import { UserComponent } from './user/user.component';
import { AccountComponent } from './user/account/account.component';
import { LanguageComponent } from './user/language/language.component';
import { BookingConfirmComponent } from './modals/booking-confirm/booking-confirm.component';
import { TimeUpComponent } from './modals/time-up/time-up.component';
import { ErrorComponent } from './modals/error/error.component';
import { NoAvailabilityComponent } from './waiting-list/no-availability/no-availability.component';
import { JoinWaitingListComponent } from './waiting-list/join-waiting-list/join-waiting-list.component';
import { MenuComponent } from './user/menu/menu.component';
import { MyBookingsComponent } from './user/my-bookings/my-bookings.component';
import { AuthGuard } from './api.service';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: RegisterComponent },
  { path: 'account', component: AccountComponent },
  { path: 'select-date', component: SelectDateComponent },
  { path: 'select-time', component: SelectTimeComponent },
  { path: 'booking-person', component: NoOfPeopleComponent },
  { path: 'booking-payment', component: BookingPaymentComponent },
  { path: 'booking-overview', component: BookingOverviewComponent, canActivate: [AuthGuard] },
  { path: 'confirm', component: BookingConfirmComponent },
  { path: 'time-up', component: TimeUpComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'no-availability', component: NoAvailabilityComponent, canActivate: [AuthGuard] },
  { path: 'join', component: JoinWaitingListComponent },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard]},
  { path: 'language', component: LanguageComponent },
  { path: 'my-bookings', component: MyBookingsComponent }
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
