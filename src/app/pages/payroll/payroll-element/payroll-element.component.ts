import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import * as CryptoJS from 'crypto-js'
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as moment from 'moment'
import { format } from 'path';
import {environment} from "../../../../environments/environment";

@Component({
    selector:"payroll-element",
    templateUrl:"payroll-element.component.html",
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

export class PayrollElementComponent implements OnInit {
  
arrBreadCrumb = ['Payroll','Element']

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
@ViewChild('tableElement') table;

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
        if(typeof(this.modelEffectiveDate)== 'undefined'){
          let effectiveDateHome = new Date();
          this.modelEffectiveDate = effectiveDateHome
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

              if (this.urlEndParse == 'ELEMENT'){
                this.aktif_table = true
                this.elementClassLoad()
              }
              
              localStorage.removeItem('tempeffectivedate')
              localStorage.removeItem('tempactiveStatus')
              localStorage.removeItem('tempelementName')
              localStorage.removeItem('tempreportingName')
              localStorage.removeItem('tempdescription')
      
              localStorage.removeItem('tempelementClassification')
              localStorage.removeItem('temprecurring')
              localStorage.removeItem('tempproration')
              localStorage.removeItem('temppriority')
              localStorage.removeItem('tempterminationRule')
              localStorage.removeItem('tempformulaName')

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

          if (this.urlEndParse != 'ELEMENT'){
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
      let val = $event.target.value.toString();
      this.temp = this.rows.filter(function(d){
        for (var key in d){
          if(key.toLowerCase() == 'recurring'){
              if(d[key].toString().toLowerCase().indexOf(val.toLowerCase()) != -1){
              return true
            }
          }
          if(key.toLowerCase() == 'elementname' || 
              key.toLowerCase() == 'description' || 
              key.toLowerCase() == 'elementclassification' ||
              key.toLowerCase() == 'effectivedate'){
            if(typeof(d[key]) !== 'undefined' && d[key] != null && d[key] != ''){
              if(d[key].toString().toLowerCase().indexOf(val.toLowerCase()) != -1){
                return true
              }
            }
          }
        }
        return false
      })
      this.methodServices.filterTempObject = [...this.temp]
      // console.log(this.temp)
      // this.temp = this.rows.filter(function(d) {
      //   for(var key in d){
      //     if(d[key].toString().toLowerCase().indexOf(val) !== -1){
      //       return true;
      //     }
      //   }
      //   return false;
      // });
    }

    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       this.methodServices.selectedTemp = [];
       this.methodServices.selectedTemp.push(...selected);

        let encrypt_id = CryptoJS.AES.encrypt(this.selected[0].id.toString(),environment.encryptKey).toString()
        let encrypt_name = CryptoJS.AES.encrypt(this.selected[0].name,environment.encryptKey).toString()
        let encrypt_description = CryptoJS.AES.encrypt(this.selected[0].description,environment.encryptKey).toString()
        let encrypt_active = CryptoJS.AES.encrypt((this.selected[0].active == 'Yes' ? true : false).toString(),environment.encryptKey).toString()
        let encrypt_effectiveDate = CryptoJS.AES.encrypt(this.selected[0].effectiveDate.toString(),environment.encryptKey).toString()
        let encrypt_elementClassificationId = CryptoJS.AES.encrypt(this.selected[0].payElementClassificationId,environment.encryptKey).toString()
        let encrypt_elementClassification = CryptoJS.AES.encrypt(this.selected[0].elementClassification,environment.encryptKey).toString()
        let encrypt_formula = CryptoJS.AES.encrypt(this.selected[0].formulaId.toString(),environment.encryptKey).toString()

       if (this.selected.length > 0){
          let effectiveDate = encrypt_effectiveDate
          let active = encrypt_active
          let id = encrypt_id
          let name = encrypt_name
          let description = encrypt_description
          let elementClassification = encrypt_elementClassification
          let elementClassificationId = encrypt_elementClassificationId
          let recurring = this.selected[0].recurring == 'Yes' ? true : false
          let proration = this.selected[0].proration
          let priority = this.selected[0].priority
          let terminationRule = this.selected[0].terminationRule
          let formula = encrypt_formula

         this.aktif_table = false
         this.urlEndParse = 'ELEMENT FORM'
         localStorage.setItem('tempchangeValue','0'); //detect ada value berubah di form
        //  localStorage.removeItem('changeValue')
        localStorage.removeItem('tempeffectivedate')
          localStorage.removeItem('tempactiveStatus')
          localStorage.removeItem('tempelementName')
          localStorage.removeItem('tempreportingName')
          localStorage.removeItem('tempdescription')

          localStorage.removeItem('tempelementClassification')
          localStorage.removeItem('temprecurring')
          localStorage.removeItem('tempproration')
          localStorage.removeItem('temppriority')
          localStorage.removeItem('tempterminationRule')
          localStorage.removeItem('tempmasukOnDestroy')
          
          localStorage.removeItem('tempformulaName')
         this.router.navigate(['/payroll/element','ele-form'],
                {queryParams:{
                              id:id,
                              name:name,
                              description:description,
                              effectiveDate:effectiveDate,
                              active:active,
                              formula:formula},
                })
       }
    }

    redirectForm(dataRow) {
        this.aktif_table = false
        localStorage.setItem('tempchangeValue','0');
        localStorage.removeItem('tempeffectivedate')
        localStorage.removeItem('tempactiveStatus')
        localStorage.removeItem('tempelementName')
        localStorage.removeItem('tempreportingName')
        localStorage.removeItem('tempdescription')

        localStorage.removeItem('tempelementClassification')
        localStorage.removeItem('temprecurring')
        localStorage.removeItem('tempproration')
        localStorage.removeItem('temppriority')
        localStorage.removeItem('tempterminationRule')
        localStorage.removeItem('tempmasukOnDestroy')

        localStorage.removeItem('tempformulaName')
        this.router.navigate(['/payroll/element','ele-form'],{
            queryParams: {
                id: this.methodServices.encryptOnline(dataRow.id.toString()),
                name: this.methodServices.encryptOnline(dataRow.elementName.toString()),
                description: this.methodServices.encryptOnline(dataRow.description),
                formula: this.methodServices.encryptOnline(dataRow.formulaId.toString()),
                effectiveDate: this.methodServices.encryptOnline(dataRow.effectiveDate.toString()),
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
      this.urlEndParse = 'ELEMENT FORM'
      localStorage.setItem('changeValue','0');
      let encrypt_status = this.methodServices.encryptOnline('new')
      this.router.navigate(['/payroll/element','ele-form'],
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
      this.methodServices.getUrlApi('/api/admin/payelementtypes',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
      if (typeof(result) == 'object')
      {
          for(var key in result){
              if (key == 'content'){
                  this.rows = [];
                  this.temp = [];
                  for(var i=0;i<result[key].length;i++){
                      effectiveDateConvert = new Date(result[key][i].effectiveDate);
                      effectiveDateConvertStr = new DatePipe('en-US').transform(effectiveDateConvert,'dd-MMM-yyyy')
                      
                      // let abc = new Date(effectiveDateConvertStr.toString())
                      // alert(abc)

                      this.rows.push({
                                  id:result[key][i].id,
                                  elementName:result[key][i].name,
                                  reportingName:result[key][i].reportingName,
                                  description:result[key][i].description,
                                  effectiveDate:effectiveDateConvertStr,
                                  elementClassification:result[key][i].payElementClassifications.name,
                                  elementClassificationId:result[key][i].payElementClassifications.id,
                                  elementClassificationDate:result[key][i].payElementClassifications.effectiveDate,
                                  elementClassificationPriorityStart:result[key][i].payElementClassifications.priorityStart,
                                  elementClassificationPriorityEnd:result[key][i].payElementClassifications.priorityEnd,
                                  elementClassificationCompanyId:result[key][i].payElementClassifications.companyId,
                                  elementClassificationActive:result[key][i].payElementClassifications.active,
                                  priority:result[key][i].priority,
                                  proration:result[key][i].proration,
                                  recurring:result[key][i].recurring ? 'Yes' : 'No',
                                  terminationRule:result[key][i].terminationRule,
                                  active:result[key][i].active ? 'Yes' : 'No',
                                  formulaId:result[key][i].payFormulas != null ? result[key][i].payFormulas.id : ""
                              })
                  }
              }
          }
          this.temp = this.rows;
          this.methodServices.filterTempObject = [...this.rows]
      }
      },this.params);

      // setTimeout(()=>{
        // this.temp = [...this.rows];
        // this.methodServices.selectedTemp = [...this.rows];
      // },800)
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

    activeStatusProc(){
      let activeStatus:boolean = !this.modelActiveStatus      
      let dateTemp = new Date(this.modelEffectiveDate)
      let dateTempConv = new DatePipe('en-us').transform(dateTemp,'yyyy-MM-dd')

      if (activeStatus == true){
          if(this.modelAllDate == true){
            this.rows = [];
            this.elementClassLoad(undefined,true)
          }
          else{
            this.rows = [];
            this.elementClassLoad('&effectivedate=' + dateTempConv,true)
          }
      }
      else{
          if(this.modelAllDate == true){
            this.rows = [];
            this.elementClassLoad(undefined,false)
          }
          else{
            this.rows = [];
            this.elementClassLoad('&effectivedate=' + dateTempConv,false)
          }
      }
    }

    backTable(event) {
      if (event.toLowerCase() == 'element'){
        this.router.navigate(['/payroll/element'])
        this.methodServices.aktif_table.next(true)
      }
    }
    
}
