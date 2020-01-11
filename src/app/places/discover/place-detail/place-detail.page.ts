import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss']
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingsService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      const placeId = paramMap.get('placeId');
      this.loadingCtrl.create({
        message: 'Loading ...',
        mode: 'ios'
      }).then(loadingEl => {
        loadingEl.present();
        this.placeSub = this.placesService.getPlace(placeId).subscribe(place => {
          this.place = place;
          loadingEl.dismiss();
          this.isLoading = false;
          this.isBookable = place.userId !== this.authService.UserId;
        }, error => {
          loadingEl.dismiss();
          this.alertCtrl.create({
            message: 'Place could not be fetched. Please try again later.',
            buttons: [{ text: 'Okay', handler: () => {
              this.navCtrl.navigateBack('/places/tabs/discover');
            }}],
            mode: 'ios'
          }).then(alertEl => {
            alertEl.present();
          });
        });
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
      if (resultData.role === 'confirm') {
        this.loadingCtrl.create({
          message: 'Booking Place ...'
        }).then(loadingEl => {
          loadingEl.present();
          const data = resultData.data.bookingData;
          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            data.firstName,
            data.lastName,
            data.guestNumber,
            data.dateFrom,
            data.dateTo
          ).subscribe(() => {
            loadingEl.dismiss();
          });
        });
      }
    });
  }

  onShowFullMap() {
    this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        center: {lat: this.place.location.lat, lng: this.place.location.lng},
        selectable: false,
        closeButtonText: 'Close',
        title: this.place.location.address
      }
    }).then(modalEl => {
      modalEl.present();
    });
  }
  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }
}
