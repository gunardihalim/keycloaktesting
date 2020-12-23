import { Component, OnInit } from "@angular/core";
import { KeycloakService } from 'keycloak-angular';

@Component({
    selector:"auth-code-reader",
    templateUrl:"authcodeReader.html"
})

export class authCodeReader implements OnInit {
    constructor(private keycloakService:KeycloakService){
        console.log(keycloakService.getKeycloakInstance())
        alert('berhasil authcode')
    }
    ngOnInit(){
        console.log(this.keycloakService.getKeycloakInstance())
    }
    logOut(){
        this.keycloakService.logout('https://localhost:4200')
    }
}