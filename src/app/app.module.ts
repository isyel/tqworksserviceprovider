import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import {TQWorksServiceProviderApp} from './app.component';
import { AboutPage } from '../pages/about/about';
import { LoginPage } from '../pages/login/login';
import { ProjectsPage } from '../pages/projects/projects';
import { JobDetailPage } from '../pages/job-detail/job-detail';
import { TabsPage } from '../pages/tabs-page/tabs-page';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { UserData } from '../providers/user-data';
import {JobsPage} from "../pages/jobs/jobs";
import {JobOwnerDetailPage} from "../pages/job-owner-detail/job-owner-detail";
import {DashboardPage} from "../pages/dashboard/dashboard";
import {ProfilePerformancePage} from "../pages/profile-performance/profile-performance";
import {Ionic2RatingModule} from "ionic2-rating";
import {WalletPage} from "../pages/wallet/wallet";
import {QuotesAndInvoicesPage} from "../pages/quotes-and-invoices/quotes-and-invoices";
import {HttpClientModule} from "@angular/common/http";
import {RelativeTime} from "../pipes/relative-time";
import {SendQuoteModal} from "../pages/send-quote-modal.ts/send-quote-modal";
import {NotificationsPage} from "../pages/notifications/notifications";
// import { Geolocation } from '@ionic-native/geolocation';
import {ServiceRequestService} from "../providers/services/service-request-service";
import {WalletService} from "../providers/services/wallet-service";
import {NotificationService} from "../providers/services/notification-service";
import {Common} from "./app.common";
import {Configuration} from "./app.constants";
import {ApiService} from "./app.service";
import {AuthService} from "../providers/services/auth-service";
import {UserService} from "../providers/services/user-service";
import {QuoteDetailsPage} from "../pages/quote-details/quote-details";
import { FcmProvider } from '../providers/fcm/fcm';
import {QuotesService} from "../providers/services/quotes-service";
import {ReviewsService} from "../providers/services/reviews-service";
import {GoogleMaps} from "@ionic-native/google-maps";
import {SettingsPage} from "../pages/settings/settings";
import {CancelJobPage} from "../pages/cancel-job/cancel-job";
import { FilterPopoverPage } from '../pages/filter-popover/filter-popover';
//Firebase Notifications
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

import { RateUserModalPage } from '../pages/rate-user-modal/rate-user-modal';
import { IonicSelectableModule } from 'ionic-selectable';
import { AddItemPopoverPage } from '../pages/add-item-popover/add-item-popover';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { MerchantsListPage } from '../pages/merchants-list/merchants-list';
import { MerchantsItemsListModalPage } from '../pages/merchants-items-list-modal/merchants-items-list-modal';
import { MerchantsServiceProvider } from '../providers/services/merchants-service';


@NgModule({
  declarations: [
    TQWorksServiceProviderApp,
    AboutPage,
    LoginPage,
    ProjectsPage,
    JobDetailPage,
    JobOwnerDetailPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    JobsPage,
    DashboardPage,
    ProfilePerformancePage,
    WalletPage,
    QuotesAndInvoicesPage,
    RelativeTime,
    SendQuoteModal,
    CancelJobPage,
    NotificationsPage,
    QuoteDetailsPage,
    SettingsPage,
    FilterPopoverPage,
    AddItemPopoverPage,
    RateUserModalPage,
    MerchantsListPage,
    MerchantsItemsListModalPage
  ],
  imports: [
    IonicStorageModule.forRoot({
      name: 'TQworks_provider',
      driverOrder: ['indexeddb', 'websql', 'sqlite']
    }),
    Ionic2RatingModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicSelectableModule,
    IonicImageViewerModule,
    IonicModule.forRoot(TQWorksServiceProviderApp,
      {
        tabsHideOnSubPages: true,
        iconMode: 'ios',
        backButtonIcon: 'ios-arrow-back',
        scrollAssist: false,
        autoFocusAssist: false
      }, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs-page' },
        { component: ProjectsPage, name: 'Projects', segment: 'projects' },
        { component: JobDetailPage, name: 'JobDetail', segment: 'jobDetail/:jobDetails.id' },
        { component: JobOwnerDetailPage, name: 'JobOwnerDetail', segment: 'jobOwnerDetail/:jobOwnerDetails.id' },
        { component: AboutPage, name: 'About', segment: 'about' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: JobsPage, name: 'Jobs', segment: 'jobs' },
        { component: DashboardPage, name: 'Dashboard', segment: 'dashboard' },
        { component: ProfilePerformancePage, name: 'ProfilePerformance', segment: 'profilePerformance' },
        { component: WalletPage, name: 'Wallet', segment: 'wallet' },
        { component: QuotesAndInvoicesPage, name: 'QuotesAndInvoices', segment: 'quotesAndInvoices' },
        { component: NotificationsPage, name: 'Notifications', segment: 'notifications' },
        { component: QuoteDetailsPage, name: 'QuoteDetails', segment: 'quoteDetails' },
        { component: SettingsPage, name: 'Settings', segment: 'settings' },
        { component: MerchantsListPage, name: 'MerchantsList', segment: 'merchantsList' },
        { component: MerchantsItemsListModalPage, name: 'MerchantsItemsListModal', segment: 'MerchantsItemsList' },
      ]
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    TQWorksServiceProviderApp,
    AboutPage,
    LoginPage,
    ProjectsPage,
    JobDetailPage,
    JobOwnerDetailPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    JobsPage,
    DashboardPage,
    ProfilePerformancePage,
    WalletPage,
    QuotesAndInvoicesPage,
    SendQuoteModal,
    CancelJobPage,
    NotificationsPage,
    QuoteDetailsPage,
    SettingsPage,
    FilterPopoverPage,
    AddItemPopoverPage,
    RateUserModalPage,
    MerchantsListPage,
    MerchantsItemsListModalPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    UserData,
    SplashScreen,
    FcmProvider,
    Configuration,
    Common,
    ServiceRequestService,
    WalletService,
    NotificationService,
    ApiService,
    AuthService,
    UserService,
    QuotesService,
    ReviewsService,
    GoogleMaps,
    Firebase,
    Device,
    MerchantsServiceProvider
  ]
})
export class AppModule { }
