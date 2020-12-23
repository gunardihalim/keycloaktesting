import { Injectable, HostListener } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface canComponentDeactive {
    canLeave:()=>Observable<boolean>|Promise<boolean>|boolean
}

@Injectable({providedIn:'root'})

export class deactiveGuard implements CanDeactivate<canComponentDeactive> {
    // @HostListener('window:beforeunload',['$event'])
    canDeactivate(component:canComponentDeactive){
        if (component.canLeave){
            return component.canLeave();
        }
        // return true
    }
        
}
