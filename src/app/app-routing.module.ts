import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { ModalModule } from 'ngx-bootstrap/modal'
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { PresentationComponent } from "./pages/presentation/presentation.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { NotificationsComponent } from 'src/app/pages/components/notifications/notifications.component'

import { AuthGuard } from './services/authguard'
import { AuthGuardLogin } from './services/authguard-login'
import { MenuGuard } from "./services/menu-guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "/login",
    pathMatch: "full"
  },
  // {
  //   path:"employee",
  //   children:[{
  //     path:"personal",
  //     component: PresentationComponent
  //   }]
  // },
  {
    path: "presentation",
    // canActivate:[AuthGuard],
    component: PresentationComponent
  },
  // {
  //   path: "notifikasi",
  //   component: NotificationsComponent
  // },
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate:[AuthGuard],
    children: [
      {
        path: "dashboards",
        canActivate:[MenuGuard],
        loadChildren: "./pages/dashboards/dashboards.module#DashboardsModule"
      },
      {
        path: "employee",
        loadChildren: "./pages/employee/employee.module#EmployeeModule"
      },
      {
        path: "work-structure",
        loadChildren: "./pages/work-structure/work-structure.module#WorkStructureModule"
        // loadChildren: "./pages/work-structure/work-structure.module#WorkStructureModule"
      },
      {
        path: "payroll",
        loadChildren: "./pages/payroll/payroll.module#PayrollModule"
      },
      // {
      //   path: "components",
      //   loadChildren: "./pages/components/components.module#ComponentsModule"
      // },
      // {
      //   path: "forms",
      //   loadChildren: "./pages/forms/forms.module#FormsModules"
      // },
      {
        path: "tables",
        loadChildren: "./pages/tables/tables.module#TablesModule"
      },
      {
        path: "maps",
        loadChildren: "./pages/maps/maps.module#MapsModule"
      },
      {
        path: "widgets",
        loadChildren: "./pages/widgets/widgets.module#WidgetsModule"
      },
      {
        path: "charts",
        loadChildren: "./pages/charts/charts.module#ChartsModule"
      },
      {
        path: "calendar",
        loadChildren: "./pages/calendar/calendar.module#CalendarModule"
      },
      {
        path: "examples",
        loadChildren: "./pages/examples/examples.module#ExamplesModule"
      }
    ]
  },
  {
    path: "",
    component: AuthLayoutComponent,
    canActivate:[AuthGuardLogin],
    children: [
      {
        path: "",
        loadChildren:
          "./layouts/auth-layout/auth-layout.module#AuthLayoutModule"
      }
    ]
  },
  // { 
  //   path: "**",
  //   redirectTo: "/login"
  // }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(routes,{
      useHash:true
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
