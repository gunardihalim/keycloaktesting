import { Component, OnInit, ViewChild } from "@angular/core";
// import { environment } from "../../../../environments/environment";
import { MethodServices } from "../../../../services/method-services";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { FormsModule,ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app.login",
  templateUrl: "login.component.html",
  styleUrls: ["login.component.scss"]
})
export class LoginComponent implements OnInit {
  test: Date = new Date();

  focus;
  focus1;
  loginFault = false;
  error_code: any;
  error_msg: any;
  @ViewChild("f") f: NgForm;
  loading_progress = false;
  checked:boolean=false;
  modelUsername:string = '';
  modelPassword:string = '';

  constructor(private methodServices: MethodServices, private router: Router) {}

  ngOnInit() {}

  login_page() {
    this.methodServices.processToken(
      this.checked,
      this.f.value.username,
      this.f.value.password,
      () => {
        this.loading_progress = true;
        setTimeout(() => {
          if (this.methodServices.token_status) {
            this.loginFault = false;
            this.router.navigate(["dashboards/dashboard"]);
            this.loading_progress = false
          } else {
            this.loading_progress = false
            this.loginFault = true;
            this.error_code = this.methodServices.error_code;
            if (this.error_code == 401) {
              this.router.navigate(["/"]);
            }
            this.error_msg = this.methodServices.error_msg; //400 or 500
          }
        }, 1000);
      }
    );
  }

  clear_fault() {
    if (this.f.value.username == "" && this.f.value.password == "") {
      this.loginFault = false;
    }
  }
}
