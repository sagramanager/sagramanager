import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, LoginResponse } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public loading = false;
  public newUserRegistrationRequired = false;

  public loginResponse: LoginResponse = {loginOk: false, message: ''};
  public username = "";
  public name = "";
  public password = "";
  private redirectParamsList: string[] = [];
  private redirectParam = "";
  private extraParam = "";
  @ViewChild("inputPassword") public inputPassword!: ElementRef;

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.route.params.subscribe((params) => {
      if (params.redirect) {
        this.redirectParam = params.redirect;
      }
      if (params.extraParam) {
        this.extraParam = params.extraParam;
      }
    });
    console.log(this.redirectParam);
    console.log(this.extraParam);
    if(this.redirectParam === "") this.router.navigate(['/']);

    this.redirectParamsList = [this.redirectParam];
    if(this.extraParam !== "") this.redirectParamsList.push(this.extraParam);

    if(this.authService.isAuthenticated()) {
      this.router.navigate(this.redirectParamsList);
    }
    this.authService.checkIfUsersListEmpty().then((response: boolean) => {
      console.log("usersListEmpty", response);
      this.newUserRegistrationRequired = response;
    });
  }
  
  loginOrRegister(): void {
    if(this.newUserRegistrationRequired) {
      this.register();
    } else {
      this.login();
    }
  }

  login(): void {
    this.loading = true;
    this.authService.login(this.username, this.password).then((response: LoginResponse) => {
      this.loginResponse = response;
      this.loading = false;
      console.log(response);
      if (response.loginOk === true) {
        this.router.navigate(this.redirectParamsList);
      }
    });
  }

  register(): void {
    this.loading = true;
    this.authService.register(this.username, this.name, this.password).then((response: LoginResponse) => {
      this.loginResponse = response;
      this.loading = false;
      console.log(response);
      if (response.loginOk === true) {
        this.router.navigate(this.redirectParamsList);
      }
    });
  }
}