import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ComponentsModule } from 'src/app/components/components.module';

import {BsDropdownModule, ModalModule} from "ngx-bootstrap";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PayrollRoutes } from './payroll.routing';
import { RouterModule } from '@angular/router';

// import { PdfViewerModule } from 'ng2-pdf-viewer';

import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { NgHttpLoaderModule } from 'ng-http-loader'
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { ToastrModule } from "ngx-toastr";

import { PayrollElementClassificationComponent } from "../payroll/payroll-element-classification/payroll-element-classification.component";
import { PayrollElementClassificationFormComponent } from "../payroll/payroll-element-classification-form/payroll-element-classification-form.component";
import { PayrollElementComponent } from "../payroll/payroll-element/payroll-element.component";
import { PayrollElementFormComponent } from "../payroll/payroll-element-form/payroll-element-form.component";
import { PayrollBalanceComponent } from "../payroll/payroll-balance/payroll-balance.component";
import { PayrollBalanceFormComponent } from "../payroll/payroll-balance-form/payroll-balance-form.component";
import { PayrollRuntypeComponent} from "./payroll-runtype/payroll-runtype.component";
import { PayrollRuntypeFormComponent } from "./payroll-runtype-form/payroll-runtype-form.component";
import { PayrollGroupsComponent} from "./payroll-groups/payroll-groups.component";
import { PayrollGroupsFormComponent} from "./payroll-groups-form/payroll-groups-form.component";
import { PayrollProcessComponent} from "./payroll-process/payroll-process.component";
import { PayrollProcessFormComponent} from "./payroll-process-form/payroll-process-form.component";
import {MenuGuard} from "../../services/menu-guard";
import { diffrentDate } from "../../validation-global/diffrent-date";

import { NgSelect2Module } from 'ng-select2' 
import { NgxSkeletonLoaderModule, NgxSkeletonLoaderComponent } from 'ngx-skeleton-loader'

import { GlobalModule } from 'src/app/global/global.module';

// import { GlobalBreadcrumbComponent } from 'src/app/global/breadcrumb-component/breadcrumb-component'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
    declarations:[
                PayrollElementClassificationComponent, PayrollElementClassificationFormComponent,
                PayrollElementComponent, PayrollElementFormComponent, 
                PayrollBalanceComponent, PayrollBalanceFormComponent,
                PayrollRuntypeComponent, PayrollRuntypeFormComponent,
                PayrollGroupsComponent, PayrollGroupsFormComponent,
                PayrollProcessComponent,PayrollProcessFormComponent],
    imports:[
        GlobalModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        NgxSkeletonLoaderModule.forRoot(),
        // PdfViewerModule,
        NgxDatatableModule,
        ToastrModule.forRoot(),
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        TooltipModule.forRoot(),
        NgHttpLoaderModule.forRoot(),
        RouterModule.forChild(PayrollRoutes),
        DatepickerModule,
        BsDatepickerModule.forRoot(),
        ModalModule.forRoot(),
        NgSelect2Module
    ],
    exports:[RouterModule],
    providers: [diffrentDate]
})

export class PayrollModule {}