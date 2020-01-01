import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  // tslint:disable-next-line: variable-name
  private _places: Place[] = [
    new Place(
      'p1',
      'Bangalore',
      'IT Hub',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
      123
    ),
    new Place(
      'p2',
      'Delhi',
      'India Capital',
      // tslint:disable-next-line: max-line-length
      'https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg',
      128
    ),
    new Place(
      'p3',
      'Mumbai',
      'India Financial Capital',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/ab5c55eb6f981026230a95dfb052a51d-taj-mahal-palace-mumbai.jpg',
      128
    )
  ];

  get Places() {
    return [...this._places];
  }
  getPlace(id: string) {
    const place = this._places.find(p => {
      return p.id === id;
    });
    return {...place};
  }
  constructor() {}
}
