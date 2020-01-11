import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import { ModalController, IonMenuToggle } from '@ionic/angular';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  clickListener: any;
  googleMaps: any;
  @Input() center = { lat: 28.704060, lng: 77.102493};
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  constructor(private modalCtrl: ModalController, private render: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMap().then(
      googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElement.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16
        });
        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.render.addClass(mapEl, 'visible');
        });
        if (this.selectable) {
          this.clickListener = map.addListener('click', (event: { latLng: { lat: () => any; lng: () => any; }; }) => {
            const selectedCroc = { lat: event.latLng.lat(), lng: event.latLng.lng()};
            this.modalCtrl.dismiss(selectedCroc);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map,
            title: 'Picked Location'
          });
          marker.setMap(map);
        }
      }
    ).catch(err => {
      console.log(err);
    });
  }
  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getGoogleMap(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = "https://maps.googleapis.com/maps/api/js?key=" + environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google Maps SDK not available');
        }
      };
    });
  }
  ngOnDestroy() {
    if (this.selectable) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }
}
