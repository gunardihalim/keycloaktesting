import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';


@Component({
    selector:"work-structure-peoplegroup-form",
    templateUrl:"work-structure-peoplegroup-form.component.html",
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

export class WorkStructurePeopleGroupFormComponent implements OnInit, OnDestroy {

@ViewChild('f') f:NgForm;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

bsValue = new Date()

aktif_table:boolean =  true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeNoSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

firstName:string = '';

modelFirstName:string = '';
modelMiddleName:string = '';
modelLastName:string = '';
modelPlaceOfBirth:string = '';
modelDateOfBirth:any;
modelAge:number;
modelReligion:string;
modelGender:string;
modelMarital:string;
modelPeopleGroupName:string;
modelActiveStatus:boolean;
modelDescriptionName:string;

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private router:Router){
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
    
    employeeId:string;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:string;
    readOnlyInput:boolean = false;
    readOnlyInputSelect:boolean = false;

    ngOnInit(){
        let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'yyyy-MM-dd')
        this.modelEffectiveDate = formatedDate;

        // this.activatedRoute.params.subscribe(result => {
        //     var url = this.location.prepareExternalUrl(this.location.path())
        //     var urlEnd = url.lastIndexOf("/") + 1
        //     this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()
    
        //     //No Get QUery Params
        //     var urlQuestion = this.urlEndParse.indexOf("?")
        //     if (urlQuestion != -1){
        //       var urlFinal = this.urlEndParse.slice(0,urlQuestion)
        //       this.urlEndParse = urlFinal
        //     }  
        // })

        // this.activatedRoute.queryParams.subscribe(result=>{
        //     this.employeeId = result.employeeid
        // })
        
        // Religion
        // this.params = "page=0&size=3000"
        // if (this.religionFinal.length >= 0){
        //     this.religionFinal.splice(0,this.religionFinal.length)
        // }

        // this.methodServices.getUrlApi('/api/admin/dashboardhr/totalreligion',
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     for(var key in result){
        //         if(result[key].religion != null && result[key].religion != '')
        //         {
        //             this.religionFinal.push(result[key].religion)
        //         }
        //     }
        // }
        // });

        //Gender
        // this.methodServices.getUrlApi('/api/admin/dashboardhr/totalgender',
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     for(var key in result){
        //         if(result[key].gender != null && result[key].gender != '')
        //         {
        //             this.genderFinal.push(result[key].gender)
        //         }
        //     }
        // }
        // });

        //Employee Detail
        // this.activatedRoute.queryParams.subscribe(result=>{
        //     this.employeeId = result.employeeid;
        // })
        
        // this.methodServices.getUrlApi('/api/employee/' + this.employeeId,
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     this.modelFirstName = result.firstName;
        //     this.modelMiddleName = result.middleName;
        //     this.modelLastName = result.lastName;
        //     this.modelPlaceOfBirth = result.birthPlace;
            //Date Of Birth
            // this.modelDateOfBirth = result.birthDate;
            // var dateParse = new Date(this.modelDateOfBirth)
            // var dateParseFormat = new DatePipe('en-US').transform(dateParse,'yyyy-MM-dd')
            // this.modelDateOfBirth = dateParseFormat
            //----
            //Age
            // let today = new Date()
            // let ageDiffer = Math.floor(((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
            //                 -
            //                 Date.UTC(dateParse.getFullYear(),dateParse.getMonth(),dateParse.getDate())
            //                 ) / (1000 * 60 * 60 * 24 * 365)))
            // this.modelAge = ageDiffer
            //----
            
        //     this.modelReligion = result.religion;
        //     this.modelGender = result.gender;
        //     this.modelMarital = result.maritalStatus;
        // }
        // });
    }
    ngOnDestroy(){
        this.aktifTableTemp.emit(true)
    }
}