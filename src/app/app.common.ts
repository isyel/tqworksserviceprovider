import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
import { AlertController, ToastController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class Common {
    loading: Loading;
    static NAIRA = '&#8358;';

    constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private loadingCtrl: LoadingController) { }

    public showLoading(message: string = 'Please wait...') {
      if(!this.loading){
        this.loading = this.loadingCtrl.create({
          content: message,
          //dismissOnPageChange: true
        });
        this.loading.present();
      }
    }

    public hideLoading() {
        if (this.loading) {
            this.loading.dismiss().then();
            this.loading = null;
        }
    }

    public showToast(msg) {
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'bottom',
        });
        toast.present();
    }

    public showError(text) {
        this.hideLoading();
        let alert = this.alertCtrl.create({
            title: 'Sorry!',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    }

    showPopup(title, text) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: text,
            buttons: [
                {
                    text: 'OK',
                }
            ]
        });
        alert.present();
    }

    public handleError(error) {
        let message: string;
        if (error.status === 0) {
            message = 'Network or Server error. Please try again'
        }
        else {
          console.log('error: ', error.error);
          message = error.error.message;
        }
        this.showError(message);
    }

  public delay(ms: number) {
    return new Promise(resolve => setTimeout(()=>resolve(), ms));
  }
}
