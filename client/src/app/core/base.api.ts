import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response.model';

import { getToken } from '../utils/helper';

export class BaseApi {
  private apiUrl = 'http://localhost:8080/spotify/';

  constructor(public http: HttpClient) {}

  private getHeaders() {
    const token = getToken();
    const headerOptions: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headerOptions.Authorization = token;
    }
    const headers = new HttpHeaders(headerOptions);
    return { headers };
  }

  private getUrl(url: string = ''): string {
    return this.apiUrl + url;
  }

  public get(url: string = ''): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.getUrl(url), this.getHeaders());
  }

  public post(url: string = '', body: any = {}): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.getUrl(url),
      body,
      this.getHeaders()
    );
  }
}
