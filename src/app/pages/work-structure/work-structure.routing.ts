import { Routes } from '@angular/router'
import { WorkStructurePositionListComponent } from "./work-structure-position-list/work-structure-position-list.component";
import { WorkStructurePositionFormComponent } from "./work-structure-position-form/work-structure-position-form.component";

import { WorkStructureOrganizationListComponent } from "./work-structure-organization-list/work-structure-organization-list.component";
import { WorkStructureOrganizationFormComponent } from "./work-structure-organization-form/work-structure-organization-form.component";
// import { WorkStructureOrganizationFormComponent } from "./work-structure-organization-form/work-structure-organization-form.component";

import { WorkStructureJobListComponent } from './work-structure-job-list/work-structure-job-list.component';
import { WorkStructureJobFormComponent } from "./work-structure-job-form/work-structure-job-form.component";

import { WorkStructureGradeListComponent } from './work-structure-grade-list/work-structure-grade-list.component';
import { WorkStructureGradeFormComponent } from "./work-structure-grade-form/work-structure-grade-form.component";

import { WorkStructurePeopleGroupListComponent } from "./work-structure-peoplegroup-list/work-structure-peoplegroup-list.component";
import { WorkStructurePeopleGroupFormComponent } from "./work-structure-peoplegroup-form/work-structure-peoplegroup-form.component";

import { WorkStructureLocationListComponent } from "./work-structure-location-list/work-structure-location-list.component";
import { WorkStructureLocationFormComponent } from "./work-structure-location-form/work-structure-location-form.component";
// import { FormsComponentsComponent } from "../forms/components/components.component"

import { AuthGuard } from "../../services/authguard";
import {MenuGuard} from "../../services/menu-guard";
import { deactiveGuard } from 'src/app/services/deactivate-guard';

export const WorkStructureRoutes : Routes = [
    {
        path:"",
        children:[
            {
                path:"position",
                component:WorkStructurePositionListComponent,
                canActivate: [MenuGuard],
                children:[{
                    path:"position-form",
                    // canDeactivate:[deactiveGuard],
                    component:WorkStructurePositionFormComponent
                }]
            },
            {
                path:"organization",
                component:WorkStructureOrganizationListComponent,
                canActivate: [MenuGuard],
                children:[{
                    path:"organization-form",
                    // canDeactivate:[deactiveGuard],
                    component:WorkStructureOrganizationFormComponent
                }]
            },
            {
                path:"job",
                component:WorkStructureJobListComponent,
                canActivate: [MenuGuard],
                children:[{
                    path:"job-form",
                    // canDeactivate:[deactiveGuard],
                    component:WorkStructureJobFormComponent
                }]
            },
            {
                path:"grade",
                component:WorkStructureGradeListComponent,
                canActivate: [MenuGuard],
                children:[{
                    path:"grade-form",
                    // canDeactivate:[deactiveGuard],
                    component:WorkStructureGradeFormComponent
                }]
            },
            {
                path:"location",
                component:WorkStructureLocationListComponent,
                canActivate: [MenuGuard],
                children:[{
                    path:"location-form",
                    // canDeactivate:[deactiveGuard],
                    component:WorkStructureLocationFormComponent
                }]
            }
            // {
            //     path:"peoplegroup",
            //     component:WorkStructurePeopleGroupListComponent,
            //     canActivate: [MenuGuard],
            //     children:[{
            //         path:"peoplegroup-form",
            //         // canDeactivate:[deactiveGuard],
            //         component:WorkStructurePeopleGroupFormComponent
            //     }]
            // },
        ]
    }
]