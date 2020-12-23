import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common'
import { MethodServices } from "../../services/method-services";
import { ROUTES } from "../components/sidebar/sidebar.component"
import {type} from "os";

@Injectable({providedIn:'root'})

export class MenuGuard implements CanActivate {

    urlEndParse:string;

    constructor(private router:Router
        ,private location:Location
        ,private methodServices:MethodServices){}

    canActivate(route:ActivatedRouteSnapshot,
                state:RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean
    {
        var url = state.url
        var urlEnd = url.lastIndexOf("/") + 1
        this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()
        //remove -
        this.urlEndParse = this.urlEndParse.replace('-',' ')

        //No Get QUery Params
        var urlQuestion = this.urlEndParse.indexOf("?")
        if (urlQuestion != -1){
            var urlFinal = this.urlEndParse.slice(0,urlQuestion)
            this.urlEndParse = urlFinal
        }

        if (typeof(this.methodServices.seasonKey) == "undefined" || typeof(this.methodServices.authenticalKey) == "undefined") {
            this.methodServices.readLocalStorageKey()
        }

        // else{
        if (localStorage.getItem(this.methodServices.seasonKey) == null)
        {
            this.router.navigate(['/'])
            // return true;
        }
        else{
            let urlTarget = this.urlEndParse.toLowerCase().replace(" ", "-");
            if (this.urlEndParse.toLowerCase() == "dashboards")
                return true
            else if (urlTarget == "employee-terms"
                || urlTarget == "employee-payment-method"
                || urlTarget == "employee-family-list"
                || urlTarget == "employee-education"
                || urlTarget == "employee-supervisor"
                || urlTarget == "employee-payroll") {
                return false
            }
            else {
                return this.methodServices.permissionMenu(urlTarget)
            }
        }


        // alert(this.urlEndParse)
        // if (this.urlEndParse == 'LOGIN'){
        // if (localStorage.getItem('Token') != null){
        //         this.router.navigate(['/dashboards/hr'])
        //         return false;
        //     }
        //     else{
        //       this.router.navigate(['/'])
        //         return true;
        //     }
        // }
        // this.router.navigate(['/'])
        // return true

        // }
    }

}
