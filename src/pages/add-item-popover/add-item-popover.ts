import { Component, ViewChild } from '@angular/core';

import { NavController, ModalController, ViewController, AlertController, NavParams } from 'ionic-angular';
import { QuotesService } from '../../providers/services/quotes-service';
import { Common } from '../../app/app.common';
import { QuoteOptions } from '../../interfaces/quote-options';
import { ItemModel } from '../../models/item-model';
import { ServiceQuoteItemOptions, ServiceRequestQuoteNewItemModel } from '../../interfaces/service-quote-item-options';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { IonicSelectableComponent } from 'ionic-selectable';


@Component({
  selector: 'page-add-item-popover',
  template: `
    <div align='center'>
      <h3>Add an Item to Quote</h3>
      <form #itemForm="ngForm" novalidate>
        <ion-list>
          <ion-item no-lines>
            <ion-label floating>Choose Item</ion-label>
            <ionic-selectable
              #itemComponent
              class="itemComponent"
              item-content 
              [(ngModel)]="selectedItem"
              [items]="items"
              itemValueField="id"
              itemTextField="name"
              [canSearch]="true"
              [canClear]="true"
              (onOpen)="onOpen($event)"
              (onSearchFail)="onSearchFail($event)"
              (onSearchSuccess)="onSearchSuccess($event)"
              (onChange)="itemChange($event)"
              [ngModelOptions]="{standalone: true}">
              <ng-template ionicSelectableAddItemTemplate let-item="selectedItem"
                let-isAdd="isAdd">
                <form [formGroup]="itemAddForm" novalidate>
                  <ion-list>
                    <div padding-horizontal class="add-new">
                      <p>
                        Would you like to add this Item? <br/>
                      </p>
                    </div>
                    <ion-input type="text" formControlName="itemName" autocorrect="off"
                      autocapitalize="true" hidden="true">
                    </ion-input>
                  </ion-list>
                </form>
                <ion-footer>
                  <ion-toolbar>
                    <ion-row>
                      <ion-col col-6>
                        <button ion-button full no-margin
                          (click)="itemComponent.hideAddItemTemplate()" rounded>
                          No
                        </button>
                      </ion-col>
                      <ion-col col-6>
                        <button ion-button full no-margin
                          (click)="addNewItemToForm()" rounded>
                          Yes
                        </button>
                      </ion-col>
                    </ion-row>
                  </ion-toolbar>
                </ion-footer>
              </ng-template>
            </ionic-selectable>
          </ion-item>
          <ion-item>
            <ion-label floating>Price(&#8358;)</ion-label>
            <ion-input type="number" name="price"
              [(ngModel)]="price" #itemPrice="ngModel" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label floating>Quantity</ion-label>
            <ion-input type="number" name="quantity"
              [(ngModel)]="quantity" #itemQuantity="ngModel" required></ion-input>
          </ion-item>
          <ion-item *ngIf="isNewItem" >
            <ion-label floating>Description</ion-label>
            <ion-input type="text" name="description"
              [(ngModel)]="tempNewItem.description" #description="ngModel"></ion-input>
          </ion-item>
          <ion-item>
            <button *ngIf="!isNewItem" ion-item color="primary" rounded text-center [disabled]="!itemForm.valid"
            (click)='addItems()'>Add Item To Quote</button>
            <button *ngIf="isNewItem" ion-item color="primary" rounded text-center [disabled]="!itemForm.valid"
            (click)='addNewItem()'>Add Item To Quote</button>
          </ion-item>
        </ion-list>
      </form>
    </div>
  `
})
export class AddItemPopoverPage {
  hintText: string;
  isNewItem: boolean = false;
  quantity: number = 1;
  price: number;
  quote: QuoteOptions;
  selectedItem: ItemModel;
  items: ItemModel[];
  itemAddForm: FormGroup;
  itemNameControl: FormControl;
  tempNewItem: ServiceRequestQuoteNewItemModel = {categoryId: 0, category: null, subCategoryId: 0, subCategory: null,
    name: '', description: '', creatorUserId: 0, requiredApproval: true, requestQuoteId: 0, quantity: 0,
    unitCost: 0, totalAmount: 0};
  @ViewChild('itemComponent') itemComponent: IonicSelectableComponent;

  constructor(
    public viewCtrl: ViewController, private formBuilder: FormBuilder,
    public navCtrl: NavController, public alertCtrl: AlertController,
    public modalCtrl: ModalController, public _quotesService: QuotesService, public _common: Common,
    public navParams: NavParams
  ) { }

  ngOnInit() {
    this.quote = this.navParams.data.quote;
    this.items = this.navParams.data.items;
    this.itemNameControl = this.formBuilder.control(null, Validators.required);
    this.itemAddForm = this.formBuilder.group({
      itemName: this.itemNameControl
    });
  }

  itemChange(event: {component: IonicSelectableComponent, value: any }) {
    console.log('Item Change Called, selectedItem :', this.selectedItem);
  }

  onOpen($event) {
    this.isNewItem = false;
  }

  onSearchFail(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
      // Clean form.
      this.itemNameControl.reset();

      // Copy search text to port name field, so
      // user doesn't have to type again.
      this.itemNameControl.setValue(event.component.searchText);

      // Show form.
      event.component.showAddItemTemplate();
      console.log('Search Failed ');
  }

  onSearchSuccess(event: {
      component: IonicSelectableComponent,
      text: string
  }) {
      // Hide form.
      event.component.hideAddItemTemplate();
  }

  addItems() {
    if(this.selectedItem != null) {
      let itemOptions: ServiceQuoteItemOptions = { itemId: 0, name: '', totalAmount: 0, quantity: 1, unitCost: 0, requestQuoteId: 0};
      if(this.quote.items.find(savedItem => savedItem.itemId == this.selectedItem.id)) {
        this._common.showToast('Item Already Added');
        return;
      }
      itemOptions.name = this.selectedItem.name;
      itemOptions.quantity = this.quantity;
      itemOptions.itemId = this.selectedItem.id;
      itemOptions.unitCost = this.price;
      itemOptions.totalAmount = itemOptions.quantity * itemOptions.unitCost;
      this.quote.itemsTotalAmount += itemOptions.totalAmount;
      this.quote.totalAmount += itemOptions.totalAmount;
      this.quote.items.push(JSON.parse(JSON.stringify(itemOptions)));
    }
    this.viewCtrl.dismiss(this.quote);
  }

  addNewItemToForm() {
    console.log('Got to add new item');
    this.isNewItem = true;
    this.selectedItem = {name: this.itemNameControl.value, description: null, category: null, categoryId: null, subCategory: null, subCategoryId: null,
      unitCost: null, creatorUserId: null, requiredApproval: true, id: null, createdDate: null, updatedDate: null,
      softDelete: false, deletedTime: null, added: false};
    this.itemComponent.close();
  }

  addNewItem() {
    if(this.quote.newItems.find(savedItem => savedItem.name == this.selectedItem.name)) {
      this._common.showToast('Item Already Added');
      return;
    }
    this.tempNewItem.name = this.selectedItem.name;
    this.tempNewItem.quantity = this.quantity;
    this.tempNewItem.unitCost = this.price;
    this.tempNewItem.totalAmount = this.tempNewItem.unitCost * this.tempNewItem.quantity;
    this.quote.itemsTotalAmount += (this.tempNewItem.unitCost * this.tempNewItem.quantity);
    this.quote.totalAmount += (this.tempNewItem.unitCost * this.tempNewItem.quantity);
    this.quote.newItems.push(JSON.parse(JSON.stringify(this.tempNewItem)));
    this.isNewItem = false;
    this.viewCtrl.dismiss(this.quote);
  }

  filterProjects(type) {
    this.viewCtrl.dismiss(type);
  }
}