import { Injectable } from '@angular/core';
import { Booking } from './booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  // tslint:disable-next-line: variable-name
  private _bookings: Booking[] = [
    {
      id: 'b1',
      placeId: 'p1',
      placeTitle: 'Bangalore',
      guestNumber: 2,
      userId: 'abc'
    }
  ];
  constructor() { }
  get bookings() {
    return [...this._bookings];
  }
}
