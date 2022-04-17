import { Component, OnInit } from '@angular/core';
import { DataLoaderService } from '../../_services/data-loader.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  constructor(public data: DataLoaderService) {
    this.data.loadFoodstuffData();
    this.data.loadWaiters();
    this.data.loadOrders();
  }

  ngOnInit() {
  }
}
