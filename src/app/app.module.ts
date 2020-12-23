import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms'
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { BsDropdownModule } from "ngx-bootstrap";
import { ToastrModule } from "ngx-toastr";
import { TagInputModule } from "ngx-chips";
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppComponent } from "./app.component";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationModule } from "./pages/presentation/presentation.module";

import { AppRoutingModule } from "./app-routing.module";
import { ComponentsModule } from "./components/components.module";
import { NgHttpLoaderModule } from "ng-http-loader";

import { NgSelect2Module } from 'ng-select2' 

import { GlobalModule } from 'src/app/global/global.module';
import { CommonModule } from '@angular/common';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular'
// import { initializer } from 'src/appInit';

// import { HttpClientJsonpModule } from '@angular/common/http'

// import { LoginComponent } from "./pages/authorization/login/login.component";

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
    BrowserAnimationsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    AppRoutingModule,
    ToastrModule.forRoot(),
    CollapseModule.forRoot(),
    TagInputModule,
    PresentationModule,
    NgHttpLoaderModule.forRoot(),
    NgSelect2Module,
    GlobalModule,
    KeycloakAngularModule
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  exports:[FormsModule],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory:initializer,
      deps: [KeycloakService],
      multi:true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
