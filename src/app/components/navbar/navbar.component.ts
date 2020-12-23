import { Component, OnInit, ElementRef } from "@angular/core";
import { ROUTES } from "../sidebar/sidebar.component";
import {Router, Event, NavigationStart, NavigationEnd, NavigationError, ActivatedRoute} from '@angular/router';
import { MethodServices } from "../../../services/method-services"
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'

import {
  Location,
  LocationStrategy,
  PathLocationStrategy
} from "@angular/common";
import { Subject } from 'rxjs';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  
  // employeeName = new Subject<string>();
  employeeName:string;
  employeeNo:string;
  positionName:string;
  urlEndParse:string;

  sidenavOpen: boolean = true;
  constructor(
    private methodServices:MethodServices,
    location: Location,
    private element: ElementRef,
    private router: Router,
    private activatedRoute:ActivatedRoute
  ) {
    this.location = location;
    this.router.events.subscribe((event: Event) => {
       if (event instanceof NavigationStart) {

           // Show loading indicator

       }
       if (event instanceof NavigationEnd) {
           // Hide loading indicator

           if (window.innerWidth < 1200) {
             document.body.classList.remove("g-sidenav-pinned");
             document.body.classList.add("g-sidenav-hidden");
             this.sidenavOpen = false;
           }
       }

       if (event instanceof NavigationError) {
           // Hide loading indicator

           // Present error to user
           // console.log(event.error);
       }
   });

  }
  employeeNames:string;
  hasil_temp:string[]=[];
  employeeImage:string;
  loginCompanyId:any;

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);

    if (this.methodServices.seasonKey == null) {
      this.methodServices.readLocalStorageKey()
    }

    this.activatedRoute.params.subscribe(result=>{
      var url = this.location.prepareExternalUrl(this.location.path())
      var urlEnd = url.lastIndexOf("/") + 1
      this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()
      //remove -
      this.urlEndParse = this.urlEndParse.replace('-',' ')

      //No Get QUery Params
      var urlQuestion = this.urlEndParse.indexOf("?")
      if (urlQuestion != -1){
        var urlFinal = this.urlEndParse.slice(0,urlQuestion)
        this.urlEndParse = urlFinal
      }
    })

    if(localStorage.getItem(this.methodServices.seasonKey) != null && localStorage.getItem(this.methodServices.seasonKey) != ''){
      this.methodServices.getUrlApi('/api/user/profile?mobileversion=102',
          localStorage.getItem(this.methodServices.seasonKey),
          (result)=>{
            if(typeof(result) == 'string'){
                this.employeeName = '---'
                this.employeeNo = '---'
                this.positionName = '---'   
                this.loginCompanyId = '---' 
                this.employeeImage = '/'
            }
            else
                if (typeof(result) == 'object')
                {
                  this.employeeName = result.employee.name
                  this.employeeNo = result.employee.employeeNo
                  this.positionName = result.employee.positionName
                  this.employeeImage = result.image
                  this.loginCompanyId = result.employee.companyId

                  if (localStorage.getItem(this.methodServices.authenticalKey) == null)
                    localStorage.setItem(this.methodServices.encryptAuthenticalLabel, this.methodServices.encryptOnline(JSON.stringify(result.authorities)))

                  if(localStorage.getItem('company')!== null){
                    localStorage.removeItem('company')
                  }
                  let companyEncrypt = CryptoJS.AES.encrypt(this.loginCompanyId,environment.encryptKey).toString()
                  localStorage.setItem('company',companyEncrypt)
                  if (typeof(this.methodServices.authenticalKey) == "undefined") {
                    this.methodServices.readLocalStorageKey()
                  }
                  setTimeout(() => {
                    this.methodServices.redirectDashboard(this.urlEndParse)
                  }, 800)
                }


        // for(let key in result){
          // if (key == 'employee'){
          //   if (result[key].name.indexOf('Gunardi') != -1)
          //   {
          //     alert(result[key].employeeNo)
          //   }
          // }

          // if (key == 'authorities'){
          //     for(var i = 0;i<result[key].length;i++)
          //     {
          //       alert(result[key][i].authority)
          //     }
          // }
        // }

    })
    // this.employeeName.subscribe((res)=>{
    //   this.employeeNames = res
    //   alert(this.employeeNames)
    // })
    }
    

  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1);
    }

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return "Dashboard";
  }

  openSearch() {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function() {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  }
  closeSearch() {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function() {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  }
  openSidebar() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }
  toggleSidenav() {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
      this.sidenavOpen = false;
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
      this.sidenavOpen = true;
    }
  }

  logout(){
    if(typeof(Storage) !== 'undefined'){
      if(localStorage.getItem(this.methodServices.seasonKey) !== null)
      {
        localStorage.removeItem(this.methodServices.seasonKey)
        localStorage.removeItem(this.methodServices.authenticalKey)
        this.methodServices.userAuthorities = [];
      }
    }
    this.router.navigate(['/'])
  }
}
