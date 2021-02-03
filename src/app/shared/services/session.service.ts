import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { LocalStorageService } from './local-storage.service';
import { SessionStorageService } from './session-storage.service';
import { endpoints } from '../constants/endpoints.constant';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _accessToken: string;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtService: JwtService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
  ) {}

  // Access Token
  public get accessToken(): string {
    return this._accessToken;
  }

  public set accessToken(value: string) {
    this._accessToken = value;
  }

  // Persist Session
  public get persistSession(): boolean {
    return this.localStorageService.getJson('persistSession');
  }

  public set persistSession(value: boolean) {
    this.localStorageService.setJson('persistSession', value);
  }

  // Access Token methods
  public isAccessTokenInvalid(): boolean {
    return this.jwtService.isTokenInvalid(this.accessToken);
  }

  public isAccessTokenExpired(): boolean {
    return this.jwtService.isTokenExpired(this.accessToken);
  }

  public getAccessTokenExpirationDate(): Date {
    return this.jwtService.getTokenExpirationDate(this.accessToken);
  }

  public decodeAccessToken(): any {
    return this.jwtService.decodeToken(this.accessToken);
  }

  public removeAccessToken() {
    this.accessToken = '';
  }

  public refreshAccessToken(): Observable<string> {
    if (this.isAccessTokenExpired()) {
      const url = endpoints.refreshAccessToken.url;

      const options = {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      };

      return this.httpClient.post<any>(url, null, options).pipe(
        share(),
        map((response) => {
          const accessToken = response.accessToken;

          this.accessToken = accessToken;

          return accessToken;
        })
      );
    }

    return of(this.accessToken);
  }

  // Other methods
  public logout() {
    const url = endpoints.logout.url;

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8'
      }
    };

    this.httpClient.post<any>(url, null, options);

    this.redirect();
    this.sessionStorageService.clear();
    this.localStorageService.clear();
    this.removeAccessToken();
  }

  private redirect() {
    this.router.navigate(['']);
  }
}
