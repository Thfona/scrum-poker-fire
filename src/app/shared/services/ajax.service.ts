import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})
export class AjaxService {
  constructor(private httpClient: HttpClient, private sessionService: SessionService) {}

  public async get<T>(url: string, params: { [param: string]: string | string[] } = {}, notAuth: boolean = false) {
    const options = {
      params: params,
      headers: notAuth
        ? {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        : {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${this.sessionService.accessToken}`
          }
    };

    return this.httpClient.get<T>(url, options).toPromise();
  }

  public async post<T>(url: string, body: any = {}, notAuth: boolean = false) {
    const options = {
      headers: notAuth
        ? {
            'Content-Type': 'application/json; charset=UTF-8'
          }
        : {
            'Content-Type': 'application/json; charset=UTF-8',
            Authorization: `Bearer ${this.sessionService.accessToken}`
          }
    };

    return this.httpClient.post<T>(url, body, options).toPromise();
  }

  public async put<T>(url: string, body: any = {}) {
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${this.sessionService.accessToken}`
      }
    };

    return this.httpClient.put<T>(url, body, options).toPromise();
  }

  public async delete<T>(url: string) {
    const options = {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${this.sessionService.accessToken}`
      }
    };

    return this.httpClient.delete<T>(url, options).toPromise();
  }

  public async postForm<T>(url: string, params: { [param: string]: any } = {}) {
    const options = {};

    const body = new FormData();

    for (const paramName of Object.keys(params)) {
      body.set(paramName, params[paramName]);
    }

    return this.httpClient.post<T>(url, body, options).toPromise();
  }

  public async downloadFile<T>(url: string) {
    const options = {
      responseType: 'blob' as 'blob'
    };

    return this.httpClient.get(url, options).toPromise();
  }

  public fetchAsBlob = (url: string) => fetch(url).then((response) => response.blob());
}
