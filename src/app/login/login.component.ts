import { Component, OnInit, ViewChild } from '@angular/core';
import { MethodServices } from 'src/services/method-services';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { Location } from '@angular/common'
import * as CryptoJS from 'crypto-js'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment'
import { KeycloakService } from 'keycloak-angular';

// import { KeycloakService, KeycloakOptions } from 'keycloak-angular'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  test: Date = new Date();
  focus;
  focus1;
  loginFault = false;
  error_code: any;
  error_msg: any;
  access_token:any;
  @ViewChild("f") f: NgForm;
  loading_progress = false;
  checked:boolean=false;
  checked_status:boolean= false;
  user:string;
  pass:string;
  title:string;
  showPass:boolean = false;

  constructor(private location:Location,private methodServices: MethodServices, private router: Router,
          private http:HttpClient,
          private keycloakServices:KeycloakService) {}
  
  logOuts(){
      this.keycloakServices.logout("http://localhost:4200")
  }

  ngOnInit() {
    this.checked_status = false;
    if (localStorage.getItem('ZEU@AL!') !== null) {
      // this.user = window.atob(localStorage.getItem('ZEU@AL!'))
      this.user = CryptoJS.AES.decrypt(localStorage.getItem('ZEU@AL!'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
      // alert(window.atob(localStorage.getItem('ZEU@AL!'))  )
      // this.checked = true;
      this.checked_status = true
    }
    if (localStorage.getItem('SPS!#WU') !== null) {
      // this.pass = window.atob(localStorage.getItem('SPS!#WU'))
      this.pass = CryptoJS.AES.decrypt(localStorage.getItem('SPS!#WU'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
    }
    this.title = this.location.prepareExternalUrl(this.location.path())
  }

  login_page() {

    // var dataBody =
    // // "username=" + username + "&password=" + password;
    // {
    //   "username":this.f.value.username,
    //   "password":this.f.value.password
    //   }
    //   // this.http.post(environment.baseUrl + "/oauth/token?grant_type=password",dataBody,{
          
    //   this.http.post(environment.baseUrl + "/public/api/login/hrcentral",dataBody,{
    //   headers: {
    //         Authorization: environment.basicAuthentication,
    //         "Content-Type": "application/json"
    //         // "Content-Type": "application/x-www-form-urlencoded"
    //         }
    //   })
    //   .subscribe(hasil => {
    //                 this.methodServices.getToken(this.checked_status,hasil,this.f.value.username,this.f.value.password);
    //                 // callback(this.error_msg,this.access_token)
    //                 },
    //             err => {
    //                     this.methodServices.getError(err,err.status);
    //                     // callback(this.error_msg,this.access_token)
    //                   }
    //               )

      this.methodServices.processToken(
        this.checked_status,
        this.f.value.username,
        this.f.value.password,
            (error_msg_res,access_token_res)=>{
                  this.error_msg = error_msg_res
                  this.access_token = access_token_res
            }
        )
  }

  clear_fault() {
    if (this.f.value.username == "" && this.f.value.password == "") {
      this.loginFault = false;
    }
  }
  togglePassword() {
    this.showPass = !this.showPass;
  }
}
