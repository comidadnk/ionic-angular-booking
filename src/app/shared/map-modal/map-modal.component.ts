import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit {

  @ViewChild('map', { static: false }) mapElement: ElementRef;
  constructor(private modalCtrl: ModalController, private render: Renderer2) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getGoogleMap().then(
      googleMaps => {
        const mapEl = this.mapElement.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: { lat: 28.704060, lng: 77.102493},
          zoom: 16,
          MapTypeId: 'satellite'
        });
        googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.render.addClass(mapEl, 'visible');
        });
        map.addListener('click', (event: { latLng: { lat: () => any; lng: () => any; }; }) => {
          const selectedCroc = { lat: event.latLng.lat(), lng: event.latLng.lng()};
          this.modalCtrl.dismiss(selectedCroc);
        });
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
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAIj1PiK819x1GN_CjGQfF-g4VfdSsowDc";
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
}
