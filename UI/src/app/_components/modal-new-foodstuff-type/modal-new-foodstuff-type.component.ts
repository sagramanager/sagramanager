import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'modal-new-foodstuff-type',
  templateUrl:'./modal.component.html'
})
export class ModalNewFoodstuffTypeComponent implements OnInit {
  newFoodstuffTypeForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(public activeModal: NgbActiveModal, private api: ApiClientService) {}

  ngOnInit() {}

  saveFoodstuffType() {
    console.log(this.newFoodstuffTypeForm, this.newFoodstuffTypeForm.valid);
    if(this.newFoodstuffTypeForm.valid) {
      console.log(this.newFoodstuffTypeForm.value);
      this.api.post("foodstuffTypes", this.newFoodstuffTypeForm.value).then((response: any) => {
        console.log(response);
        /*
        iziToast.success({
          title: 'Operazione avvenuta con successo',
          message: `Tipologia ${response.foodstuffType.name} aggiunta all'elenco.`
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
      this.activeModal.close();
    }
  }
}