import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss']
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;
  constructor(
    private authService: AuthService,
    private router: Router,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  onLogin() {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Logging in..',
        mode: 'ios'
      })
      .then(loadingEl => {
        loadingEl.present();
        setTimeout(() => {
          this.navCtrl.navigateForward('/places/tabs/discover');
          this.isLoading = false;
          loadingEl.dismiss();
        }, 1000);
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    if (this.isLogin) {
      // send request to login server
      this.onLogin();
    } else {
      // send request to signup server
    }
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
