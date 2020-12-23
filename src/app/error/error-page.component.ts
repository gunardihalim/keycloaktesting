import { Component, OnInit, ViewChild } from '@angular/core';
import { MethodServices } from 'src/services/method-services';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { promise } from 'protractor';
import { Location } from '@angular/common'

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
//   styleUrls: ['./err-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

    error_page_code:string;
    error_page_msg:string;

  constructor(private location:Location,private methodServices: MethodServices, private router: Router) {}

  ngOnInit() {
        this.error_page_code = this.methodServices.error_page_code
        if(this.error_page_code == '500'){
            this.error_page_msg = 'Could not process this operation. Please contact Admin.'
        }
        else
        {
            this.error_page_msg = 'Please Check your connection.'
        }
  }
}
