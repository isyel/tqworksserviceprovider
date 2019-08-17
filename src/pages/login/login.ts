import { Component } from '@angular/core';
import { NgForm} from '@angular/forms';
import {MenuController, NavController, AlertController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs-page/tabs-page';
import {Common} from "../../app/app.common";
import {AuthService} from "../../providers/services/auth-service";
import {LoginOptions} from "../../interfaces/login-options";
import {UserService} from "../../providers/services/user-service";
import {ServiceProviderModel} from "../../models/service-provider-model";
import {UserModel} from "../../models/user-model";
import {ForgotPasswordOptions} from "../../interfaces/forgot-password-options";
import {PlatformEnum} from "../../enum/PlatformEnum";
import {JwtHelper} from "angular2-jwt";
import { AvailabilityEnum } from '../../enum/AvailabilityEnum';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginData: LoginOptions = { username: '', password: '' , rememberMe: true , channel: PlatformEnum.ProviderMobileApp};
  recoverPassword: ForgotPasswordOptions = { platform: PlatformEnum.ProviderMobileApp, email: '', phoneNumber: null };
  submitted = false;
  providerDetails: ServiceProviderModel;
  userDetails: UserModel;
  hintText: string = 'Authenticating...';
  showPasswordRecovery: boolean = false;
  showRecoveryCodePage: boolean = false;
  resetCode: any;
  notMatch: boolean = false;
  jwtHelper: JwtHelper = new JwtHelper();
  newPasswordData: any;

  constructor(public navCtrl: NavController, public _common: Common, public menu: MenuController,
              private _authService: AuthService, private _userData: UserData,
              private _userService: UserService, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.menu.enable(false);
  }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this._common.showLoading('Authenticating...');
      this._authService.login(this.loginData)
        .subscribe((result) => {
            if (result.status) {
              this._userData.saveLogin(result);
              this.setServiceProviderDetails(result);
            } else {
              this._common.showError(result.message);
            }
          },
          error => {
            this._common.hideLoading();
            if (error.status === 0) {
              if (error.type == 3) {
                // type 3 indicates networking issue (though not concrete error code)
              }
              this._common.showToast("Network error! Please check your connection");
            }
            else {
              this._common.showError("We cannot process your request at the moment."); //"We cannot process your request at the moment."
            }
          },
          () => {
            // observer.next(success);
            // observer.complete();
          });
    }
  }

  setServiceProviderDetails(loginResult) {
    let currentUser = this.jwtHelper.decodeToken(loginResult.token);
    this._userData.setUserId(JSON.parse(currentUser.UserData).id).then(() => {
      this._userData.getUserId().then((userId) => {
        this._userService.getProvider(userId).subscribe((result) => {
            this.providerDetails = result;
            if (this.providerDetails == null) {
              this.hintText = 'No Provider Details Found, Register As A Provider To Continue.';
              this._common.showPopup('Not A Service Provider?', this.hintText);
            }
            else if (this.providerDetails.availability == AvailabilityEnum.unknown) {
              this.hintText = 'Your Account is not yet Activated, Ask Admin For Activation';
              this._common.showPopup('Account Not Activated', this.hintText);
            }
            else {
              this._userData.setProfilePics(this.providerDetails.photograph);
              this._userData.saveProvider(this.providerDetails).then(() => {
                this.menu.enable(true); //enable menu back
                this.navCtrl.push(TabsPage);
              });
            }
          },
          error => {
            this.hintText = 'Network or Server Error, Try Again!';
            console.log('error: ', error);
            this._common.showError(this.hintText);
          },
          () => {
            this._common.hideLoading();
            // observer.next(success);
            // observer.complete();
          });
      });
    });
  }

  forgotPassword() {
    this.showPasswordRecovery = !this.showPasswordRecovery;
    // this.navCtrl.push(ForgotPasswordPage);
  }

  onSubmitPasswordRecovery(form: NgForm) {
    if (form.valid) {
      this._common.showLoading('SUbmitting...');
      this._authService.forgotPassword(this.recoverPassword)
        .subscribe((result) => {
            if (result.status) {
              this.createNewPassword();
              this._common.showPopup('Token Sent', 'An SMS Reset Code Has Been Sent To You');
              this.showRecoveryCodePage = true;
              this.showPasswordRecovery = false;
            } else {
              this._common.showError(result.message);
            }
          },
          error => {
            this._common.hideLoading();
            if (error.status === 0) {
              if (error.type == 3) {
                // type 3 indicates networking issue (though not concrete error code)
              }
              this._common.showToast("Network error! Please check your connection");
            }
            else {
              console.log("Error: ", error);
              this._common.showPopup('', error.error.message); //"We cannot process your request at the moment."
            }
          },
          () => {
            this._common.hideLoading();
            // observer.next(success);
            // observer.complete();
          });
    }
  }

  createNewPassword() {
    if(this.recoverPassword.phoneNumber == null) {
      this._common.showToast('Enter A Phone Number First');
      return;
    }
    let alert = this.alertCtrl.create({
      title: 'Change Your Password',
      enableBackdropDismiss: false,
    });
    alert.addInput({
      type: 'text',
      label: 'Enter OTP Code sent to your phone',
      name: 'otp_code',
      placeholder: 'OTP Code'
    });
    alert.addInput({
      type: 'password',
      label: 'New Password',
      name: 'password',
      placeholder: 'New Password'
    });
    alert.addInput({
      type: 'password',
      label: 'Confirm Password',
      name: 'confirm_password',
      placeholder: 'Confirm Password'
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Submit',
      handler: (formData) => {
        if (formData.password != formData.confirm_password) {
          this.notMatch = true;
          this._common.showToast('Error!! Passwords Do Not Match');
          return false;
        } else if (formData.password == "" || formData.otp_code == "") {
          this._common.showToast('Fields Are Empty');
          return false;
        }
        else {
          this.notMatch = false;
        }
        this._common.showLoading('Reseting Password');
        this.newPasswordData = { platform: PlatformEnum.ProviderMobileApp, emailOrPhoneNumber: this.recoverPassword.phoneNumber,
          otpCode: formData.otp_code, password: formData.password, confirmPassword: formData.confirm_password };
        this._authService.submitNewPassword(this.newPasswordData)
          .subscribe((result) => {
            if (result.status) {
              this._common.showPopup(result.message, 'Password change complete, you can login with your new password now');
              alert.dismiss();
            } else {
              this._common.showError(result.message);
            }
            this._common.hideLoading();
          },
          error => {
            this._common.hideLoading();
            this._common.handleError(error);
          },
          () => {
            // observer.next(success);
            // observer.complete();
          });
        return false;
      }
    });

    alert.present();
  }

}
