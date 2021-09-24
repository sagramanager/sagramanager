import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  public foodstuffTypes: any = [];
  public foodstuffTypesLoaded = false;

  public foodstuffs: any = [];
  public foodstuffsLoaded = false;

  public foodstuffsListByTypes: any = [];
  public currentOrderByTypes: any = [];

  public newFoodstuff = {
    name: '',
    price: ''
  }

  initialInfoForm = new FormGroup({
    customer: new FormControl(''),
    places: new FormControl(''),
    tableNumber: new FormControl(''),
    waiter: new FormControl(''),
    notes: new FormControl('')
  });

  constructor(private modalService: NgbModal, private api: ApiClientService) {
    this.api.get("foodstuffTypes").then((res) => {
      console.log(res);
      this.foodstuffTypes = res;
      this.foodstuffTypesLoaded = true;
    });
    this.api.get("foodstuffs").then((res) => {
      console.log(res);
      res.forEach((foodstuff: any) => {
        if(typeof(this.foodstuffsListByTypes[foodstuff.type.name]) === "undefined") {
          this.foodstuffsListByTypes[foodstuff.type.name] = [];
        }
        this.foodstuffsListByTypes[foodstuff.type.name].push(foodstuff);
      });
      console.log(this.foodstuffsListByTypes);
      this.foodstuffs = res;
      this.foodstuffsLoaded = true;
    });
  }

  ngOnInit(): void {
  }

  addFoodstuffToOrder(foodstuff: any) {
    console.log("Add", foodstuff);
    if(typeof(this.currentOrderByTypes[foodstuff.type.name]) === "undefined") {
      this.currentOrderByTypes[foodstuff.type.name] = [];
    }
    if(typeof(this.currentOrderByTypes[foodstuff.type.name][foodstuff.name]) === "undefined") {
      this.currentOrderByTypes[foodstuff.type.name][foodstuff.name] = {
        name: foodstuff.name,
        price: foodstuff.price,
        quantity: 1
      }
    } else {
      this.currentOrderByTypes[foodstuff.type.name][foodstuff.name]["quantity"]++;
    }
    
    console.log(this.currentOrderByTypes);
  }

  getFoodstuffsInCurrentOrderByType(type: any): any[] {
    let foodstuffs = [];
    if(typeof(this.currentOrderByTypes[type]) === "undefined") return [];
    for(let foodstuff in this.currentOrderByTypes[type]) {
      foodstuffs.push(this.currentOrderByTypes[type][foodstuff]);
    }
    return foodstuffs;
  }

  foodstuffTypeInCurrentOrder(type: any): boolean {
    //return true if type is in current order
    if(typeof(this.currentOrderByTypes[type]) === "undefined") {
      return false;
    }
    return true;
  }

  foodstuffTypeInCurrentOrderList(): string[] {
    //return list of foodstuffs types in current order
    let types: string[] = [];
    for(let type in this.currentOrderByTypes) {
      if(this.foodstuffTypeInCurrentOrder(type)) types.push(type);
    }
    return types;
  }

  sumFoodstuffQuantity(foodstuffType: string, foodstuffName: string) {
    if(typeof(this.currentOrderByTypes[foodstuffType][foodstuffName]) === "undefined") return;
    this.currentOrderByTypes[foodstuffType][foodstuffName]["quantity"]++;
  }

  subtractFoodstuffQuantity(foodstuffType: string, foodstuffName: string) {
    if(typeof(this.currentOrderByTypes[foodstuffType][foodstuffName]) === "undefined") return;
    if(this.currentOrderByTypes[foodstuffType][foodstuffName]["quantity"] > 1) {
      this.currentOrderByTypes[foodstuffType][foodstuffName]["quantity"]--;
    } else {
      delete this.currentOrderByTypes[foodstuffType][foodstuffName];
      if(Object.keys(this.currentOrderByTypes[foodstuffType]).length == 0) {
        delete this.currentOrderByTypes[foodstuffType];
      }
    }
  }

  getTotalPriceOfCurrentOrder() {
    let price = 0;
    for(let type in this.currentOrderByTypes) {
      for(let foodstuff in this.currentOrderByTypes[type]) {
        price += this.currentOrderByTypes[type][foodstuff]["price"] * this.currentOrderByTypes[type][foodstuff]["quantity"];
      }
    }
    return price;
  }

  generateOrderObject() {
    let orderObject: any = {
      initialInfo: this.initialInfoForm.value,
      foodstuffs: []
    };
    console.log(this.initialInfoForm.value);
    for(let type in this.currentOrderByTypes) {
      for(let foodstuff in this.currentOrderByTypes[type]) {
        orderObject.foodstuffs.push({
          name: this.currentOrderByTypes[type][foodstuff]["name"],
          price: this.currentOrderByTypes[type][foodstuff]["price"],
          quantity: this.currentOrderByTypes[type][foodstuff]["quantity"]
        });
      }
    }
    return orderObject;
  }

  resetOrder() {
    this.currentOrderByTypes = [];
  }

  sendOrder() {
    let orderObject = this.generateOrderObject();
    console.log(orderObject);
    console.log(this.currentOrderByTypes);
  }

  addFoodstuff(foodstuffModal: any) {
    this.modalService.open(foodstuffModal);
  }

  saveFoodstuff() {
    console.log(this.newFoodstuff);
  }

}
