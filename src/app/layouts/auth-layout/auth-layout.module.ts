import { NgModule, APP_INITIALIZER } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthLayoutRoutes } from "./auth-layout.routing";

import { LoginComponent } from "../../login/login.component";
import { PricingComponent } from "../../pages/examples/pricing/pricing.component";
import { LockComponent } from "../../pages/examples/lock/lock.component";
import { RegisterComponent } from "../../pages/examples/register/register.component";
import { NgHttpLoaderModule, Spinkit } from "ng-http-loader"
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
// import { initializer } from 'src/appInit';


// import { KeycloakAngularModule } from 'keycloak-angular'
  
function initializer(keycloak: KeycloakService){
  return () => 
    keycloak.init({
      config:{
        url:'https://keycloak-dev.gitsolutions.id/auth',
        realm:'helloworldrealm',
        clientId:'helloworld-client'
      }
  })
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AuthLayoutRoutes),
    FormsModule,
    NgHttpLoaderModule.forRoot(),
    KeycloakAngularModule
  ],
  declarations: [
    LoginComponent,
    PricingComponent,
    LockComponent,
    RegisterComponent
  ],
  providers:[
    // KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory:initializer,
      deps: [KeycloakService],
      multi:true,
    }
  ]
})
export class AuthLayoutModule {}
