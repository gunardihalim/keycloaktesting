import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';

import * as moment from 'moment'
import { format } from 'path';

@Component({
    selector:"work-structure-peoplegroup-list",
    templateUrl:"work-structure-peoplegroup-list.component.html",
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

export class WorkStructurePeopleGroupListComponent implements OnInit {
  
url:string;
urlEnd:string;
urlEndParse:string;

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeIdSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

@Input() aktifTableTemp:boolean;
@ViewChild('nativeEffectiveDate') nativeEffectiveDate:ElementRef

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

    ngOnInit(){
        this.methodServices.aktif_table.subscribe(result=>{
            this.aktif_table = result
            setTimeout(()=>{
              this.temp = [...this.rows];
            },800)  
        })
        let formatedDate = new DatePipe('en-US').transform(Date.now(),'yyyy-MM-dd')
        // this.modelEffectiveDate = moment(this.modelEffectiveDate).format('yyyy MM dd')
        this.modelEffectiveDate = moment(formatedDate,'yyyy-MM-dd').format('MMM d yyyy')

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
        //   if (this.urlEndParse != 'EMPLOYEE'){
        //       this.aktif_table = false
        //   }
        //   else
        //   {
        //     this.aktif_table = true
        //   }
        })

        //Employee List
        // this.params = "page=0&size=3000"
        // this.methodServices.getUrlApi('/api/employee/find',
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     for(var key in result){
        //         if (key == 'content'){
        //             for(var i=0;i<result[key].length;i++){
        //                 this.rows.push({
        //                             employeeId:result[key][i].employeeId,
        //                             name:result[key][i].name,employeeNo:result[key][i].employeeNo,
        //                             employeeStatus:result[key][i].employeeStatus,
        //                             companyName:result[key][i].workLocationName})     
        //             }
        //         }
        //     }
        //     this.temp = this.rows;
        // }
        // },this.params);
        this.rows = [
            {
                effectiveDate:'01-Jan-2020',
                activeStatus:true,
                peopleGroupName:'Group 1',
                description:'Work as Supervisor',
            },
            {
                effectiveDate:'25-Mar-2020',
                activeStatus:true,
                peopleGroupName:'Group 2',
                description:'Work as Manager',
            }
        ]
        // this.temp.push(...this.rows)
        setTimeout(()=>{
          this.temp = [...this.rows];
        },800)
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
    }

    onSelect({selected}) {
       this.selected.splice(0, this.selected.length);
       this.selected.push(...selected);
       if (this.selected.length > 0){
         let effectiveDate = this.selected[0].effectiveDate
         let positionName = this.selected[0].positionName
         this.aktif_table = false
         this.urlEndParse = 'PEOPLE GROUP'
         this.router.navigate(['/work-structure/peoplegroup','peoplegroup-form'],
                {queryParams:{effectiveDate:effectiveDate,
                            positionName:positionName}
                })
       }
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
    
}
