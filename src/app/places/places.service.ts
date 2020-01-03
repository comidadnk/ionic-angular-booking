import { Injectable } from '@angular/core';
import { Place } from './place.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Bangalore',
      'IT Hub',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
      123,
      new Date('2019-01-01'), new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Delhi',
      'India Capital',
      // tslint:disable-next-line: max-line-length
      'https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg',
      128,
      new Date('2019-01-01'), new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p3',
      'Mumbai',
      'India Financial Capital',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/ab5c55eb6f981026230a95dfb052a51d-taj-mahal-palace-mumbai.jpg',
      128,
      new Date('2019-01-01'), new Date('2019-12-31'),
      'abc'
    )
  ]);

  get Places() {
    return this._places.asObservable();
  }
  getPlace(id: string) {
    return this.Places.pipe(take(1), map(places => {
      const place = places.find(p => {
        return p.id === id;
      });
      return {...place};
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://image.shutterstock.com/image-photo/plitvice-lakes-croatia-beautiful-place-260nw-1050138794.jpg',
      price,
      dateFrom,
      dateTo,
      this.authService.UserId
    );
    this.Places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace));
    });
  }
  constructor(private authService: AuthService) {}
}
