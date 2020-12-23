import { NgModule } from '@angular/core'
import { CommonModule, CurrencyPipe, APP_BASE_HREF } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ComponentsModule } from 'src/app/components/components.module';

import { BsDropdownModule } from "ngx-bootstrap";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { EmployeeRoutes } from './employee.routing';
import { RouterModule } from '@angular/router';
import { NgSelect2Module } from "ng-select2";

import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { NgHttpLoaderModule } from 'ng-http-loader'
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker'

import { EmployeeTableComponent } from "./employee-table/employee-table.component";
import { EmployeePersonalComponent } from "../employee/employee-personal/employee-personal.component";
import { EmployeeEmploymentComponent } from "../employee/employee-employment/employee-employment.component";
import { EmployeeEmploymentTermsComponent } from "../employee/employee-employment-terms/employee-employment-terms.component";
import { EmployeeEmploymentAddressComponent } from "../employee/employee-address/employee-address.component";
import { EmployeeAssignmentComponent } from "../employee/employee-assignment/employee-assignment.component";
import { EmployeeSupervisorComponent } from "../employee/employee-supervisor/employee-supervisor.component";
import { EmployeePayrollComponent } from "../employee/employee-payroll/employee-payroll.component";
import { EmployeePaymentMethodComponent } from "../employee/employee-payment-method/employee-payment-method.component";
import { EmployeeElementEntriesComponent } from "../employee/employee-element-entries/employee-element-entries.component";
import { EmployeeElementEntriesFormComponent } from "../employee/employee-element-entries-form/employee-element-entries-form.component";
import { EmployeeFamilyListComponent } from "../employee/employee-family-list/employee-family-list.component";
import { EmployeeFamilyFormComponent } from "../employee/employee-family-form/employee-family-form.component";
import { EmployeeEducationComponent } from "../employee/employee-education/employee-education.component";
import { EmployeeEducationFormComponent } from "../employee/employee-education-form/employee-education-form.component";
import { ErrorPageComponent } from "src/app/error/error-page.component";
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

// import { GlobalBreadcrumbComponent } from 'src/app/global/breadcrumb-component/breadcrumb-component'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { GlobalModule } from 'src/app/global/global.module';

@NgModule({
    declarations:[
            EmployeeTableComponent, EmployeePersonalComponent, EmployeeEmploymentComponent,
            EmployeeEmploymentTermsComponent,EmployeeEmploymentAddressComponent,EmployeeAssignmentComponent,
            EmployeeSupervisorComponent,EmployeePayrollComponent,EmployeePaymentMethodComponent,
            EmployeeElementEntriesComponent,EmployeeElementEntriesFormComponent,EmployeeFamilyListComponent,EmployeeEducationComponent,
            EmployeeFamilyFormComponent,EmployeeEducationFormComponent,ErrorPageComponent],
    imports:[
        GlobalModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        NgxSkeletonLoaderModule.forRoot(),
        NgxDatatableModule,
        NgSelect2Module,
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        TooltipModule.forRoot(),
        NgHttpLoaderModule.forRoot(),
        RouterModule.forChild(EmployeeRoutes),
        DatepickerModule,
        BsDatepickerModule.forRoot()
    ],
    exports:[RouterModule,EmployeeTableComponent],
    providers:[CurrencyPipe]
})

export class EmployeeModule {}