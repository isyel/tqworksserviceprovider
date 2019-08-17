import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import {DashboardPage} from "../dashboard/dashboard";
import {WalletPage} from "../wallet/wallet";
import {ProjectsPage} from "../projects/projects";

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = DashboardPage;
  tab2Root: any = ProjectsPage;
  tab3Root: any = WalletPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
