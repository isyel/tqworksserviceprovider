import { Component } from '@angular/core';

import { NavController, ModalController, ViewController } from 'ionic-angular';
import { ProjectStatusEnum } from '../../enum/ProjectStatusEnum';


@Component({
  template: `
    <div align='center'>
      <h3>Filter By</h3>
      <ion-list>
        <button ion-item (click)="filterProjects(all)">
        <ion-icon name='list' color='primary' item-start></ion-icon> All</button>
        <button ion-item (click)="filterProjects(pending)">
        <ion-icon name='timer' color='pending' item-start></ion-icon> Pending</button>
        <button ion-item (click)="filterProjects(ongoing)">
        <ion-icon name='refresh' color='secondary' item-start></ion-icon> On Going</button>
        <button ion-item (click)="filterProjects(awaitingCompletion)">
        <ion-icon name='checkmark-circle-outline' color='pending' item-start></ion-icon> Awaiting Completion</button>
        <button ion-item (click)="filterProjects(completed)">
        <ion-icon name='done-all' color='secondary' item-start></ion-icon> Completed</button>
        <button ion-item (click)="filterProjects(cancelled)">
        <ion-icon name='remove-circle' color='danger' item-start></ion-icon> Cancelled</button>
        <button ion-item (click)="filterProjects(closed)">
        <ion-icon name='close-circle' color='secondary' item-start></ion-icon> Closed</button>
      </ion-list>
    </div>
  `
})
export class FilterPopoverPage {
  ongoing:number = ProjectStatusEnum.ongoing;
  pending:number = ProjectStatusEnum.pending;
  completed:number = ProjectStatusEnum.completed;
  cancelled:number = ProjectStatusEnum.cancelled;
  closed:number = ProjectStatusEnum.closed;
  awaitingCompletion:number = ProjectStatusEnum.awaitingCompletion;
  all:number = ProjectStatusEnum.all;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public modalCtrl: ModalController
  ) { }

  ngOnInit() {

  }

  filterProjects(type) {
    this.viewCtrl.dismiss(type);
  }
}