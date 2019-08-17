import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, ModalController, Nav, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { UserData } from '../providers/user-data';
import { ProfilePerformancePage } from "../pages/profile-performance/profile-performance";
import { QuotesAndInvoicesPage } from "../pages/quotes-and-invoices/quotes-and-invoices";
import { DashboardPage } from "../pages/dashboard/dashboard";
import { Common } from "./app.common";
import { SettingsPage } from "../pages/settings/settings";
import { ServiceProviderModel } from '../models/service-provider-model';
import { FcmProvider } from '../providers/fcm/fcm';
import { tap } from 'rxjs/operators';
import { AuthService } from '../providers/services/auth-service';
// For Notifications
import { DeviceTokenOptions } from '../interfaces/device-token-options';
import { PlatformEnum } from '../enum/PlatformEnum';
import { NotificationTypeEnum } from '../enum/NotificationTypeEnum';
import { JobDetailPage } from '../pages/job-detail/job-detail';
import { JobsPage } from '../pages/jobs/jobs';
import { WalletPage } from '../pages/wallet/wallet';
import { UserService } from '../providers/services/user-service';

export interface PageInterface {
  title: string;
  name: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
  tabName?: string;
  tabComponent?: any;
}

@Component({
  selector: 'page-home',
  templateUrl: 'app.template.html'
})
export class TQWorksServiceProviderApp {
  // the root nav is a child of the root app component
  // @ViewChild(Nav) gets a reference to the app's root nav
  @ViewChild(Nav) nav: Nav;

  // List of pages that can be navigated to from the left menu
  // the left menu only works after login
  // the login page disables the left menu
  appPages: PageInterface[] = [
    { title: 'Home', name: 'TabsPage', component: DashboardPage, tabComponent: DashboardPage, 
      index: 0, icon: 'home-outline'},
    { title: 'Quotes', name: 'QuotesAndInvoices', component: QuotesAndInvoicesPage, icon: 'list-box-outline' },
    { title: 'Settings', name: 'Settings', component: SettingsPage, icon: 'settings-outline' }
  ];
  loggedInPages: PageInterface[] = [
    { title: 'About', name: 'About', component: AboutPage, icon: 'information-circle-outline' },
  ];
  loggedOutPages: PageInterface[] = [
    { title: 'Login', name: 'LoginPage', component: LoginPage, icon: 'log-in-outline' },
    { title: 'Support', name: 'SupportPage', component: SupportPage, icon: 'help-outline' },
  ];
  rootPage: any;
  providerData: ServiceProviderModel;
  notificationTapped: boolean = false;
  activePage: any;

  constructor(
    public events: Events, public userData: UserData, public menu: MenuController, public platform: Platform,
    public storage: Storage, public splashScreen: SplashScreen, public modal: ModalController, 
    public _common: Common, private fcm: FcmProvider, private _authService: AuthService,
    private _userService: UserService, 
    //private statusBar: StatusBar
  ) {
    // Check if the user has already seen the tutorial
    // statusBar.overlaysWebView();

    // statusBar.overlaysWebView();
    this.storage.get('hasSeenTutorial')
      .then((hasSeenTutorial) => {
        console.log("in has seen tutorial");
        if (!hasSeenTutorial) {
          this.rootPage = TutorialPage;
        } else {
          this.userData.hasLoggedIn().then((hasLoggedIn) => {
            this.enableMenu(hasLoggedIn === true);
          });
        }
        this.platformReady();
      });

    this.listenToLoginEvents();
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  openPage(page: PageInterface) {
    let params = {};

    // the nav component was found using @ViewChild(Nav)
    // setRoot on the nav to remove previous pages and only have this page
    // we wouldn't want the back button to show in this scenario
    if (page.index) {
      params = { tabIndex: page.index };
    }

    // If we are already on tabs just change the selected tab
    // don't setRoot again, this maintains the history stack of the
    // tabs even if changing them from the menu
    if (this.nav.getActiveChildNavs().length && page.index != undefined) {
      this.nav.getActiveChildNavs()[0].select(page.index);
    } else {
      // Set the root of the nav with params if it's a tab index
      this.nav.setRoot(page.name, params).catch((err: any) => {
        console.log(`Didn't set nav root: ${err}`);
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      this.userData.logout();
    }
    this.activePage = page;
  }

  public checkActivePage(page): boolean{
    return page === this.activePage;
  }

  logOut() {
    this.userData.logout();
  }

  openTutorial() {
    this.nav.setRoot(TutorialPage);
  }

  goToPerformancePage() {
    this.nav.setRoot(ProfilePerformancePage);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
      this.nav.setRoot(LoginPage);
    });
  }

  sendDeviceToken(token, deviceData, uuid) {
    let deviceTokensOption: DeviceTokenOptions = 
    {appType: PlatformEnum.ProviderMobileApp, userId: null, token: '', uuid: '', deviceData: '', isEnabled: true}
    deviceTokensOption.token = token;
    this.userData.getUserId().then((userId) => {
      deviceTokensOption.userId = userId;
      deviceTokensOption.uuid = uuid;
      deviceTokensOption.deviceData = JSON.stringify(deviceData);
      this._authService.sendDeviceToken(deviceTokensOption)
        .subscribe((result) => {
          if (result.status) {
            this.storage.set('hasSentDeviceToken', true);
          } else {
            console.log("Could not send token to server: ", result);
          }
      },
      error => {
        console.log("Cannot send device Token: ", error);
      });
    });
  }

  goToNotificationDetails(notificationType, requestId) {
    console.log("notificationType", notificationType, "requestId", requestId);
    switch (+notificationType) {
      case NotificationTypeEnum.project:
        this.nav.setRoot(JobDetailPage, { jobDetails: {id: requestId}, fromNotifications: true});
        return;
      case NotificationTypeEnum.jobAlert:
        this.nav.setRoot(JobsPage, { jobAlert: {id: requestId}, fromNotifications: true});
        return;
      case NotificationTypeEnum.account:
        this.nav.setRoot(ProfilePerformancePage);
        return;
      case NotificationTypeEnum.wallet:
        this.nav.setRoot(WalletPage);
        return;
      case NotificationTypeEnum.rating:
        this.nav.setRoot(ProfilePerformancePage, { segmentValue: 'two' });
        return;
    }
  }

  updateProviderDetails() {
    this.userData.getUserId().then((userId) => {
      this._userService.getProvider(userId).subscribe((result) => {
          this.providerData = result;
          this.userData.saveProvider(this.providerData).then(() => {
          });
        },
        error => {
          console.log('error: ', error);
        },
        () => {
        });
    });
  }

  enableMenu(loggedIn: boolean) {
    if (loggedIn) {
      this.userData.getProviderData().then((providerData) => {
        this.providerData = providerData;
      });
      if (this.platform.is('cordova')) {
        //Get a FCM token
        this.userData.checkHasSentDeviceToken().then((tokenSent) => {
          if (!tokenSent) {
            this.fcm.getToken().then((token) => {
              let deviceData = this.fcm.getDeviceData();
              this.sendDeviceToken(token, 
                  {'manufacturer' : deviceData.manufacturer, 'model': deviceData.model, 'platform': deviceData.platform,
                   'serial': deviceData.serial, 'version': deviceData.version}, deviceData.uuid);
            });
          }
        });
        // Listen to incoming messages
        this.fcm.listenToNotifications().pipe(
          tap( notification => {
            //show a toast
            this.notificationTapped = true;
            let messageText: string;
            if (this.platform.is('android')) {
              messageText = notification.body;
            }

            if (this.platform.is('ios')) {
              messageText = notification.aps.alert;
            }
            console.log('notification data', notification);
            this.updateProviderDetails();
            this.goToNotificationDetails(notification.notificationType, notification.requestId);
            this._common.showToast(messageText);
          })
        ).subscribe(); 
      } else {
        console.log('Cordova Not Available');
      }
    }
    this.gotoRequiredPage();
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }

  gotoRequiredPage() {
    this.userData.hasLoggedIn()
      .then((hasLoggedIn) => {
        if (hasLoggedIn && !this.notificationTapped) {
          this.rootPage = TabsPage;
        } else if (!hasLoggedIn) {
          this.rootPage = LoginPage;
        }
      });
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNavs()[0];

    // Tabs are a special case because they have their own navigation
    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'menu-active';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().name === page.name) {
      return 'menu-active';
    }
    return;
  }

  getURL(settingsKey) {
    this._userService.getSettingsByKey(settingsKey).subscribe(
      (result) => {
        console.log("result.value : ", result.value);
        this.openFaqPage(result.value);
      },
      error => {
        console.log(error);
      },
      () => {
      });
  }

  openFaqPage(url) {
    window.open(url, 'location=yes');
  }
}
