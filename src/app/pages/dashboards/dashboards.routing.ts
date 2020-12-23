import { Routes } from "@angular/router";

import { DashboardHrComponent } from "../dashboards/dashboard-hr/dashboard-hr.component";
import { DashboardTimeComponent } from "../dashboards/dashboard-time/dashboard-time.component";
import { DashboardPayrollComponent } from "./dashboard-payroll/dashboard-payroll.component";
import { AlternativeComponent } from "./alternative/alternative.component";

import { MenuGuard } from '../../services/menu-guard'

export const DashboardsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "time",
        canActivate:[MenuGuard],
        component: DashboardTimeComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "hr",
        canActivate:[MenuGuard],
        component: DashboardHrComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "payroll",
        canActivate:[MenuGuard],
        component: DashboardPayrollComponent
      }
    ]
  },
  {
    path: "",
    children: [
      {
        path: "alternative",
        component: AlternativeComponent
      }
    ]
  }
];
