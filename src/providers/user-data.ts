import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {JwtHelper} from "angular2-jwt";
import {ServiceProviderModel} from "../models/service-provider-model";
import {ServiceCategoryModel} from "../models/service-category-model";
import {ServiceRequestModel} from "../models/service-request-model";
import {ServiceRequestQuoteModel} from "../models/service-request-quote-model";
import { WalletHistoryModel, WalletBalanceModel } from '../models/wallet-model';
import { NotificationModel } from '../models/notification-model';
import { RecentActivitiesModel } from '../models/recent-activities-model';


@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';
  USER_TOKEN = 'loginToken';
  REFRESH_TOKEN = 'refresh_token';
  currentUser: any;
  latitude: number;
  longitude: number;
  jwtHelper: JwtHelper = new JwtHelper();
  PUSH_NOTIFICATION = true;


  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  saveLogin(result: any): void {
    if (result) {
      this.storage.ready().then(() => {
        this.setLoginToken(result.token); //safe token
        this.setRefreshToken(result.refresh_token); //safe refresh token
        this.currentUser = this.jwtHelper.decodeToken(result.token);
        this.setUserData(JSON.parse(this.currentUser.UserData));
      });
    }
  };

  async saveProvider(providerDetails: ServiceProviderModel): Promise<any> {
    if (providerDetails) {
      await this.storage.set('providerData', providerDetails);
      this.storage.set('provider_id', providerDetails.id);
      this.login();
    }
  };

  saveServiceCategory(serviceCategory: ServiceCategoryModel): void {
    if (serviceCategory) {
      this.setServiceCategoryData(serviceCategory);
    }
  };

  setUserId(userId: number): Promise<any>  {
    return this.storage.set('user_id', userId);
  };

  async getUserId(): Promise<any> {
    const value = await this.storage.get('user_id');
    return value;
  };

  setUserData(currentUser: any) {
    this.storage.set('currentUser', currentUser);
  };

  async getUserData(): Promise<any> {
    const value = await this.storage.get('currentUser');
    return value;
  };

  async getProviderData(): Promise<ServiceProviderModel> {
    const value = await this.storage.get('providerData');
    return value;
  };

  async getProviderId(): Promise<number>  {
    const value = await this.storage.get('provider_id');
    return value;
  };

  setProfilePics(profilePics: any): void {
    this.storage.set('profilePics', profilePics);
  };

  async getProfilePics(): Promise<any> {
    const value = await this.storage.get('profilePics');
    return value;
  };

  setOfflineQuoteData(quoteData: ServiceRequestQuoteModel[]): void {
    this.storage.set('quoteData', quoteData);
  };

  async getOfflineQuoteData(): Promise<ServiceRequestQuoteModel[]> {
    const value = await this.storage.get('quoteData');
    return value;
  };

  setOfflineProjectData(jobHistoryData: ServiceRequestModel[]): void {
    this.storage.set('jobHistoryData', jobHistoryData);
  };

  async getOfflineProjectData(): Promise<ServiceRequestModel[]> {
    const value = await this.storage.get('jobHistoryData');
    return value;
  };

  setWalletBalance(walletBalance: WalletBalanceModel): void {
    this.storage.set('walletBalance', walletBalance);
  };

  async getWalletBalance(): Promise<WalletBalanceModel> {
    const value = await this.storage.get('walletBalance');
    return value;
  };

  setOfflineWalletHistoryData(walletHistoryData: WalletHistoryModel[]): void {
    this.storage.set('walletHistoryData', walletHistoryData);
  };

  async getOfflineWalletHistoryData(): Promise<WalletHistoryModel[]> {
    const value = await this.storage.get('walletHistoryData');
    return value;
  };

  setRecentActivities(recentActivity: RecentActivitiesModel): void {
    /*
    TODO: add activity to existing array, sort in descending order, after retrieval
    */
    let recentActivityArray = [];
    recentActivityArray.push(recentActivity);
    console.log('recentActivity to add to list: ', recentActivityArray);
    this.getRecentActivities().then((recentActivityFromStorage) => {
      console.log('existing recent activity: ', recentActivityFromStorage);
      if(recentActivityFromStorage != null) {
        recentActivityFromStorage.forEach((existingRecentActivity)=> {
          recentActivityArray.push(existingRecentActivity);
        });
      }
      console.log('recent activity to save to storage: ', recentActivityArray);
      this.storage.set('recentActivities', recentActivityArray);
    });
  };

  async getRecentActivities(): Promise<RecentActivitiesModel[]> {
    const value = await this.storage.get('recentActivities');
    return value;
  };

  setServiceCategoryData(serviceCategory: ServiceCategoryModel): void {
    this.storage.set('serviceCategory', serviceCategory);
  };

  async getServiceCategoryData(): Promise<ServiceCategoryModel> {
    const value = await this.storage.get('serviceCategory');
    return value;
  };

  setLoginToken(token: string): void {
    this.storage.set(this.USER_TOKEN, token);
  };

  async getLoginToken(): Promise<string> {
    const value = await this.storage.get(this.USER_TOKEN);
    return value;
  };

  saveNotifications(notification: NotificationModel[]): void {
    this.storage.set('notification', notification);
  };

  async getSavedNotifications(): Promise<NotificationModel[]>  {
    const value = await this.storage.get('notification');
    return value;
  };

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(): void {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.events.publish('user:login');
  };

  logout(): void {
    this.storage.set(this.HAS_LOGGED_IN, false);
    this.storage.clear();
    this.storage.set('hasSeenTutorial', 'true');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  async getUsername(): Promise<string> {
    const value = await this.storage.get('username');
    return value;
  };

  async hasLoggedIn(): Promise<boolean> {
    const value = await this.storage.get(this.HAS_LOGGED_IN);
    return value === true;
  };

  async checkHasSeenTutorial(): Promise<string> {
    const value = await this.storage.get(this.HAS_SEEN_TUTORIAL);
    return value;
  };

  async checkHasSentDeviceToken(): Promise<boolean> {
    const value = await this.storage.get('hasSentDeviceToken');
    return value;
  };

  changeLocation(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  setRefreshToken(token: string): void {
    this.storage.set(this.REFRESH_TOKEN, token);
  };

  async getRefreshToken(): Promise<string> {
    const value = await this.storage.get(this.REFRESH_TOKEN);
    return value;
  };

  //Notification Events
  addNotificationCount(notificationCount) {
    localStorage.setItem('notificationCount', String(notificationCount));
  }

  getNotificationCount() {
    const value = +localStorage.getItem('notificationCount');
    return value;
  }

  clearNotification() {
    localStorage.setItem('notificationCount', '0');
  }

  showNotification() {
    this.events.publish('notification:show');
  }
}
