import { Injectable } from "@angular/core";
import { Place } from "./place.model";
import { AuthService } from "../auth/auth.service";
import { BehaviorSubject, of } from "rxjs";
import { take, filter, map, tap, delay, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: "root"
})
export class PlacesService {
  constructor(private authService: AuthService, private http: HttpClient) {}
  // tslint:disable-next-line: variable-name
  private _places = new BehaviorSubject<Place[]>([]);
  /*new Place(
      'p1',
      'Bangalore',
      'IT Hub',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/9483508eeee2b78a7356a15ed9c337a1-bengaluru-bangalore.jpg?fit=crop&q=40&sharp=10&vib=20&auto=format&ixlib=react-8.6.4',
      123,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
    new Place(
      'p2',
      'Delhi',
      'India Capital',
      // tslint:disable-next-line: max-line-length
      'https://cdn.britannica.com/37/189837-050-F0AF383E/New-Delhi-India-War-Memorial-arch-Sir.jpg',
      128,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'xyz'
    ),
    new Place(
      'p3',
      'Mumbai',
      'India Financial Capital',
      // tslint:disable-next-line: max-line-length
      'https://lp-cms-production.imgix.net/2019-06/ab5c55eb6f981026230a95dfb052a51d-taj-mahal-palace-mumbai.jpg',
      128,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    )
  ]);*/

  fetchPlaces() {
    return this.http
      .get<{ [key: string]: PlaceData }>(
        "https://ionic-angular-booking-582ce.firebaseio.com/offered-places.json"
      )
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(
                new Place(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].price,
                  new Date(resData[key].availableFrom),
                  new Date(resData[key].availableTo),
                  resData[key].userId
                )
              );
            }
          }
          return places;
        }),
        tap(places => {
          this._places.next(places);
        })
      );
  }

  get Places() {
    return this._places.asObservable();
  }
  getPlace(placeId: string) {

    return this.http
      .get<Place>(
        `https://ionic-angular-booking-582ce.firebaseio.com/offered-places/${placeId}.json`
      )
      .pipe(
        map(resData => {
          return new Place(
            placeId,
            resData.title,
            resData.description,
            resData.imageUrl,
            resData.price,
            new Date(resData.availableFrom),
            new Date(resData.availableTo),
            resData.userId
          );
        })
      );

    /*return this.Places.pipe(
      take(1),
      map(places => {
        const place = places.find(p => {
          return p.id === placeId;
        });
        return { ...place };
      })
    );*/
  }

  addPlace(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    let generatedId: string;
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      "https://image.shutterstock.com/image-photo/plitvice-lakes-croatia-beautiful-place-260nw-1050138794.jpg",
      price,
      dateFrom,
      dateTo,
      this.authService.UserId
    );

    return this.http
      .post<{ name: string }>(
        "https://ionic-angular-booking-582ce.firebaseio.com/offered-places.json",
        { ...newPlace, id: null }
      )
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.Places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace));
        })
      );
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.Places.pipe(
      take(1),
      switchMap(places => {
          if (!places || places.length <= 0) {
            return this.fetchPlaces();
          } else {
            return of(places);
          }
        }),
        switchMap(places => {
          const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
          updatedPlaces = [...places];
          const oldPlace = updatedPlaces[updatedPlaceIndex];
          updatedPlaces[updatedPlaceIndex] = new Place(
            oldPlace.id,
            title,
            description,
            oldPlace.imageUrl,
            oldPlace.price,
            oldPlace.availableFrom,
            oldPlace.availableTo,
            oldPlace.userId
          );
          return this.http.put(
            `https://ionic-angular-booking-582ce.firebaseio.com/offered-places/${placeId}.json`,
            { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
      }),
      tap(resData => {
        this._places.next(updatedPlaces);
      })
    );
  }
}
