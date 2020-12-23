import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as moment from 'moment'
import { format, resolve } from 'path';
import { environment } from 'src/environments/environment';

import * as CryptoJS from 'crypto-js'
import { promise } from 'protractor';
import { AlternativeComponent } from '../../dashboards/alternative/alternative.component';

@Component({
    selector:"payroll-balance",
    templateUrl:"payroll-balance.component.html",
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

export class PayrollBalanceComponent implements OnInit {
  
arrBreadCrumb = ['Payroll','Balance']

url:string;
urlEnd:string;
urlEndParse:string;

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeIdSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

modelActiveStatus:boolean = true;
modelAllDate:boolean = true;
readOnlyAsOfDate:boolean = true;

@Input() aktifTableTemp:boolean;
@ViewChild('nativeEffectiveDate') nativeEffectiveDate:ElementRef
@ViewChild('tableBalance') table;

    constructor(private location:Location,
                private methodServices:MethodServices,
                private router:Router,
                private activatedRoute:ActivatedRoute){
        this.temp = this.rows.map((prop,key)=>{
            return {
              ...prop,
              id: key
            };
          });
          
    }

    params:string;

    entries: number = 10;
    selected: any[] = [];
    temp = [];
    activeRow: any;
    rows: any = [];
    modelEffectiveDate:any;

    tesarr = [1,2,3];

    ngOnInit(){
      // let aaa = CryptoJS.AES.decrypt('Jnhk7eaBhqqgdOKbB0sO1Q==',environment.encryptKey).toString(CryptoJS.enc.Utf8)
      // alert(window.atob('Jnhk7eaBhqqgdOKbB0sO1Q=='))

      // let enc = this.methodServices.encryptOnline('Token')
      // alert(enc)
      // alert(this.methodServices.decryptOnline(enc))
      
      // if (typeof(localStorage) != 'undefined'){
      //   // alert(localStorage.length)
      //   for (let i = 0;i<localStorage.length;i++){
      //     // if (localStorage.key(i)){
      //       let tokenDec = CryptoJS.AES.decrypt(localStorage.key(i),environment.encryptKey).toString(CryptoJS.enc.Utf8)
      //       if (tokenDec != null && tokenDec != ''){
      //         alert(localStorage.key(i) + ' ---> ' + tokenDec)
      //       }
      //     // }      
      //   }
      // }
      

      // localStorage.setItem(tokenEnc,'abc')

      

      // let aaa = window.atob(CryptoJS.AES.decrypt('Jnhk7eaBhqqgdOKbB0sO1Q=='
      //               ,'secret-key-58923').toString(CryptoJS.enc.Utf8))


        if(typeof(this.modelEffectiveDate)== 'undefined'){
          let effectiveDateHome = new Date();
          let effectiveDateHomeConv = new DatePipe('en-us').transform(effectiveDateHome,'dd-MMM-yyyy')
          this.modelEffectiveDate = effectiveDateHomeConv          
        }

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
            // let exists:boolean = false
            // for (var key in result){
            //   exists = true
            // }
            // if (exists == false){
              
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

              if (this.urlEndParse == 'BALANCE'){
                this.aktif_table = true
                this.elementClassLoad()
              }
              else{
                this.aktif_table = false
              }
            // }
        })

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

          if (this.urlEndParse != 'BALANCE'){
              this.aktif_table = false
          }
          else
          {
            this.aktif_table = true
          }
        })

        // this.elementClassLoad()
        this.methodServices.filterTemp.subscribe((result)=>{
          setTimeout(()=>{
            this.temp = [];
            this.temp = [...this.methodServices.filterTempObject];
          },150)
        })
    }

    entriesChange($event){
      this.entries = Number($event.target.value);
    }
    filterTable($event) {
      let val = $event.target.value.toLowerCase();
      this.temp = this.rows.filter(function(d) {
        for(var key in d){
          if(d[key].toString().toLowerCase().indexOf(val) !== -1){
            return true;
          }
        }
        return false;
      });
      this.methodServices.filterTempObject = [...this.temp]
    }

    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       this.methodServices.selectedTemp = [];
       this.methodServices.selectedTemp.push(...selected);

       if (this.selected.length > 0){
            let id = this.selected[0].id
            let balanceName = this.selected[0].balanceName
            let reportingName = this.selected[0].reportingName
            let active = this.selected[0].active == "Yes" ? true : false
            this.aktif_table = false
            this.urlEndParse = 'BALANCE FORM'

            //Encrypt
            let encrypt_id = CryptoJS.AES.encrypt(id.toString(),environment.encryptKey).toString()
            let encrypt_balancename = CryptoJS.AES.encrypt(balanceName,environment.encryptKey).toString()
            let encrypt_reportingname = CryptoJS.AES.encrypt(reportingName,environment.encryptKey).toString()
            let encrypt_active = CryptoJS.AES.encrypt(active.toString(),environment.encryptKey).toString()
            //
            
            this.router.navigate(['/payroll/balance','balance-form'],
                {queryParams:{
                              id:encrypt_id,
                              balanceName:encrypt_balancename,
                              reportingName:encrypt_reportingname,
                              active:encrypt_active},
                })
       }
    }

    redirectForm(dataRow) {
        this.aktif_table = false
        this.router.navigate(['/payroll/balance','balance-form'],{
            queryParams: {
                id: this.methodServices.encryptOnline(dataRow.id.toString()),
                balanceName: this.methodServices.encryptOnline(dataRow.balanceName.toString()),
                reportingName: this.methodServices.encryptOnline(dataRow.reportingName.toString()),
                active: this.methodServices.encryptOnline((dataRow.active == 'Yes' ? 'true' : 'false'))
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
   
    // change_aktif_tabel(){
    //   this.aktif_table = !this.aktif_table

    //   this.urlEndParse = "EMPLOYEE"
    //   this.router.navigate(['employee'])
    // }

    aktifTableChange(status){
      this.aktif_table = true
    }
    
    // ubahtanggal(event){
    //   this.nativeEffectiveDate.nativeElement.setAttribute("data-date",
    //         moment(event.target.value,'yyyy-MM-dd').format(this.nativeEffectiveDate.nativeElement.
    //                 getAttribute("data-date-format")))
    // }
    
    createElement(){
      this.aktif_table = false
      this.urlEndParse = 'BALANCE FORM'
      let encrypt_status = this.methodServices.encryptOnline("new")
      this.router.navigate(['/payroll/balance','balance-form'],
      {queryParams:{status:encrypt_status}
      })
    }

    elementClassLoad(filter?:string,activeStatus?:boolean){
      //Element Classification List
      let effectiveDateConvert:Date;
      let effectiveDateConvertStr:String;

      if (typeof(activeStatus) != 'undefined'){
        this.params = "page=0&size=100&isactive=" + activeStatus
      }
      else{
        this.params = "page=0&size=100&isactive=" + this.modelActiveStatus
      }

    //filter = Date      
      if (typeof(filter) != 'undefined'){
          this.params += filter
      }

      // this.rows = []
      this.methodServices.getUrlApi('/api/admin/paybalancetypes',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
      if (typeof(result) == 'object')
      {
          for(var key in result){
              if (key == 'content'){
                  this.rows = [];
                  this.temp = [];
                  for(var i=0;i<result[key].length;i++){
                    //   effectiveDateConvert = new Date(result[key][i].effectiveDate);
                    //   effectiveDateConvertStr = new DatePipe('en-US').transform(effectiveDateConvert,'dd-MMM-yyyy')
                      
                      // let abc = new Date(effectiveDateConvertStr.toString())
                      // alert(abc)

                      this.rows.push({
                                  id:result[key][i].id,
                                  balanceName:result[key][i].name,
                                  reportingName:result[key][i].reportingName,
                                  companyId:result[key][i].companyId,
                                  active:result[key][i].active ? 'Yes' : 'No',
                              })     
                  }
              }
          }
          this.temp = this.rows; 
          this.methodServices.filterTempObject = [...this.rows]
      }
    },this.params)


      setTimeout(()=>{
        this.temp = [...this.rows];
        this.methodServices.selectedTemp = [...this.rows];
      },800)
      // this.temp.push(...this.rows)
    }
    
    

    checkAllDate(){
      if (this.modelAllDate == true){
        this.readOnlyAsOfDate = true
      }
      else{
        this.readOnlyAsOfDate = false
      }
    }

    loadAllDate(){
      let statusAllDate:boolean = !this.modelAllDate
      let dateTemp = new Date(this.modelEffectiveDate)
      let dateTempConv = new DatePipe('en-us').transform(dateTemp,'yyyy-MM-dd')
      if (statusAllDate == true){
        this.rows = [];
        this.elementClassLoad()   //LOAD ALL DATA
      }
      else{
        this.rows = [];
        this.elementClassLoad('&effectivedate=' + dateTempConv)   //LOAD FILTER DATA
      }
    }

    changeDate(val?:any){
      let dateConv:any;
      let statusAllDate:boolean = this.modelAllDate
      if (statusAllDate == false){
        this.rows = [];
        // this.elementClassLoad('&effectivedate=' + this.modelEffectiveDate)   //LOAD FILTER DATA
        if (typeof(val) != 'undefined' && val.target.value.length >= 10){   //KEYUP
          let dateTemp = val.target.value
          dateConv = new Date(dateTemp)
          if(dateConv.toString() != 'Invalid Date'){
            let dateConvStr = new DatePipe('en-us').transform(dateConv,'yyyy-MM-dd')
            this.elementClassLoad('&effectivedate=' + dateConvStr)   //LOAD FILTER DATA
          }
          else{
            this.temp = []
          }
        }
        else
        if (typeof(val) == 'undefined')   //ngmodelchange
        {
          dateConv = new Date(this.modelEffectiveDate)
          if(dateConv.toString() != 'Invalid Date'){
            let dateConvStr = new DatePipe('en-us').transform(dateConv,'yyyy-MM-dd')
            this.elementClassLoad('&effectivedate=' + dateConvStr)   //LOAD FILTER DATA
          }
        }
      }
    }

    backTable(event) {
      if (event.toLowerCase() == 'balance'){
        this.router.navigate(['/payroll/balance'])
        this.methodServices.aktif_table.next(true)
      }
    }

    activeStatusProc(){
      let activeStatus:boolean = !this.modelActiveStatus      
      if (activeStatus == true){
        //   if(this.modelAllDate == true){
            this.rows = [];
            this.elementClassLoad(undefined,true)
        //   }
        //   else{
        //     this.rows = [];
        //     this.elementClassLoad('&effectivedate=' + this.modelEffectiveDate,true)
        //   }
      }
      else{
        //   if(this.modelAllDate == true){
            this.rows = [];
            this.elementClassLoad(undefined,false)
        //   }
        //   else{
        //     this.rows = [];
        //     this.elementClassLoad('&effectivedate=' + this.modelEffectiveDate,false)
        //   }
      }
    }
    
}
