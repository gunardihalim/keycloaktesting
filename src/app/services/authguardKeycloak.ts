import { Injectable } from "@angular/core";
import { KeycloakAuthGuard, KeycloakService, KeycloakOptions } from 'keycloak-angular';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
    providedIn:'root'
})
export class AuthGuardKeycloak extends KeycloakAuthGuard {
    constructor(protected readonly router:Router, 
                protected readonly keycloakAngular: KeycloakService){
        super(router,keycloakAngular)
    }
    // public async isAccessAllowed(route:ActivatedRouteSnapshot, state:RouterStateSnapshot):Promise<boolean | UrlTree> {
    public async isAccessAllowed(route:ActivatedRouteSnapshot, state:RouterStateSnapshot){
        // https://keycloak-dev.gitsolutions.id/auth/realms/helloworldrealm/
        // protocol/openid-connect/auth?client_id=helloworld-client&response_type=
        // code&scope=openid%20profile&redirect_uri=
        // http://localhost:8181/authcodeReader.html

        if (!this.authenticated){
            await this.keycloakAngular.login({
                redirectUri:window.location.origin + state.url
            })
        }

        const requiredRoles = route.data.roles;

        if (!(requiredRoles instanceof Array) || requiredRoles.length === 0){
            return true;
        }
        return requiredRoles.every((role) => this.roles.includes(role));



        // return new Promise(async(resolve,reject) => {
        //     if (!this.authenticated){
        //         console.log(this.keycloakAngular)
        //         this.keycloakAngular.login({redirectUri:window.location.origin + state.url});
        //         // this.keycloakAngular.login({redirectUri: 'http://localhost:8181/authcodeReader.html'});
        //         resolve(false);
        //         return;
        //     }
            
        //     const requiredRoles = route.data.roles;
        //     let granted: boolean = false;
        //     if (!requiredRoles || requiredRoles.length === 0){
        //         granted = true;
        //     }
        //     else {
        //         for (const requiredRole of requiredRoles){
        //             if (this.roles.indexOf(requiredRole) > -1){
        //                 granted = true;
        //                 break;
        //             }
        //         }
        //     }
            
        //     if (granted === false){
        //         resolve(granted)
        //     }
        //     resolve(granted)
        // })        
    }
}