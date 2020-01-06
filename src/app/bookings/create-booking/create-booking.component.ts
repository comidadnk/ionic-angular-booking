import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: string;
  @ViewChild('f', {static: false}) form: NgForm;
  startDate: string;
  endDate: string;
  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    const availablefrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availablefrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availablefrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
        Math.random() *
          (new Date(this.startDate).getTime() +
            6 * 24 * 60 * 60 * 1000 -
            new Date(this.startDate).getTime())).toISOString();
    }
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }
  onBookPlace() {
    if (!this.form.valid || !this.datesValid()) {
      return;
    }
    this.modalCtrl.dismiss({ bookingData: {
      firstName: this.form.form.controls.firstName.value,
      lastName: this.form.form.controls.lastName.value,
      guestNumber: +this.form.form.controls.guestNumber.value,
      dateFrom: new Date(this.form.form.controls.dateFrom.value),
      dateTo: new Date(this.form.form.controls.dateTo.value)
    } }, 'confirm');
  }
  datesValid() {
    const startDate = this.form.form.controls.dateFrom.value;
    const endDate = this.form.form.controls.dateTo.value;
    return endDate > startDate;
  }
}
