import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

interface BookingData {
    placeId: string;
    userId: string;
    placeTitle: string;
    placeImage: string;
    firstName: string;
    lastName: string;
    guestNumber: number;
    bookedFrom: Date;
    bookedTo: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  // tslint:disable-next-line: variable-name
  private _bookings = new BehaviorSubject<Booking[]>([]);
  constructor( private authService: AuthService, private http: HttpClient) { }
  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImage: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.UserId,
      placeTitle,
      placeImage,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );
    let generatedId: string;
    return this.http.post<{name: string}>(`https://ionic-angular-booking-582ce.firebaseio.com/bookings.json`,
      { ...newBooking, id: null })
      .pipe(
        switchMap(resData => {
        generatedId = resData.name;
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        newBooking.id = generatedId;
        this._bookings.next(bookings.concat(newBooking));
      })
    );
  }

  fetchBookings() {
    return this.http
      .get<{ [key: string]: BookingData }>(
        `https://ionic-angular-booking-582ce.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${this.authService.UserId}"`
      )
      .pipe(
        map(resData => {
          const bookings = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              bookings.push(
                new Booking(
                  key,
                  resData[key].placeId,
                  resData[key].userId,
                  resData[key].placeTitle,
                  resData[key].placeImage,
                  resData[key].firstName,
                  resData[key].lastName,
                  resData[key].guestNumber,
                  new Date(resData[key].bookedFrom),
                  new Date(resData[key].bookedTo)
                )
              );
            }
          }
          return bookings;
        }),
        tap(bookings => {
          this._bookings.next(bookings);
        })
      );
  }

  cancelBooking(bookingId: string) {

   return this.http.delete(`https://ionic-angular-booking-582ce.firebaseio.com/bookings/${bookingId}.json`)
    .pipe(
      switchMap(() => {
        return this.bookings;
      }),
      take(1),
      tap(bookings => {
        this._bookings.next(bookings.filter( b => b.id !== bookingId));
      })
    );
  }
}
