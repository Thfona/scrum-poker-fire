import { environment } from 'src/environments/environment';

type APIVersion = 'v1';

export class Endpoint {
  private apiBaseUrl = environment.apiBaseUrl;
  private apiPaths = {
    v1: '/api/v1'
  };

  constructor(private apiVersion: APIVersion, private params: string) {}

  public get url(): string {
    return `${this.apiBaseUrl}${this.apiPaths[this.apiVersion]}${this.params}`;
  }
}
