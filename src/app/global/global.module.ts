import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ComponentsModule } from 'src/app/components/components.module';

import { GlobalDatatableFooter } from 'src/app/global/datatable-footer-component/datatable-footer-component'
import { GlobalBreadcrumbComponent } from 'src/app/global/breadcrumb-component/breadcrumb-component'
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


@NgModule({
    declarations:[
            GlobalBreadcrumbComponent, GlobalDatatableFooter
    ],
    imports:[CommonModule],
    exports:[GlobalBreadcrumbComponent, GlobalDatatableFooter],
    providers:[]
})

export class GlobalModule {}