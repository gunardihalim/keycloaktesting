import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { ComponentsModule } from "../../components/components.module";

import { BsDropdownModule } from "ngx-bootstrap";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { DashboardHrComponent } from "./dashboard-hr/dashboard-hr.component";
import { DashboardTimeComponent } from "./dashboard-time/dashboard-time.component";
import { DashboardPayrollComponent } from "./dashboard-payroll/dashboard-payroll.component";
import { AlternativeComponent } from "./alternative/alternative.component";

import { RouterModule } from "@angular/router";
import { DashboardsRoutes } from "./dashboards.routing";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader"

@NgModule({
  declarations: [DashboardHrComponent, DashboardTimeComponent, DashboardPayrollComponent, AlternativeComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ProgressbarModule.forRoot(),
    TooltipModule.forRoot(),
    NgxSkeletonLoaderModule.forRoot(),
    RouterModule.forChild(DashboardsRoutes)
  ],
  exports: [DashboardHrComponent,DashboardTimeComponent,  AlternativeComponent]
})
export class DashboardsModule {}
