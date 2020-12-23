import { Routes } from '@angular/router'
import { PayrollElementClassificationComponent } from "../payroll/payroll-element-classification/payroll-element-classification.component";
import { PayrollElementClassificationFormComponent } from "../payroll/payroll-element-classification-form/payroll-element-classification-form.component";
import { PayrollElementComponent } from "../payroll/payroll-element/payroll-element.component";
import { PayrollElementFormComponent } from "../payroll/payroll-element-form/payroll-element-form.component";
import { PayrollBalanceComponent } from "../payroll/payroll-balance/payroll-balance.component";
import { PayrollBalanceFormComponent } from "../payroll/payroll-balance-form/payroll-balance-form.component";
import { PayrollRuntypeComponent } from "../payroll/payroll-runtype/payroll-runtype.component";
import { PayrollRuntypeFormComponent } from "../payroll/payroll-runtype-form/payroll-runtype-form.component";
import { PayrollGroupsComponent} from "./payroll-groups/payroll-groups.component";
import { PayrollGroupsFormComponent} from "./payroll-groups-form/payroll-groups-form.component";
import { PayrollProcessComponent} from "./payroll-process/payroll-process.component";
import { PayrollProcessFormComponent} from "./payroll-process-form/payroll-process-form.component";

import { deactiveGuard } from 'src/app/services/deactivate-guard'

import {MenuGuard} from "../../services/menu-guard";

export const PayrollRoutes : Routes = [
    {
        path:"",
        children:[
            {path:"group",
            component:PayrollGroupsComponent,
            canActivate: [MenuGuard],
                children:[{
                    path:"group-form",
                    canDeactivate:[deactiveGuard],
                    component:PayrollGroupsFormComponent
                }]
            },
            {path:"element-classification",
            component:PayrollElementClassificationComponent,
            canActivate: [MenuGuard],
            children:[{
                    path:"ele-class-form",
                    canDeactivate:[deactiveGuard],
                    component:PayrollElementClassificationFormComponent
                }]
            },
            {path:"element",
            component:PayrollElementComponent,
            canActivate: [MenuGuard],
            children:[{
                    path:"ele-form",
                    canDeactivate:[deactiveGuard],
                    component:PayrollElementFormComponent
                }]
            },
            {path:"balance",
            component:PayrollBalanceComponent,
            canActivate: [MenuGuard],
            children:[{
                    path:"balance-form",
                    canDeactivate:[deactiveGuard],
                    component:PayrollBalanceFormComponent
                }]
            },
            {path:"process-result",
            component:PayrollProcessComponent,
            canActivate: [MenuGuard],
            children:[{
                    path:"process-result-form",
                    canDeactivate:[deactiveGuard],
                    component:PayrollProcessFormComponent
                }]
            },
            {
                path:"runtype",
                component: PayrollRuntypeComponent,
                canActivate: [MenuGuard],
                children:[{
                    path: "runtype-form",
                    canDeactivate:[deactiveGuard],
                    component: PayrollRuntypeFormComponent
                }]
            }
        ]
    }
]