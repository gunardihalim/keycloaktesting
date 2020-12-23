import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef, DoCheck, AfterViewInit, AfterContentInit } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as CryptoJS from 'crypto-js'

import * as moment from 'moment'
import { format } from 'path';
import {environment} from "../../../../environments/environment";

@Component({
    selector:"work-structure-list-position-list",
    templateUrl:"work-structure-position-list.component.html",
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

export class WorkStructurePositionListComponent implements OnInit, AfterContentInit {
  
arrBreadCrumb = ['Work Structure','Position']

url:string;
urlEnd:string;
urlEndParse:string;

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeIdSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

modelActiveStatus: boolean = true;
modelAllDate:boolean = true;
readOnlyAsOfDate:boolean = true;

@Input() aktifTableTemp:boolean;
@ViewChild('nativeEffectiveDate') nativeEffectiveDate:ElementRef
@ViewChild('workPosition') table

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
    selected: any[] = [];
    temp = [];
    activeRow: any;
    rows: any = [];
    modelEffectiveDate:any;
    columns:any = [];
    modelCari:any;
  variabel:any;
    @ViewChild('cari') cari:ElementRef;

    ngOnInit(){ 
        if(typeof(this.modelEffectiveDate)== 'undefined'){
          let effectiveDateHome = new Date();
          let effectiveDateHomeConv = new DatePipe('en-us').transform(effectiveDateHome,'dd-MMM-yyyy')
          this.modelEffectiveDate = effectiveDateHomeConv          
        }        
        // let formatedDate = new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd')
        // this.modelEffectiveDate = moment(this.modelEffectiveDate).format('yyyy MM dd')
        // this.modelEffectiveDate = moment(formatedDate,'yyyy-MM-dd').format('MMM d yyyy')

        if (this.methodServices.seasonKey == null) {
          this.methodServices.readLocalStorageKey()
        }

        this.methodServices.aktif_table.subscribe(result=>{
            this.aktif_table = result
            setTimeout(()=>{
              this.temp = [...this.rows];
            },800)
        })

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

          if (this.urlEndParse == 'POSITION'){
            this.aktif_table = true
            // this.elementClassLoad()

            this.modelActiveStatus = !this.modelActiveStatus
            this.activeStatusProc()
            this.modelActiveStatus = !this.modelActiveStatus
          }
          else
          {
            this.aktif_table = false
          }
        })
        //Employee List
        // this.params = "page=0&size=3000"
        // this.methodServices.getUrlApi('/api/position/find',
        // localStorage.getItem(this.methodServices.seasonKey),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     for(var key in result){
        //         if (key == 'content'){
        //             for(var i=0;i<result[key].length;i++){
        //                 this.rows.push({
        //                             number: i + 1,
        //                             effectiveDate:'01-Jan-2020',
        //                             activeStatus:true ? 'Yes' : 'No',
        //                             positionName:result[key][i].name,
        //                             organizationName:result[key][i].organization ? result[key][i].organization.name : '',
        //                             jobName:result[key][i].jobTitle ? result[key][i].jobTitle.name : ''})     
        //             }
        //         }
        //     }
        //    setTimeout(()=>{
        //      this.temp = [...this.rows];
        //      this.methodServices.filterTempObject = [...this.rows]
        //    },800) 
        // }
        // },this.params);
        
        // this.rows = [
        //   {
        //       effectiveDate:'01-Jan-2020',
        //       activeStatus:true ? 'Yes' : 'No',
        //       positionName:'Supervisor',
        //       description:'Work as Supervisor',
        //       organizationName:'Company',
        //       jobName:'Head IT',
        //       locationName:'Jakarta'
        //   },
        //   {
        //       effectiveDate:'25-Mar-2020',
        //       activeStatus:true ? 'Yes' : 'No',
        //       positionName:'Manager',
        //       description:'Work as Manager',
        //       organizationName:'Company',
        //       jobName:'Head of Finance',
        //       locationName:'Jakarta'
        //   }
        // ]
        // setTimeout(()=>{
        //   if(this.temp.length>=0){
        //     this.temp.splice(0,this.temp.length)
        //   }
        //   this.temp = [...this.rows]
        // },800)
    

        
        // this.columns = [
        //   {name:'Effective Date', prop:'effectiveDate'},
        //   {name:'Active Status', prop:'activeStatus'},
        //   {name:'Position Name', prop:'positionName'},
        //   {name:'Description', prop:'description'},
        //   {name:'Organization Name', prop:'organizationName'},
        //   {name:'Job Name', prop:'jobName'},
        //   {name:'Location Name', prop:'locationName'}
        // ]
        // var columnWidths = [
        //   {column: "effectiveDatea", width: 1},
        //   {column: "activeStatus", width: 1},
        //   {column: "positionName", width: 1},
        //   {column: "description", width: 10},
        //   {column: "organizationName", width: 1},
        //   {column: "jobName", width: 1},
        //   {column: "locationName", width: 1},
        // ]
        // this.columns.forEach((col: any) => {
        //   const colWidth = columnWidths.find(colWidth => colWidth.column === col.prop);
        //   if (colWidth) {
        //     col.width = colWidth.width;
        //   }
        // });
        // console.log(this.columns)
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

    filterTable2(valuee) {
      let val = valuee.toLowerCase();
      this.temp = this.rows.filter(function(d) {
        for(var key in d){
          if(d[key].toString().toLowerCase().indexOf(val) !== -1){
            return true;
          }
        }
        return false;
      });
    }

    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       if (this.selected.length > 0){
         let id = this.methodServices.encryptOnline(this.selected[0].id.toString())
         let effectiveDate = this.methodServices.encryptOnline(this.selected[0].effectiveDate)
         let positionName = this.methodServices.encryptOnline(this.selected[0].positionName)
         let active = this.methodServices.encryptOnline(this.selected[0].activeStatus == 'Yes' ? "true" : "false")
         let organizationName = this.methodServices.encryptOnline(this.selected[0].organizationName)
         let jobName = this.methodServices.encryptOnline(this.selected[0].jobName)
         this.aktif_table = false
        //  this.urlEndParse = 'POSITION'
         this.router.navigate(['/work-structure/position','position-form'],
                {queryParams:{id:id,
                            effectiveDate:effectiveDate,
                            positionName:positionName,
                            active:active,
                            organizationName:organizationName,
                            jobName:jobName}
                })
       }
    }

    redirectForm(dataRow) {
        this.aktif_table = false
        this.router.navigate(['/work-structure/position','position-form'],{
            queryParams: {
                id: this.methodServices.encryptOnline(dataRow.id.toString()),
                positionName: this.methodServices.encryptOnline(dataRow.positionName.toString()),
                organizationName: this.methodServices.encryptOnline(dataRow.organizationName.toString()),
                jobName: this.methodServices.encryptOnline(dataRow.jobName.toString()),
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
   
    change_aktif_tabel(){
      this.aktif_table = !this.aktif_table

      this.urlEndParse = "EMPLOYEE"
      this.router.navigate(['employee'])
    }

    aktifTableChange(status){
      this.aktif_table = true
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
      
      
      if (typeof(filter) != 'undefined'){
        this.params += filter
      }

      this.methodServices.getUrlApi('/api/position/find',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
        if (typeof(result) == 'object')
        {
            for(var key in result){
                if (key == 'content'){
                  this.rows = [];
                  this.temp = [];
                    for(var i=0;i<result[key].length;i++){
                        this.rows.push({
                                    id:result[key][i].id,
                                    number: i + 1,
                                    effectiveDate:'01-Jan-2020',
                                    activeStatus:true ? 'Yes' : 'No',
                                    positionName:result[key][i].name,
                                    organizationName:result[key][i].organization ? result[key][i].organization.name : '',
                                    jobName:result[key][i].jobTitle ? result[key][i].jobTitle.name : ''})     
                    }
                }
            }
            this.temp = [...this.rows];
            this.methodServices.filterTempObject = [...this.rows] 
        }
        },this.params);

        setTimeout(()=>{
          this.temp = [...this.rows];
          this.methodServices.filterTempObject = [...this.rows] 
        },800)
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

    backTable(event){
      if (event.toLowerCase() == 'work structure' || 
          event.toLowerCase() == 'position'){
            this.router.navigate(['/work-structure/position'])
            this.methodServices.aktif_table.next(true)
          }
    }

    // ubahtanggal(event){
    //   this.nativeEffectiveDate.nativeElement.setAttribute("data-date",
    //         moment(event.target.value,'yyyy-MM-dd').format(this.nativeEffectiveDate.nativeElement.
    //                 getAttribute("data-date-format")))
    // }

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

  getData(){

    // this.cari.nativeElement.value = 'adads'
    // this._ele.nativeElement.querySelector('input').style.display = 'none'
  }    
  ngAfterContentInit(){
    
  }
}
