import { Component, OnInit, HostListener, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { DataLoaderService } from '../../_services/data-loader.service';
import { ModalNewWaiterComponent } from '../modal-new-waiter/modal-new-waiter.component';
import { ModalNewFoodstuffTypeComponent } from '../modal-new-foodstuff-type/modal-new-foodstuff-type.component';
import { ModalNewFoodstuffComponent } from '../modal-new-foodstuff/modal-new-foodstuff.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
//import iziToast from 'izitoast';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {
  public currentOrderByTypes: any = [];

  public currentOrderPaidByTypes: any = [];
  public currentOrderPaid = 0;

  hideButtonsCol = window.innerWidth < 1080;

  initialInfoForm = new FormGroup({
    customer: new FormControl(''),
    places: new FormControl(''),
    tableNumber: new FormControl(''),
    waiter: new FormControl(''),
    notes: new FormControl(''),
    takeAway: new FormControl(false)
  });

  notesTextareaContent = "";
  notesTextareaSelectedFoodstuff = "";
  notesTextareaSelectedFoodstuffType = "";

  money_types_list = ["10_cents", "20_cents", "50_cents", "1_euros", "2_euros", "5_euros", "10_euros", "50_euros"];

  constructor(
    private modalService: NgbModal,
    private api: ApiClientService,
    public data: DataLoaderService
  ) {
    this.data.foodstuffsLoad.pipe(first()).subscribe(() => {
      this.loadOrderFromLocalStorage();
      
      this.data.foodstuffTypes.map((t: any) => t.name).forEach((type: string) => {
        this.data.getFoodstuffsByType(type).forEach((foodstuff: any) => {
          this.addFoodstuffToOrder(foodstuff, 0);
        });
      });
    });
    this.initialInfoForm.valueChanges.subscribe((val) => {
      this.saveOrderInLocalStorage();
    });
    this.money_types_list.forEach((money_type) => {
      this.currentOrderPaidByTypes[money_type] = 0;
    });
    this.data.loadFoodstuffData();
    this.data.loadWaiters();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.hideButtonsCol = window.innerWidth < 1080;
  }

  ngOnInit(): void {
  }

  addFoodstuffToOrder(foodstuff: any, quantity: number = 1) {
    console.log("Add", foodstuff);
    if(typeof(this.currentOrderByTypes[foodstuff.type.name]) === "undefined") {
      this.currentOrderByTypes[foodstuff.type.name] = [];
    }
    if(typeof(this.currentOrderByTypes[foodstuff.type.name][foodstuff.name]) === "undefined") {
      this.currentOrderByTypes[foodstuff.type.name][foodstuff.name] = {
        name: foodstuff.name,
        price: foodstuff.price,
        quantity: quantity,
        notes: ""
      }
    } else {
      this.currentOrderByTypes[foodstuff.type.name][foodstuff.name]["quantity"] += quantity;
    }
    this.saveOrderInLocalStorage();
    
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
    } else if(!this.hideButtonsCol) {
      return Object.values(this.currentOrderByTypes[type]).some((foodstuff: any) => foodstuff.quantity > 0);
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
    this.saveOrderInLocalStorage();
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
    this.saveOrderInLocalStorage();
  }

  getMoneyValueByType(money_type: string) {
    if(money_type.indexOf("euros") > -1) {
      return parseFloat(money_type.replace("euros", ""));
    }
    if(money_type.indexOf("cents") > -1) {
      return parseFloat("0."+money_type.replace("cents", ""));
    }
    return 0;
  }

  sumCurrentOrderPaid(money_type: string) {
    this.currentOrderPaidByTypes[money_type]++;
    this.currentOrderPaid += this.getMoneyValueByType(money_type);
    this.saveOrderInLocalStorage();
  }

  subtractCurrentOrderPaid(money_type: string) {
    if(this.currentOrderPaidByTypes[money_type] > 0) {
      this.currentOrderPaidByTypes[money_type]--;
      this.currentOrderPaid -= this.getMoneyValueByType(money_type);
    }
    this.saveOrderInLocalStorage();
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
    let initialInfo = this.initialInfoForm.value;
    if(initialInfo.customer == null) initialInfo.customer = "";
    if(initialInfo.places == null) initialInfo.places = "";
    if(initialInfo.tableNumber == null) initialInfo.tableNumber = "";
    if(initialInfo.waiter == null) initialInfo.waiter = "";
    if(initialInfo.notes == null) initialInfo.notes = "";
    if(initialInfo.takeAway == null) initialInfo.takeAway = false;

    let orderObject: any = {
      initialInfo: initialInfo,
      foodstuffs: []
    };

    for(let type in this.currentOrderByTypes) {
      for(let foodstuff in this.currentOrderByTypes[type]) {
        let currentFoodstuff = this.currentOrderByTypes[type][foodstuff];
        if(currentFoodstuff["quantity"] == 0) break;
        orderObject.foodstuffs.push({
          name: currentFoodstuff["name"],
          price: currentFoodstuff["price"],
          quantity: currentFoodstuff["quantity"],
          notes: currentFoodstuff["notes"],
          type: type
        });
      }
    }

    return orderObject;
  }

  saveOrderInLocalStorage() {
    localStorage.setItem('current_order_form_values', JSON.stringify(this.generateOrderObject()));
  }

  loadOrderFromLocalStorage() {
    let orderObject = JSON.parse(localStorage.getItem('current_order_form_values') as string);
    if(orderObject) {
      this.initialInfoForm.setValue(orderObject.initialInfo);
      for(let foodstuff of orderObject.foodstuffs) {
        let foodstuff_type = foodstuff.type;
        delete foodstuff.type;
        if(typeof(this.currentOrderByTypes[foodstuff_type]) === "undefined") {
          this.currentOrderByTypes[foodstuff_type] = [];
        }
        this.currentOrderByTypes[foodstuff_type][foodstuff.name] = foodstuff;
      }
    }
    this.saveOrderInLocalStorage();
  }

  resetOrder() {
    this.money_types_list.forEach((money_type) => {
      this.currentOrderPaidByTypes[money_type] = 0;
    });
    this.currentOrderPaid = 0;
    this.currentOrderByTypes = [];
    this.initialInfoForm.reset();
    localStorage.removeItem('current_order_form_values');
  }

  sendOrder() {
    let orderObject = this.generateOrderObject();
    orderObject.foodstuffs.map((foodstuff: any) => {
      foodstuff.id = this.data.getFoodstuffIdByName(foodstuff.name);
      delete foodstuff.price;
      delete foodstuff.name;
      delete foodstuff.type;
    });
    console.log(orderObject);
    this.resetOrder();
    this.api.post("orders", {
      customer: orderObject.initialInfo.customer,
      places: orderObject.initialInfo.places,
      tableNumber: orderObject.initialInfo.tableNumber,
      waiter: orderObject.initialInfo.waiter,
      notes: orderObject.initialInfo.notes,
      takeAway: orderObject.initialInfo.takeAway,
      foodstuffs: orderObject.foodstuffs
    }).then((response: any) => {
      console.log(response);
      /*
      iziToast.success({
        title: 'Operazione avvenuta con successo',
        message: `L'ordine numero ${response.order.id} è stato inviato con successo.`
      });
      */
    }).catch((error: any) => {
      console.error(error);
      /*
      iziToast.error({
        title: 'Errore',
        message: 'Si è verificato un errore non atteso. Riprovare più tardi.',
      });
      */ 
    });

    localStorage.removeItem('current_order_form_values');
  }

  openNewWaiterModal() {
    this.modalService.open(ModalNewWaiterComponent);
  }

  openNewFoodstuffModal() {
    this.modalService.open(ModalNewFoodstuffComponent);
  }

  openNewFoodstuffTypeModal() {
    this.modalService.open(ModalNewFoodstuffTypeComponent);
  }

  openNotesModal(notesModal: TemplateRef<any>, foodstuff_type_name: string, foodstuff_name: string) {
    this.notesTextareaSelectedFoodstuff = foodstuff_name;
    this.notesTextareaSelectedFoodstuffType = foodstuff_type_name;
    this.notesTextareaContent = this.currentOrderByTypes[foodstuff_type_name][foodstuff_name]["notes"];
    this.modalService.open(notesModal);
  }

  notesChange(e: Event) {
    this.currentOrderByTypes[this.notesTextareaSelectedFoodstuffType][this.notesTextareaSelectedFoodstuff]["notes"] = this.notesTextareaContent;
    this.saveOrderInLocalStorage();
  }
}
