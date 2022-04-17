import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiClientService } from '../../_services/api-client.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'modal-new-waiter',
  templateUrl:'./modal.component.html'
})
export class ModalNewWaiterComponent implements OnInit {
  newWaiterForm = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  constructor(public activeModal: NgbActiveModal, private api: ApiClientService) {}

  ngOnInit() {}

  saveWaiter() {
    console.log(this.newWaiterForm, this.newWaiterForm.valid);
    if(this.newWaiterForm.valid) {
      console.log(this.newWaiterForm.value);
      this.api.post("waiters", this.newWaiterForm.value).then((response: any) => {
        console.log(response);
        /*
        iziToast.success({
          title: 'Operazione avvenuta con successo',
          message: `Cameriere ${response.waiter.name} aggiunto all'elenco.`
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