import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.css']
})
export class NewOrderComponent implements OnInit {

  userForm: any;
  constructor() {
  }

  ngOnInit(): void {
  }

  onSubmit(form: any): void {
    console.log(this.userForm.value);
  }

}
