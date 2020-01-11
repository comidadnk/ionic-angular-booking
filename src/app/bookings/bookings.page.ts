import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Booking[];
  private bookingsSub: Subscription;
  constructor(private bookingsService: BookingsService, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.bookingsSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }
  ionViewWillEnter() {
    if (this.loadedBookings.length > 0) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Fetching ...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.fetchBookings().subscribe(respData => {
        loadingEl.dismiss();
      });
    });
  }
  onCancel(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({
      message: 'Cancelling booking ...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingsService.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnDestroy() {
    this.bookingsSub.unsubscribe();
  }
}
