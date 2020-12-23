import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ComponentsModule } from 'src/app/components/components.module';

import { BsDropdownModule } from "ngx-bootstrap";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { WorkStructureRoutes } from './work-structure.routing';
import { RouterModule } from '@angular/router';

import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { NgHttpLoaderModule } from 'ng-http-loader'
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker'

import { WorkStructurePositionListComponent } from "./work-structure-position-list/work-structure-position-list.component";
import { WorkStructurePositionFormComponent } from "./work-structure-position-form/work-structure-position-form.component";

import { WorkStructureOrganizationListComponent } from "./work-structure-organization-list/work-structure-organization-list.component";
import { WorkStructureOrganizationFormComponent } from "./work-structure-organization-form/work-structure-organization-form.component";

import { WorkStructureJobListComponent } from "./work-structure-job-list/work-structure-job-list.component";
import { WorkStructureJobFormComponent } from "./work-structure-job-form/work-structure-job-form.component";

import { WorkStructureGradeListComponent } from "./work-structure-grade-list/work-structure-grade-list.component";
import { WorkStructureGradeFormComponent } from "./work-structure-grade-form/work-structure-grade-form.component";

import { WorkStructurePeopleGroupListComponent } from "./work-structure-peoplegroup-list/work-structure-peoplegroup-list.component";
import { WorkStructurePeopleGroupFormComponent } from "./work-structure-peoplegroup-form/work-structure-peoplegroup-form.component";

import { WorkStructureLocationListComponent } from "./work-structure-location-list/work-structure-location-list.component";
import { WorkStructureLocationFormComponent } from "./work-structure-location-form/work-structure-location-form.component";
import { BreadcrumbComponent } from 'src/app/components/breadcrumb/breadcrumb.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { GlobalModule } from 'src/app/global/global.module'

@NgModule({
    declarations:[WorkStructurePositionListComponent,WorkStructurePositionFormComponent,
        WorkStructureOrganizationListComponent,WorkStructureOrganizationFormComponent,
        WorkStructureJobListComponent,WorkStructureJobFormComponent,
        WorkStructureGradeListComponent,WorkStructureGradeFormComponent,
        WorkStructurePeopleGroupListComponent,WorkStructurePeopleGroupFormComponent,
        WorkStructureLocationListComponent,WorkStructureLocationFormComponent, BreadcrumbComponent],
    imports:[
        GlobalModule,
        ComponentsModule,
        CommonModule,
        FormsModule,
        NgxSkeletonLoaderModule.forRoot(),
        NgxDatatableModule,
        BsDropdownModule.forRoot(),
        ProgressbarModule.forRoot(),
        TooltipModule.forRoot(),
        NgHttpLoaderModule.forRoot(),
        RouterModule.forChild(WorkStructureRoutes),
        DatepickerModule,
        BsDatepickerModule.forRoot()
    ],
    exports:[WorkStructurePositionListComponent]
})

export class WorkStructureModule {}