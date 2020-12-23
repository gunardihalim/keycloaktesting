import { Component, Input } from "@angular/core";

@Component({
    selector:'global-datatable-footer',
    templateUrl:'datatable-footer-component.html'
})

export class GlobalDatatableFooter {
    @Input() rowCount:number = 0;
    constructor(){}
}