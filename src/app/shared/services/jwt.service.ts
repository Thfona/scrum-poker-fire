import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private jwtHelperService = new JwtHelperService();

  public isTokenInvalid(token: string) {
    if (token == null || token === '') {
      return true;
    }
    return this.jwtHelperService.isTokenExpired(token);
  }

  public isTokenExpired(token: string): boolean {
    return this.jwtHelperService.isTokenExpired(token);
  }

  public getTokenExpirationDate(token: string): Date {
    return this.jwtHelperService.getTokenExpirationDate(token);
  }

  public decodeToken(token: string): any {
    return this.jwtHelperService.decodeToken(token);
  }
}
