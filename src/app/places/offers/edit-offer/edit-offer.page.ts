import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss']
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  private placeSub: Subscription;
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.isLoading = true;
      const placeId = paramMap.get('placeId');
      this.placeId = placeId;
      this.placeSub = this.placesService.getPlace(placeId).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          description: new FormControl(this.place.description, {
            updateOn: 'blur',
            validators: [Validators.maxLength(180)]
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          message: 'Place could not be fetched. Please try again later.',
          buttons: [{ text: 'Okay', handler: () => {
            this.navCtrl.navigateBack('/places/tabs/offers');
          }}]
        }).then(alertEl => {
          alertEl.present();
        });
      });
    });
  }

  onUpdateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Offer ...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.updatePlace(
        this.place.id,
        this.form.value.title,
        this.form.value.description
      ).subscribe(() => {
        loadingEl.dismiss();
        this.navCtrl.navigateBack('/places/tabs/offers');
      });
    });
  }

  ngOnDestroy() {
    this.placeSub.unsubscribe();
  }
}
