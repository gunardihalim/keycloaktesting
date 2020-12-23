import { Component, OnInit, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { PresentationComponent } from "../../pages/presentation/presentation.component";
import { MethodServices } from 'src/services/method-services';

var misc: any = {
  sidebar_mini_active: true
};

export interface RouteInfo {
  path: string;
  title: string;
  type: string;
  icontype: string;
  authentical:string;
  collapse?: string;
  isCollapsed?: boolean;
  isCollapsing?: any;
  children?: ChildrenItems[];
}

export interface ChildrenItems {
  path: string;
  title: string;
  type?: string;
  collapse?: string;
  children?: ChildrenItems2[];
  isCollapsed?: boolean;
  authentical: string;
}
export interface ChildrenItems2 {
  path?: string;
  title?: string;
  type?: string;
}
//Menu Items
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboards",
    title: "Dashboard",
    type: "sub",
    icontype: "fa fa-chart-pie text-primary",
    authentical: "",
    children: [
      { path: "hr", title: "HR", type: "link", authentical: "HR Dashboard" },
      { path: "time", title: "Time Management", type: "link", authentical: "Time Dashboard" },
      { path: "payroll", title: "Payroll", type: "link", authentical: "Payroll Dashboard" }
    ]
  },
  {
    path: "/employee",
    title: "Employee",
    type: "link",
    icontype: "fa fa-id-badge text-primary",
    authentical: "Employee",
    isCollapsed: true
  },
  {
    path: "/work-structure",
    title: "Work Structure",
    type: "sub",
    icontype: "fa fa-sitemap text-primary",
    authentical: "Workforce Structure",
    isCollapsed: true,
    children: [
      { path: "position", title: "Position", type: "link", authentical: "Workforce Structure" },
      { path: "organization", title: "Organization", type: "link", authentical: "Workforce Structure" },
      { path: "job", title: "Job", type: "link", authentical: "Workforce Structure" },
      { path: "grade", title: "Grade", type: "link", authentical: "Workforce Structure" },
      { path: "location", title: "Location", type: "link", authentical: "Workforce Structure" }
      // { path: "peoplegroup", title: "People Group", type: "link", authentical: "Workforce Structure" }
    ]
  },
  {
    path: "/report",
    title: "Report",
    type: "link",
    icontype: "fa fa-folder-open text-primary",
    authentical: "Report"
  },
  {
    path: "/payroll/",
    title: "Payroll",
    type: "sub",
    icontype: "fas fa-file-invoice-dollar text-primary",
    // icontype: "ni ni-align-left-2 text-primary",
    authentical: "Payroll Setup",
    isCollapsed: true,
    children: [
      { path: "process-result", title: "Process & Result", type: "link", authentical: "Payroll Process" },
      { path: "group", title: "Payroll Group", type: "link", authentical: "Payroll Setup"},
      { path: "element-classification", title: "Element Classification", type: "link", authentical: "Payroll Setup" },
      { path: "element", title: "Element", type: "link", authentical: "Payroll Setup" },
      { path: "balance", title: "Balance", type: "link", authentical: "Payroll Setup" },
      { path: "runtype", title: "Run Type", type: "link", authentical: "Payroll Setup" }
    ]
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  emitEmployee = new EventEmitter<boolean>();

  constructor(private router: Router,
          private methodServices: MethodServices) {}

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe(event => {
      this.isCollapsed = true;
    });
    this.methodServices.ROUTES = ROUTES
  }
  onMouseEnterSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  }
  onMouseLeaveSidenav() {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  }


  minimizeSidebar() {
    // this.methodServices.filterTemp.next(true)
    this.methodServices.filterTemp.next(this.methodServices.filterTempObject)
    
    const sidenavToggler = document.getElementsByClassName(
      "sidenav-toggler"
    )[0];
    const body = document.getElementsByTagName("body")[0];
    if (body.classList.contains("g-sidenav-pinned")) {
      misc.sidebar_mini_active = true;
    } else {
      misc.sidebar_mini_active = false;
    }

    if (misc.sidebar_mini_active === true) {
      body.classList.remove("g-sidenav-pinned");
      body.classList.add("g-sidenav-hidden");
      sidenavToggler.classList.remove("active");
      misc.sidebar_mini_active = false;
    } else {
      body.classList.add("g-sidenav-pinned");
      body.classList.remove("g-sidenav-hidden");
      sidenavToggler.classList.add("active");
      misc.sidebar_mini_active = true;
    }
  }
  // dashLink(menuitem,childitems){
  //   var link = '/' + menuitem + '/' + childitems;
  //   this.router.navigate([menuitem,childitems])
  // }
  reloadPage(lokasi,lokasichild?){
    if (lokasi.indexOf('employee') != -1){
      this.methodServices.urlEndParse.next('EMPLOYEE')
      this.router.navigate(['/employee'])
    }
    else if ((lokasi+'/'+lokasichild).indexOf('work-structure/position') != -1)
    {
        this.router.navigate(['/work-structure','position'])
    }
    else if ((lokasi+'/'+lokasichild).indexOf('work-structure/organization') != -1)
    {
        this.router.navigate(['/work-structure','organization'])
    }
    this.methodServices.aktif_table.next(true)
    
      // setTimeout(()=>{
      //   location.reload()
      // },100)
  }  
}
