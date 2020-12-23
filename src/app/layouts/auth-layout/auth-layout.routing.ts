import { Routes } from "@angular/router";

import { LoginComponent } from "../../login/login.component";
import { PricingComponent } from "../../pages/examples/pricing/pricing.component";
import { LockComponent } from "../../pages/examples/lock/lock.component";
import { RegisterComponent } from "../../pages/examples/register/register.component";
import { PresentationComponent } from "../../pages/presentation/presentation.component";

import { AuthGuardKeycloak } from 'src/app/services/authguardKeycloak'
import { authCodeReader } from 'src/assets/authcodeReader/authcodeReader'

export const AuthLayoutRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "login",
        canActivate:[AuthGuardKeycloak],
        component: LoginComponent
        // component:authCodeReader
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "lock",
        component: LockComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "register",
        component: RegisterComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "pricing",
        component: PricingComponent
      }
    ]
  },
];
