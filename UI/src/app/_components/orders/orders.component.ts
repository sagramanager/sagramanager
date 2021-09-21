import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

class Hero {

  constructor(
    public id?: number,
    public name?: string,
    public power?: string,
    public alterEgo?: string,
    public email?: string) {

  }

}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  heroForm: FormGroup;
  model: Hero; 
  submittedModel: Hero = undefined as unknown as Hero; 
  powers: string[];
  submitted: boolean = false;
  
  constructor(private formBuilder: FormBuilder) {
      this.model = new Hero(18, 'Dr IQ', 'Really Smart', 'Chuck Overstreet', 'iq@superhero.com');
      
      this.powers = ['Really Smart', 'Super Flexible', 
                     'Hypersound', 'Weather Changer'];                     
                     
      this.heroForm = this.formBuilder.group({
        name:     [this.model.name, Validators.required],
        alterEgo: [this.model.alterEgo, Validators.required],
        email:    [this.model.email, Validators.required],
        power:    [this.model.power, Validators.required]
      });
  }

  ngOnInit() {
  }

  onSubmit({ value, valid }: { value: Hero, valid: boolean }) {
    this.submitted = true;
    this.submittedModel = value;
  }
}
