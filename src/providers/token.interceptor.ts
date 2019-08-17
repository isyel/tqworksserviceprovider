import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import { NavController, MenuController } from 'ionic-angular';

import { UserData } from './user-data';
import { AuthService } from './services/auth-service';
import { LoginPage } from '../pages/login/login';
import {Observable} from "rxjs/Rx";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    authToken: string;

    cachedRequests: Array<HttpRequest<any>> = [];
    public collectFailedRequest(request): void {
        this.cachedRequests.push(request);
    }

    public retryFailedRequests(next: HttpHandler): void {
        // retry the requests. this method can be called after the token is refreshed
        this.cachedRequests.forEach(request => {
            request = request.clone({
                setHeaders: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.user.getLoginToken()}`
                }
            });
            return next.handle(request);
        });
    }

    constructor(
        public user: UserData,
        public menu: MenuController,
        private injector: Injector
    ) {
        this.user.getLoginToken().then((authToken) => {
            this.authToken = authToken;
        });
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.headers.has('Authorization')) {
            request = request.clone({ headers: request.headers.append('Authorization', `Bearer ${this.authToken}`) });
        }

        return next.handle(request).do(() => { //event: HttpEvent<any>
            // if (event instanceof HttpResponse) {
            //   // do stuff with response if you want
            // }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                // console.log('Http error occurred:', err.error);
                if (err.error instanceof Error) {
                    // A client-side or network error occurred. Handle it accordingly.
                    console.log('An error occurred:', err.error.message);
                }
                else {
                    console.error(`Backend returned code ${err.status}, body was: ${err.error}`);
                }

                if (err.status === 0) {
                    if (err.type == 3) {
                        // type 3 indicates networking issue (though not concrete error code)
                    }
                    this.networkError("Network error! Please check your connection");
                    next;
                }

                if (err.status === 401) {
                    // console.log("Unauthorized!")
                    //if refresh_token is available
                    this.user.getRefreshToken().then((refresh_token) => {
                        if (refresh_token) {
                            //save current request
                            this.collectFailedRequest(request);
                            //reissue token
                            const auth = this.injector.get(AuthService);
                            auth.reissue_token(refresh_token)
                                .subscribe((token) => {
                                    if (token) {
                                        this.user.setLoginToken(token);
                                        //resend the pending request
                                        this.retryFailedRequests(next);
                                    } else {
                                        // console.log(result);
                                        this.gotoLogin();
                                    }
                                },
                                error => {
                                    console.log(error);
                                    this.gotoLogin();
                                });
                        }
                        else {
                            this.gotoLogin();
                        }
                    });
                }

                // ...optionally return a default fallback value so app can continue (pick one)
                // which could be a default value (which has to be a HttpResponse here)
                // return Observable.of(new HttpResponse({body: [{name: "Default value..."}]}));
                // or simply an empty observable
               // return Observable.empty<HttpEvent<any>>();
              return Observable.of(new HttpResponse({body: [{name: "Default value..."}]}));
            }
        });
    }

    gotoLogin() {
        let navCtrl = this.injector.get(NavController);
        this.menu.enable(false);
        navCtrl.push(LoginPage);
    }

    networkError(message: string = "Error Occured") {
        alert(message);
        // let navCtrl = this.injector.get(NavController);
        // navCtrl.push(ErrorPage, { message: message });
        // return;
    }
}
