import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from "@angular/common";
import { ProgressbarModule } from "ngx-bootstrap/progressbar";
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { ProfileComponent } from "./profile/profile.component";
import { TimelineComponent } from "./timeline/timeline.component";

import { RouterModule } from "@angular/router";
import { ExamplesRoutes } from "./examples.routing";


@NgModule({
  declarations: [ProfileComponent, TimelineComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(ExamplesRoutes),
    ProgressbarModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[FormsModule]
})
export class ExamplesModule {}
