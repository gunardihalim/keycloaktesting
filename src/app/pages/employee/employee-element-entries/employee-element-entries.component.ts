import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as moment from 'moment'
import { format } from 'path';

import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'

@Component({
    selector:"employee-element-entries",
    templateUrl:"employee-element-entries.component.html",
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

export class EmployeeElementEntriesComponent implements OnInit {
  
url:string;
urlEnd:string;
urlEndParse:string;

aktif_table:boolean = true;
aktif_table_child:boolean = true;
aktif_error:boolean = false;

class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeIdSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

@Input() aktifTableTemp:boolean;
@ViewChild('nativeEffectiveDate') nativeEffectiveDate:ElementRef
@ViewChild('empElementEntries') table

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
    employeeId:any;
    assignmentId:any;

    ngOnInit(){
        this.methodServices.aktif_table_child.subscribe(result=>{
            this.aktif_table_child = result
            // setTimeout(()=>{
            //   this.temp = []
            //   this.temp = [...this.rows];
            // },800)
        })

        this.methodServices.filterTemp.subscribe((result)=>{
          setTimeout(()=>{
          //   console.log('Hasil \n')
          // console.log(this.methodServices.filterTempObject)
            // console.log(result)
            this.temp = []
            this.temp = [...this.methodServices.filterTempObject]
          },190)
        })

        let formatedDate = new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd')
        // this.modelEffectiveDate = moment(this.modelEffectiveDate).format('yyyy MM dd')
        this.modelEffectiveDate = moment(formatedDate,'yyyy-MM-dd').format('MMM d yyyy')

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

          if (this.urlEndParse != 'ELEMENT ENTRIES'){
              this.aktif_table_child = false
          }
          else
          {
            this.aktif_table_child = true 
          }

          if(typeof(result.employeeid) != 'undefined'){
              this.employeeId = this.methodServices.decryptOnline(result.employeeid)
          }

          this.getAssignmentIdProc((resAss)=>{
            //Get List Element Entries
            this.params = "assignmentid=" + resAss
            this.methodServices.getUrlApi('/api/admin/payelemententries',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
            if (typeof(result) == 'object')
            {
                this.rows = [];
                for(var i=0;i<result.length;i++){
                    this.rows.push({
                                active:result[i].active ? 'Yes' : 'No',
                                id:result[i].id,
                                elementName:result[i].elementTypeName,
                                elementId:result[i].elementTypeId,
                                companyId:result[i].companyId,
                                effectiveDate:result[i].effectiveDate,
                                assignmentId:result[i].assignmentId,
                                processingType:result[i].processingType,
                                valueEncrypt:result[i].valueEncrypt,
                                value:result[i].valueEncrypt == null || result[i].valueEncrypt == '' 
                                      ? null : this.methodServices.decryptValue(result[i].valueEncrypt)
                              })     
                }
                this.temp = this.rows;
            }
            },this.params);
          })
        })

        // this.rows = [
        //   {
        //       elementName:'Gaji Pokok',
        //       processingType:'Recurring',
        //       value:8000000,
        //   },
        //   {
        //       elementName:'Tunjangan Posisi',
        //       processingType:'Recurring',
        //       value:400000,
        //   },
        //   {
        //       elementName:'Potongan Pensiun',
        //       processingType:'Recurring',
        //       value:100000,
        //   },
        //   {
        //       elementName:'Bonus',
        //       processingType:'Non Recurring',
        //       value:10000000,
        //   },
        //   {
        //       elementName:'THR',
        //       processingType:'Non Recurring',
        //       value:8000000,
        //   }
        // ]

        // this.temp.push(...this.rows)
        setTimeout(()=>{
          this.temp = []
          this.temp = [...this.rows];
          this.methodServices.filterTempObject = [...this.rows]
        },1100)
    }

    getAssignmentIdProc(callback){
      //GET ASSIGNMENT ID
      this.params = "employeeid=" + this.employeeId
      this.methodServices.getUrlApi('/api/admin/employee/assignment',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
      if (typeof(result) == 'object')
      {
          for(var key in result){
              if (key == 'assignmentId'){
                this.assignmentId = result[key]
              }
          }
          callback(this.assignmentId)
      }
      },this.params);
    }


    entriesChange($event){
      this.entries = Number($event.target.value);
    }
    filterTable($event) {
      let val = $event.target.value.toLowerCase();
      this.temp = this.rows.filter(function(d) {
        for(var key in d){
          if (key == 'elementName' || key == 'processingType' || key == 'value'){
            if (d[key] != null){
              if(d[key].toString().toLowerCase().indexOf(val) !== -1){
                return true;
              }
            }
          }
        }
        return false;
      });
      this.methodServices.filterTempObject = [...this.temp]
    }

    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       if (this.selected.length > 0){
          let idEntries = this.methodServices.encryptOnline(this.selected[0].id.toString())
          let effectiveDate = this.methodServices.encryptOnline(this.selected[0].effectiveDate)
          let elementName = this.methodServices.encryptOnline(this.selected[0].elementName)
          let elementIdEnc = this.methodServices.encryptOnline(this.selected[0].elementId.toString())
          let assignmentId = this.methodServices.encryptOnline(this.selected[0].assignmentId)
          let processingType = this.methodServices.encryptOnline(this.selected[0].processingType)
          let activeEntries = this.methodServices.encryptOnline((this.selected[0].active == "Yes" ? true : false).toString())
          let valueEntries = this.selected[0].value
          let valueEncrypt = this.selected[0].valueEncrypt

          this.aktif_table_child = false

         this.router.navigate(['/employee/element-entries','element-entries-form'],
                  { queryParams:{
                      elementName:elementName,
                      elementId:elementIdEnc,
                      effectiveDateEntries:effectiveDate,
                      assignmentId:assignmentId,
                      processingType:processingType,
                      activeEntries:activeEntries,
                      idEntries:idEntries,
                      valueEncrypt:valueEncrypt,
                      status:null
                    },
                    queryParamsHandling:'merge'
                  })
       }
    }

    redirectForm(dataRow) {
        this.aktif_table_child = false
        this.router.navigate(['/employee/element-entries','element-entries-form'],{
            queryParams: {
                idEntries: this.methodServices.encryptOnline(dataRow.id.toString()),
                elementId: this.methodServices.encryptOnline(dataRow.elementId.toString()),
                elementName: this.methodServices.encryptOnline(dataRow.elementName.toString()),
                effectiveDateEntries: this.methodServices.encryptOnline(dataRow.effectiveDate.toString()),
                assignmentId: this.methodServices.encryptOnline(dataRow.assignmentId.toString()),
                processingType: this.methodServices.encryptOnline(dataRow.processingType.toString()),
                valueEncrypt: dataRow.valueEncrypt,
                status:null,
                activeEntries: this.methodServices.encryptOnline((dataRow.active == 'Yes' ? 'true' : 'false'))
            },
            queryParamsHandling:'merge'
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
      this.aktif_table = !this.aktif_table

      this.urlEndParse = "EMPLOYEE"
      this.router.navigate(['employee'])
    }

    aktifTableChange(status){
      this.aktif_table = true
    }
    
    // ubahtanggal(event){
    //   this.nativeEffectiveDate.nativeElement.setAttribute("data-date",
    //         moment(event.target.value,'yyyy-MM-dd').format(this.nativeEffectiveDate.nativeElement.
    //                 getAttribute("data-date-format")))
    // }
  
    newRecord(){
        this.aktif_table_child = false
        localStorage.setItem('new','1')
        this.router.navigate(['/employee/element-entries','element-entries-form'],
                  { queryParams:{
                      status:this.methodServices.encryptOnline('new'),
                      assignmentId:this.methodServices.encryptOnline(this.assignmentId.toString())
                    },
                    queryParamsHandling:'merge'
                  })      
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
}
