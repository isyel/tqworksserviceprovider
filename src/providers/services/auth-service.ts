import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { ApiService } from '../../app/app.service';
import { LoginOptions } from '../../interfaces/login-options';
import {ForgotPasswordOptions} from "../../interfaces/forgot-password-options";
import { DeviceTokenOptions } from '../../interfaces/device-token-options';

@Injectable()
export class AuthService {
  _actionUrl: string = 'Auth/';

  constructor(public _service: ApiService) {
    _service.actionUrl = this._actionUrl;
  }

  public login(credentials: LoginOptions) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter your login details" });
    } else {
      this._service.actionUrl = this._actionUrl + 'Login';
      return this._service.post<any>(credentials);
    }
  }

  public reissue_token(refresh_token: string) {
    this._service.actionUrl = this._actionUrl + 'RefreshToken';
    return this._service.post<string>(refresh_token);
  }

  public forgotPassword(credentials: ForgotPasswordOptions) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter your mobile number" });
    } else {
      this._service.actionUrl = 'Accounts/ForgotPassword?Platform=' + credentials.platform +
                                '&Email=' + credentials.email + '&PhoneNumber=' + credentials.phoneNumber;
      return this._service.post<any>(credentials);
    }
  }

  public submitNewPassword(credentials: any) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter a correct password" });
    } else {
      this._service.actionUrl = 'Accounts/ResetPassword?Platform=' + credentials.Platform +
                                '&EmailOrPhoneNumber=' + credentials.EmailOrPhoneNumber + '&OTPCode=' + credentials.OTPCode +
                                '&Password=' + credentials.Password + '&ConfirmPassword=' + credentials.ConfirmPassword;
      return this._service.post<any>(credentials);
    }
  }

  public submitResetCode(credentials: any) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter a correct reset code sent to your mobile phone" });
    } else {
      this._service.actionUrl = 'Accounts/SendResetCode';
      return this._service.post<any>(credentials);
    }
  }

  public sendDeviceToken(credentials: DeviceTokenOptions) {
    if (!credentials) {
      return Observable.throw({ message: "Please enter your login details" });
    } else {
      this._service.actionUrl = 'DeviceToken/';
      return this._service.post<any>(credentials);
    }
  }
}
