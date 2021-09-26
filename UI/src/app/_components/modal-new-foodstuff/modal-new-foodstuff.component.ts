import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { ModalNewFoodstuffTypeComponent } from '../modal-new-foodstuff-type/modal-new-foodstuff-type.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'modal-new-foodstuff',
  templateUrl:'./modal.component.html'
})
export class ModalNewFoodstuffComponent implements OnInit {
  newFoodstuffForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private api: ApiClientService) {}

  ngOnInit() {}

  saveFoodstuff() {
    console.log(this.newFoodstuffForm);
  }

  addFoodstuffType() {
    this.modalService.open(ModalNewFoodstuffTypeComponent);
  }
}