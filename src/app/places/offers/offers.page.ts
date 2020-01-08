import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';
import { IonItemSliding, NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  constructor(private placesService: PlacesService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.placesSub = this.placesService.Places.subscribe(places => {
      this.offers = places;
    });
  }

  ionViewWillEnter() {
    if (this.offers.length > 0) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Fetching ...',
      mode: 'ios'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.fetchPlaces().subscribe(respData => {
        loadingEl.dismiss();
      });
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.navCtrl.navigateForward('/places/tabs/offers/edit/' + offerId);
  }
  ngOnDestroy() {
    this.placesSub.unsubscribe();
  }
}
