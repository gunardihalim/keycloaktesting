import { Routes } from '@angular/router'
import { EmployeeTableComponent } from "../employee/employee-table/employee-table.component";
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
import { deactiveGuard } from 'src/app/services/deactivate-guard';
import {MenuGuard} from "../../services/menu-guard";

// import { FormsComponentsComponent } from "../forms/components/components.component"

export const EmployeeRoutes : Routes = [
    {
        path:"",
        component:EmployeeTableComponent,
        children:[
            {path:"personal",
            component:EmployeePersonalComponent,
            children:[{
                path:'error',
                component:ErrorPageComponent
            }]
            },
            {path:"employment",
            component:EmployeeEmploymentComponent,
            children:[
                {
                path:'error',
                component:ErrorPageComponent
                }]
            },
            {path:"terms",
            component:EmployeeEmploymentTermsComponent,
            children:[{
                path:'error',
                component:ErrorPageComponent
            }]
            },
            {path:"address",
            component:EmployeeEmploymentAddressComponent,
            children:[{
                path:'error',
                component:ErrorPageComponent
            }]},
            {path:"assignment",
            component:EmployeeAssignmentComponent,
            children:[{
                path:'error',
                component:ErrorPageComponent
            }]},
            {path:"supervisor",
            component:EmployeeSupervisorComponent,
            children:[{
                path:'error',
                component:ErrorPageComponent
            }]},
            {path:"payroll",
            component:EmployeePayrollComponent},
            {path:"payment-method",
            component:EmployeePaymentMethodComponent},
            {path:"element-entries",
            component:EmployeeElementEntriesComponent,
            canActivate:[MenuGuard],
            children:[
                {
                    path:'element-entries-form',
                    canDeactivate:[deactiveGuard],
                    component:EmployeeElementEntriesFormComponent
                },
                {
                path:'error',
                component:ErrorPageComponent
                }]
            },    
            {path:"family-list",
            component:EmployeeFamilyListComponent,
            children:[
                {
                    path:"family-form",
                    component:EmployeeFamilyFormComponent,
                },
                {
                    path:'error',
                    component:ErrorPageComponent
                }
            ]},
            {path:"education",
            component:EmployeeEducationComponent,
            children:[
                {
                    path:'education-form',
                    component:EmployeeEducationFormComponent
                },
                {
                    path:'error',
                    component:ErrorPageComponent
                }
            ]
            }
        ]   
    }
]