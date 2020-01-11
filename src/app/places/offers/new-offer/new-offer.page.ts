import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;
  constructor(private placesService: PlacesService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
      description: new FormControl(null, {updateOn: 'blur', validators: [Validators.maxLength(180)]}),
      price: new FormControl(null, {updateOn: 'blur', validators: [Validators.min(1)]}),
      dateFrom: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
      dateTo: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]}),
      location: new FormControl(null, {updateOn: 'blur', validators: [Validators.required]})
    });
  }

  onLocationPicked(location: PlaceLocation) {
    this.form.patchValue({location});
  }

  onImagePicked(imageData: any) {
    console.log(imageData);
  }

  onCreateOffer() {
    if (!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Creating Place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesService.addPlace(
        this.form.value.title,
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.location
        ).subscribe(() => {
          this.form.reset();
          this.navCtrl.navigateBack('/places/tabs/offers');
          loadingEl.dismiss();
        });
    });
  }
}
