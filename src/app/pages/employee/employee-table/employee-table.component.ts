import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, AfterContentInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as moment from 'moment'
import { format } from 'path';
import { AlternativeComponent } from '../../dashboards/alternative/alternative.component';

import * as CryptoJS from 'crypto-js'
import {environment} from "../../../../environments/environment";
import { empty } from 'rxjs';

@Component({
    selector:"employee-table",
    templateUrl:"employee-table.component.html",
    animations:[trigger('flyInParent', [
      transition(':enter, :leave', [
        query('@*', animateChild())
      ])
    ]),
    trigger('flyIn', [
      state('void', style({width: '100%', height: '100%'})),
      state('*', style({width: '100%', height: '100%'})),
      transition(':enter', [
        style({
          transform: 'translateY(30%) translateX(50%)',
          position: 'fixed'
        }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        style({
          transform: 'translateY(0%)',
          position: 'fixed'
        }),
        animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})

export class EmployeeTableComponent implements OnInit {

arrBreadCrumb = [];  
checkedToggle:boolean=true;  
url:string;
urlEnd:string;
urlEndParse:string;

modelFilter:string;

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeIdSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;
activeChecked:boolean = true;
readOnlyAsOfDate:boolean = true;

@Input() aktifTableTemp:boolean;
@ViewChild('nativeEffectiveDate') nativeEffectiveDate:ElementRef
@ViewChild('tableEmployee') table : DatatableComponent

    constructor(private location:Location,
                private methodServices:MethodServices,
                private router:Router,
                private activatedRoute:ActivatedRoute,
                private _ele:ElementRef){
        this.temp = this.rows.map((prop,key)=>{
            return {
              ...prop,
              id: key
            };
          });
    }

    params:string;

    entries: number = 10;
    totalPage:number;
    totalElement:number;
    currPage:number = 0;
    curPage:number = 1;
    selected: any[] = [];
    countData = 0;
    temp = [];
    activeRow: any;
    rows: any = [];
    modelEffectiveDate:any;
    error_msg:string;
    error_msg_point:string;

@ViewChild('efek') efek_hash;

    ngOnInit(){

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

            if (this.urlEndParse != 'EMPLOYEE'){
                this.aktif_table = false
            }
            else
            {
                this.aktif_table = true
            }
        })

        this.methodServices.urlEndParse.subscribe(result=>{
          this.urlEndParse = result.replace('-',' ')
        })

        this.methodServices.aktif_table.subscribe(result=>{
            this.aktif_table = result
            setTimeout(()=>{
              this.temp = [...this.rows];
            },800)
        })

        // let formatedDate = new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd')
        // this.modelEffectiveDate = moment(this.modelEffectiveDate).format('yyyy MM dd')
        // this.modelEffectiveDate = moment(formatedDate,'yyyy-MM-dd').format('MMM d yyyy')
        

        this.activatedRoute.queryParams.subscribe(result=>{
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
            
            if (this.urlEndParse.toLowerCase() == 'employee'){
              this.arrBreadCrumb = ['Employee']
            }
            else{
              this.arrBreadCrumb = ['Employee',this.urlEndParse.replace('-FORM','')]
            }


            if (result.effectiveDate != null && result.effectiveDate != 'undefined' && result.effectiveDate != ''){
                let decrypt_effectivedate = this.methodServices.decryptOnline(result.effectiveDate)
                let dateConv = new Date(decrypt_effectivedate)
                this.modelEffectiveDate = dateConv
            }
            else{
                this.aktif_table = true
                let curDate = new Date()
                this.modelEffectiveDate = curDate
            }
        })

        this.loadDataEmployee();
        //Force Filter to Search Input for make stretch datatable
        this.methodServices.filterTemp.subscribe((result)=>{
          // setTimeout(()=>{
            this.filter2()
          // },100)
        })
    }


    

    filterTable($event) {
      let val = $event.target.value.toLowerCase();
      this.methodServices.filterTempValue = val;
      this.temp = this.rows.filter(function(d) {
        for(var key in d){
            if(d[key].toString().toLowerCase().indexOf(val) != -1){
              return true;
          }
        }
        return false;
      });
      this.methodServices.filterTempObject = [...this.temp]
    }

    arrBreadCrumbProc(child){
      this.arrBreadCrumb = ['Employee',child]
    }

    loadDataEmployee(filter?) {
        //Employee List
        if (typeof(filter) != "undefined")
            this.params = filter
        else
            this.params = "page=0&size=30000"
        this.methodServices.getUrlApi('/api/employee/find',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
                if (typeof(result) == 'object')
                {
                    this.totalPage = result['totalPages']
                    this.totalElement = result['totalElements']
                    this.rows = []
                    for(var key in result){
                        if (key == 'content'){
                            for(var i=0;i<result[key].length;i++){
                                this.rows.push({
                                    employeeId:result[key][i].employeeId,
                                    name:result[key][i].name,employeeNo:result[key][i].employeeNo,
                                    employeeStatus:result[key][i].employeeStatus,
                                    companyName:result[key][i].legalEntityName,
                                    companyId:result[key][i].companyId,
                                    positionName:result[key][i].positionName})
                            }
                        }
                        // this.temp = [...this.rows]
                    }
                    // setTimeout(()=>{
                    this.temp = [...this.rows];
                    this.methodServices.filterTempObject = [...this.rows]
                    // },800)
                }
            },this.params);
    }


    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       if (this.selected.length > 0){
         this.employeeIdSelect = this.selected[0].employeeId
         var companyName = this.selected[0].companyName
          let companyId = this.selected[0].companyId
          
         if (this.modelEffectiveDate == 'undefined' || this.modelEffectiveDate == null || this.modelEffectiveDate == ''){
           this.error_msg = 'harus di-Input !'
           this.error_msg_point = 'Effective Date'
           window.scroll(0,0)
          //  if(this.error_msg != null){
          //    setTimeout(()=>{
          //     alert(this._ele.nativeElement.querySelector('.efek').offsetTop);
          //    },100)
          //  } 
            return;
          }
         //Parsing Effective Date
        //  this.methodServices.getUrlApi('/api/employee/' + this.employeeIdSelect,
        //  localStorage.getItem('Token'),
        //  (result)=>{
        //  if (typeof(result) == 'object')
        //   {
        //       var effectiveDateFormat = new Date(result.employment[0].effectiveDate)
        //       this.modelEffectiveDate = new DatePipe('en-US').transform(effectiveDateFormat,'yyyy-MM-dd')
        //       this.methodServices.effectiveDateParent = this.modelEffectiveDate
        //   }
        //  })
         this.aktif_table = false
         this.error_msg = null
         this.error_msg_point = null
         this.urlEndParse = 'PERSONAL'

         let encrypt_employeeId = CryptoJS.AES.encrypt(this.employeeIdSelect.toString(),environment.encryptKey).toString()
         let encrypt_companyName = CryptoJS.AES.encrypt(companyName,environment.encryptKey).toString()
         let encrypt_effectiveDate = CryptoJS.AES.encrypt(this.modelEffectiveDate.toString(),environment.encryptKey).toString()

         this.router.navigate(['/employee','personal'],
                {queryParams:{
                    employeeid:encrypt_employeeId,
                        companyname:encrypt_companyName,
                        effectiveDate:encrypt_effectiveDate}})
       }
    }

    redirectForm(dataRow) {
        this.aktif_table = false
        this.router.navigate(['/employee','personal'],{
            queryParams: {
                employeeid: this.methodServices.encryptOnline(dataRow.employeeId.toString()),
                companyname: this.methodServices.encryptOnline(dataRow.companyName.toString()),
                effectiveDate: this.methodServices.encryptOnline(this.modelEffectiveDate.toString())
            }
        })
    }

    onActivate(event) {
      this.activeRow = event.row
    }

    hover_color(){
      this.class_hover =  'btn btn-default rounded-circle bg-gradient-light text-dark text-lg'
    }
    leave_color(){
      this.class_hover =  'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg'
    }
   
    change_aktif_tabel(){
      // this.aktif_table = !this.aktif_table
      // this.urlEndParse = "EMPLOYEE"
      // this.router.navigate(['employee'])

    }

    aktifTableChange(status){
      this.aktif_table = true
    }
    
    // ubahtanggal(event){
    //   this.nativeEffectiveDate.nativeElement.setAttribute("data-date",
    //         moment(event.target.value,'yyyy-MM-dd').format(this.nativeEffectiveDate.nativeElement.
    //                 getAttribute("data-date-format")))
    // }
  checkProc(){
    this.activeChecked = !this.activeChecked
  }
  // ngAfterViewInit(){
  //   this._ele.nativeElement.querySelector('.masukin').style.color = 'red'
  // }
  procAddition(){
    this.methodServices.aktif_table_child.next(true)
  }
  
  changeDate(){
    this.methodServices.effectiveDateParent = this.modelEffectiveDate
  }

  backTable(event) {
    switch(event.toLowerCase()){
      case 'employee':
          this.router.navigate(['employee']);
          this.methodServices.aktif_table.next(true);
          break;
      case 'element entries':
          this.router.navigate(['employee','element-entries'],{
            queryParamsHandling:'merge'
          })
          this.methodServices.aktif_table.next(false);
          this.methodServices.aktif_table_child.next(true);
          break;
    }
    
    // if (event.toLowerCase() == 'employee'){  
    // }
  }

  filter2(){
    setTimeout(()=>{
      let filterTempValue = this.methodServices.filterTempValue
        this.temp = [];
        this.temp = [...this.methodServices.filterTempObject]
        // if(typeof(filterTempValue) == 'undefined' ||
        //     filterTempValue == '')
        // {
        //   this.temp = [...this.rows]
        //   return true
        // }

        // this.temp = this.rows.filter(function(d){  
        //   for(var key in d){
        //     if(d[key].toString().toLowerCase().indexOf(filterTempValue) != -1){
        //       return true;
        //     }
        //   }
        //   return false;
        // });
    },150)
  }

    setPage(pageInfo) {
        console.log("Pager info")
        console.log(pageInfo)
    }

    onSort($event){
        console.log('hasil sort \n')
        console.log($event)
        let x;
        let y;
        let dataSort:boolean;

        let titleSort = ['id','elementName','type','payElementClassificationsName','effectiveDate','no','activeRev','active']
        if(titleSort.length > 0){
            dataSort = false;
            titleSort.forEach((colname)=>{
                if ($event.newValue == 'asc'){
                    if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                        this.rows.sort(function(a,b){
                            if(colname == 'no'){
                                return a.no - b.no
                            }
                            else{
                                x = a[colname].toString().toLowerCase();
                                y = b[colname].toString().toLowerCase();
                                if(x < y) {dataSort = true;return -1};
                                if(x > y) {dataSort = true;return 1};
                                if(x == y){return 0};
                            }
                        })
                        if (dataSort == true){
                            //   setTimeout(()=>{
                            let idx:number = 0;
                            this.temp = this.rows.filter((d)=>{
                                d['index'] = idx++;
                                for (var key in d){
                                    // if (d[key].toString().toLowerCase().indexOf(this.modelFilter) != -1 &&
                                    if (key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
                                        return true
                                    }
                                }
                                return false
                            })
                            console.log('hasil sort\n')
                            console.log(this.temp)
                            console.log('hasil sort rows\n')
                            console.log(this.rows)
                            //   },100)
                            setTimeout(()=>{
                                this.temp = [...this.temp]
                            },100)
                        }
                    }
                }
                else if($event.newValue == 'desc'){
                    if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                        this.rows.sort(function(a,b){
                            if(colname == 'no'){
                                return b.no - a.no
                            }
                            else{
                                x = a[colname].toString().toLowerCase();
                                y = b[colname].toString().toLowerCase();
                                if(x < y) {dataSort = true;return -1};
                                if(x > y) {dataSort = true;return 1};
                                if(x == y){return 0};
                            }
                        })
                        if (dataSort == true){
                            this.rows.reverse();
                            // setTimeout(()=>{
                            let idx:number = 0;
                            this.temp = this.rows.filter((d)=>{
                                d['index'] = idx++;
                                for (var key in d){
                                    // if (d[key].toString().toLowerCase().indexOf(this.modelFilter) != -1 &&
                                    if(key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
                                        return true
                                    }
                                }
                                return false
                            })
                            console.log('hasil sort\n')
                            console.log(this.temp)
                            console.log('hasil sort rows\n')
                            console.log(this.rows)
                            // },100)
                            setTimeout(()=>{
                                this.temp = [...this.temp]
                            },100)
                        }
                    }
                }
            })
        }
        return
    }

  // moveScroll(){
    // window.scrollTo(0,250)
    // let interval = window.setInterval(()=>{
    //     let posisi = window.pageYOffset;
    //     if (posisi >= 250){
    //       window.scroll(0,posisi - 10)
    //     }
    //     else
    //     {
    //       window.clearInterval(interval)
    //     }
    // },10)
  // }

  // getAss(){
  //   this.rows.forEach((result)=>{
  //     this.params = "employeeid=" + result.employeeId
  //     this.methodServices.getUrlApi('/api/admin/employee/assignment',
  //     localStorage.getItem('Token'),
  //     (result)=>{
  //     if (typeof(result) == 'object')
  //     {
  //         for(var key in result){
  //           if (key == 'assignmentId'){
  //             if (result['assignmentId']=="95242"){
  //               alert(result['employeeId'] + '\n' + result['name'])
  //             }
  //           }
  //         }
  //     }
  //     },this.params);
  //   })
  // }

  //function untuk pergantian page dan hit API
  changePagination(event){
    this.table.limit = this.entries
    this.curPage = event.page
    this.table.offset = event.page - 1
    let filter = "page="+(this.curPage-1)+"&size="+this.entries
    this.loadDataEmployee(filter)
  }

  entriesChange($event){
    this.entries = Number($event.target.value);
    // this.table.limit = this.entries
    // this.table.offset = 0
    //   this.temp = this.temp.slice()
      let filter = "page="+(this.curPage-1)+"&size="+this.entries
      this.loadDataEmployee(filter)
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
