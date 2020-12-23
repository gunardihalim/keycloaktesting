import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common'
import {MethodServices} from "../../services/method-services";

@Injectable({providedIn:'root'})

export class AuthGuardLogin implements CanActivate {

    urlEndParse:string;

    constructor(private router:Router,private location:Location, private methodServices:MethodServices){
    }
    
    canActivate(route:ActivatedRouteSnapshot,
                state:RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean
    {
        if (this.methodServices.seasonKey == null) {
            this.methodServices.readLocalStorageKey()
        }
        // if (this.methodServices.seasonKey != null) {
        if (localStorage.getItem(this.methodServices.seasonKey) !== null)
        {
            this.router.navigate(['/dashboards'])
        }
        else{
            return true
        }
        // }
    }
}
