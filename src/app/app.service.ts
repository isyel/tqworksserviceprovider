﻿import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeoutWith';
import {HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Configuration } from './app.constants';
import { _throw } from 'rxjs/observable/throw';

@Injectable()
export class ApiService {

    private baseUrl: string;
    public actionUrl: string;
    //public _configuration: Configuration;

    constructor(public http: HttpClient, public _configuration: Configuration) {
        this.baseUrl = this._configuration.ApiUrl;
    }

    public getAll<T>(): Observable<T> {
        return this.http.get<T>(this.baseUrl + this.actionUrl);
    }

    public getOne<T>(id?: number): Observable<T> {
        return this.http.get<T>(this.baseUrl + this.actionUrl + id);
    }

    public getOneWithParam<T>(id?: number, paramName?: string, param?: number): Observable<T> {
      return this.http.get<T>(this.baseUrl + this.actionUrl + id + paramName + param);
    }

    public post<T>(input: any): Observable<T> {
        const data = JSON.stringify(input);

        return this.http.post<T>(this.baseUrl + this.actionUrl, data,
          { headers: new HttpHeaders().set('Content-Type', 'application/json')})
            .timeoutWith(180000,  _throw('Request Timeout. Please check your connection'));
    }

    public update<T>(id: number, itemToUpdate: any): Observable<T> {
        const data = JSON.stringify(itemToUpdate);

        return this.http.put<T>(this.baseUrl + this.actionUrl + id, data, 
            { headers: new HttpHeaders().set('Content-Type', 'application/json')})
            .timeoutWith(180000,  _throw('Request Timeout. Please check your connection'));
    }

    public delete<T>(id: number): Observable<T> {
        return this.http.delete<T>(this.baseUrl + this.actionUrl + id);
    }

    public handleError(message): Observable<any> {
        let error: any = {
            error: `{ "status": false, "message": "${message}" }`
        };
        return _throw(error);
    }
}


@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        //console.log(JSON.stringify(req.headers));
        return next.handle(req);
    }
}
