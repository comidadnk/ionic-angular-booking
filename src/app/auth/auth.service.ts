import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // tslint:disable-next-line: variable-name
  private _userIsAuthenticated = true;
  private _userId = 'abc';
  constructor() { }

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }
  login() {
    this._userIsAuthenticated = true;
  }
  logout() {
    this._userIsAuthenticated = false;
  }

  get UserId() {
    return this._userId;
  }
}
