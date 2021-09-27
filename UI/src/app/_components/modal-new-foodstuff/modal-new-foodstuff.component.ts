import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { DataLoaderService } from 'src/app/_services/data-loader.service';
import { ModalNewFoodstuffTypeComponent } from '../modal-new-foodstuff-type/modal-new-foodstuff-type.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'modal-new-foodstuff',
  templateUrl:'./modal.component.html'
})
export class ModalNewFoodstuffComponent implements OnInit {
  newFoodstuffForm = new FormGroup({
    name: new FormControl('', Validators.required),
    shortName: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl('', Validators.required),
    foodstuffTypeId: new FormControl('', Validators.required)
  });

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private api: ApiClientService,
    public data: DataLoaderService
  ) {}

  ngOnInit() {}

  saveFoodstuff() {
    console.log(this.newFoodstuffForm, this.newFoodstuffForm.valid);
    if(this.newFoodstuffForm.valid) {
      console.log(this.newFoodstuffForm.value);
      this.api.post("foodstuffs", this.newFoodstuffForm.value).then((response: any) => {
        console.log(response);
        /*
        iziToast.success({
          title: 'Operazione avvenuta con successo',
          message: `Tipologia ${response.foodstuff.name} aggiunta all'elenco.`
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

  addFoodstuffType() {
    this.modalService.open(ModalNewFoodstuffTypeComponent);
  }
}