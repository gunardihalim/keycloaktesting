import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector:'global-breadcrumb-component',
    templateUrl:'breadcrumb-component.html'
})

export class GlobalBreadcrumbComponent {
    @Input() arrBreadCrumb:any[];
    @Output() backTableMainMenu = new EventEmitter<any>();
    constructor(){
    }

    backTable(arrBreadCrumbVar){
        this.backTableMainMenu.emit(arrBreadCrumbVar)
    }

    titleCase(str) {    
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        // You do not need to check if i is larger than splitStr length, as your for does that for you
        // Assign it back to the array
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(' ');
    }
}