import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { QuotesService } from '../../providers/services/quotes-service';
import { ItemModel } from '../../models/item-model';
import { Common } from '../../app/app.common';
import { MerchantModel } from '../../models/merchantModel';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the MerchantsItemsListModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-merchants-items-list-modal',
  templateUrl: 'merchants-items-list-modal.html',
})
export class MerchantsItemsListModalPage {
  items: ItemModel[];
  merchant: MerchantModel;
  purchasedItemList: ItemModel[] = [];
  queryText = '';
  searchResults: ItemModel[] = [];
  segment: string = 'all';
  loading: boolean;

  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public _quotesService: QuotesService, public _common: Common,
    public viewCtrl: ViewController, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.merchant = this.navParams.data.merchant;
    this.getAllItems();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MerchantsItemsListModalPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getAllItems() {
    console.log("In getAllItems");
    this._quotesService.getAllMerchantItems(this.merchant.id).subscribe((result) => {
        if (result) {
          this.items = result.items;
          console.log("Items Data: ", result);
        }
      },
      error => {
        this._common.showToast('Error Fetching Existing Items');
        console.log("Error: ", error);
      },
      () => {
        // observer.next(success);
        // observer.complete();
      });
  }

  addItemToList(itemToAdd) {
    //if item already in list remove it
    let itemExists = false;
    this.purchasedItemList.forEach( (item, index) => {
      if(item === itemToAdd) 
      {
        this.purchasedItemList.splice(index,1);
        itemExists = true;
      } 
    });
    this.items.forEach( (item, index) => {
      if(item === itemToAdd) 
      {
        if(itemExists)  {
          this.items[index].added = false;
        } else {
          this.items[index].added = true;
        }
      } 
    });
    
    if(!itemExists)  {
      this.purchasedItemList.push(itemToAdd);
    }
    console.log("purchasedItemList: ", this.purchasedItemList);
    this.changeDetectorRef.detectChanges();
  }

  markItemAsPurchased() {
    this._common.showToast('Items Purchased');
  }

  searchKeyword() {
    if (this.queryText == '') {
      this.segment = 'all';
      return;
    }
    this.searchResults = [];
    this.segment = 'search';
    this.loading = true;
    this.items.forEach((item) => {
      if (item.name.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1 ||
          (item.description == null ? false : item.description.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1) ||
          (item.category == null ? false : item.category.name.toLowerCase().indexOf(this.queryText.toLowerCase()) != -1)
      ) {
        this.searchResults.push(item);
      }
    })
    this.loading = false;
  }

}
