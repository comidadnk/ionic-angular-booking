import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.placeSub = this.placesService.getPlace(placeId).subscribe(place => {
        this.place = place;
      });
    });
  }
  onBookPlace() {
    // this.navCtrl.navigateBack("/places/tabs/discover");
    this.actionSheetCtrl.create({
      header: 'Choose an Action',
      mode: 'ios',
      buttons: [{
        text: 'Select Date',
        handler: () => {
          this.onBookingModal('select');
        }
      },
      {
        text: 'Random Date',
        handler: () => {
          this.onBookingModal('random');
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    });
  }

  onBookingModal(mode: 'select' | 'random') {
    console.log(mode);
    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(resultData => {
      console.log(resultData);
    });
  }

  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }
}
