import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import { Select2OptionData } from 'ng-select2';
import { element } from 'protractor';

import * as CryptoJS from 'crypto-js'
import {environment} from "../../../../environments/environment";
import {ToastrService} from "ngx-toastr";

@Component({
    selector:"employee-employment",
    templateUrl:"employee-employment.component.html",
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

export class EmployeeEmploymentComponent implements OnInit {

@ViewChild('f') f:NgForm;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

showSkeletonText:boolean = true;
showSkeletonApiMaritalTaxStatus:boolean = true;

bsValue = new Date()

aktif_table:boolean = true;
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
modelNationality:string;
modelFamilyCardNo:string;
modelNoBpjsTk:string;
modelNoBpjsKesehatan:string;
modelMobilePhone:string;
modelOtherPhone1:string;
modelOtherPhone2:string;
modelOfficeEmail:string;
modelPersonalEmail:string;
photoProfile:any;
modelEmployeeNumber:string;
modelCompanyName:string;
modelEnterpriseJoinDate:any;
modelCompanyJoinDate:any;
modelTerminationDate:any
modelTerminationNote:string;
modelPayThruDate:any;
modelTerminateReason:string;
modelMaritalTaxStatus:string;
modelTaxStatus:string;
modelEmploymentId:number;

arrMaritalTaxStatus:any[] = [
    {id: 'TK0', text: 'TK0' },
    { id: 'TK1', text: 'TK1' },
    { id: 'TK2', text: 'TK2' },
    { id: 'TK3', text: 'TK3' },
    { id: 'K0', text: 'K0' },
    { id : 'K1', text: 'K1' },
    { id : 'K2', text: 'K2' },
    { id: 'K3', text: 'K3' }
]
arrTaxType = [
    {id:'Local',text:'Local'},
    {id:'Expatriate',text:'Expatriate'}
]

arrMaritalTaxStatusSelect2: Array<Select2OptionData> = [...this.arrMaritalTaxStatus]
arrTaxTypeSelect2: Array<Select2OptionData> = [...this.arrTaxType]

cancelStatus:boolean = false;

aktif_error:boolean = false;

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private toastr:ToastrService,
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
    companyName:string;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:string;
    readOnlyInput:boolean = true;
    readOnlyInputSelect:boolean = false;

    ngOnInit(){
        let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'yyyy-MM-dd')
        this.modelEffectiveDate = formatedDate;

        if (this.methodServices.seasonKey == null) {
            this.methodServices.readLocalStorageKey()
        }

        this.activatedRoute.params.subscribe(result => {
            var url = this.location.prepareExternalUrl(this.location.path())
            var urlEnd = url.lastIndexOf("/") + 1
            this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()
    
            //No Get QUery Params
            var urlQuestion = this.urlEndParse.indexOf("?")
            if (urlQuestion != -1){
              var urlFinal = this.urlEndParse.slice(0,urlQuestion)
              this.urlEndParse = urlFinal
            }  
        })

        this.activatedRoute.queryParams.subscribe(result=>{
            this.employeeId = this.methodServices.decryptOnline(result.employeeid)

            this.companyName = this.methodServices.decryptOnline(result.companyname)
            this.modelCompanyName = this.companyName
        })
        
        // Religion
        // this.params = "page=0&size=3000"
        // if (this.religionFinal.length >= 0){
        //     this.religionFinal.splice(0,this.religionFinal.length)
        // }
        // setTimeout(()=>{   
        //     this.religionFinal = [...this.methodServices.arrReligion]
        //     this.genderFinal = [...this.methodServices.arrGender]
        // },1000)

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
        
        this.methodServices.getUrlApi('/api/employee/' + this.employeeId,
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            if (result == 'Error'){
                this.aktif_error = true;
                this.router.navigate(['/employee/employment/error'],{queryParamsHandling:'merge'})
                return
            }
        if (typeof(result) == 'object')
        {
            this.aktif_error = false;
            this.modelFirstName = result.firstName;
            this.modelMiddleName = result.middleName;
            this.modelLastName = result.lastName;
            this.modelPlaceOfBirth = result.birthPlace;
            //Date Of Birth
            this.modelDateOfBirth = result.birthDate;
            var dateParse = new Date(this.modelDateOfBirth)
            var dateParseFormat = new DatePipe('en-US').transform(dateParse,'yyyy-MM-dd')
            this.modelDateOfBirth = dateParseFormat
            //----
            //Age
            let today = new Date()
            let ageDiffer = Math.floor(((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
                            -
                            Date.UTC(dateParse.getFullYear(),dateParse.getMonth(),dateParse.getDate())
                            ) / (1000 * 60 * 60 * 24 * 365)))
            this.modelAge = ageDiffer
            //----
            
            this.modelReligion = result.religion;
            this.modelGender = result.gender;
            this.modelMarital = result.maritalStatus;
            this.modelNationality = result.nationality;
            this.modelFamilyCardNo = result.familyCardNo;
            this.modelNoBpjsTk = result.bpjsTkNo;
            this.modelNoBpjsKesehatan = result.bpjsKesehatanNo;
            this.modelMobilePhone = result.mobilePhone;
            this.modelOtherPhone1 = result.mobilePhone1;
            this.modelOtherPhone2 = result.mobilePhone2;
            this.modelOfficeEmail = result.officeMail;
            this.modelPersonalEmail = result.email;            
            this.photoProfile = result.user.photoProfile;
            this.modelEmploymentId = result.employment[0].id;
            this.modelEmployeeNumber = result.employment[0].name;
            var terminationDate = new Date(result.employment[0].terminationDate)
            this.modelTerminationDate = terminationDate
            this.modelTerminationNote = result.employment[0].terminationNotes;
            this.modelMaritalTaxStatus = result.employment[0].maritalTaxStatus;

            var enterpriseJoinDate = new Date(result.hireDate)
            // this.modelEnterpriseJoinDate = new DatePipe('en-US').transform(enterpriseJoinDate,'yyyy-MM-dd')
            this.modelCompanyJoinDate = enterpriseJoinDate
            this.showSkeletonText = false;
            this.showSkeletonApiMaritalTaxStatus = false;
        }
        });
        // setTimeout(()=>{
        //     var selectrMaritalTaxStatus:any = document.getElementById('selectrMaritalTaxStatus')
        //     var selectrTaxType:any = document.getElementById('selectrTaxType')
        //     var options = {searchable:true}
        //     var selectrMaritalTaxStatusDefault = new Selectr(selectrMaritalTaxStatus,options)
        //     var selectrTaxTypeDefault = new Selectr(selectrTaxType,options)
        // },800)
    }

    backCancel(){
        localStorage.removeItem('effectivedate')
        localStorage.removeItem('elementId')
        localStorage.removeItem('processingtype')
        localStorage.removeItem('activeentries')
        localStorage.removeItem('valueentries')

        this.router.navigate(['/employee/element-entries'],{
            queryParams:{
                status:null,
                elementId:null,
                elementName:null,
                valueEncrypt:null,
                idEntries:null,
                activeEntries:null,
                processingType:null,
                assignmentId:null,
                effectiveDateEntries:null
            },
            queryParamsHandling:'merge'})
        // this.methodServices.aktif_table.next(false)
        this.methodServices.aktif_table_child.next(true)
        this.cancelStatus = true
    }

    submitProc(){
        // postData(dataObj,urlapi,callback)
        let dataObj = {
            "employmentId":Number(this.modelEmploymentId),
            "terminationDate": new DatePipe('en-us').transform(this.modelTerminationDate,'yyyy-MM-dd'),
            "maritalTaxStatus":this.modelMaritalTaxStatus
        }
        // console.log('Analyze \n')
        // console.log(dataObj)


        this.methodServices.postData(dataObj,
            localStorage.getItem(this.methodServices.seasonKey),
            '/api/user/employment/update',
            (err,success)=>{
                if (err != ''){
                    this.showToast(err,'error')
                }
                else
                if(success != ''){
                    // console.log('Success : ' + success)
                    // this.alert_success_msg = success
                    this.showToast(success,'success')
                    window.scrollTo(0,0)
                    // this.alert_success_msg = 'Data Saved Successfully ! '
                }
            }
        )
    }

    procChange(value) {
        this.modelMaritalTaxStatus = value
    }

    showToast(msg,type) {
        switch(type) {
            case 'success':
                this.toastr.show('<div class="row">'+
                    ' <div class="alert-text col-1 d-flex justify-content-center align-items-center">' +
                    ' <span class="alert-icon ni ni-bell-55 d-block mr-0" data-notify="icon"></span>' +
                    ' </div>' +
                    ' <div class="col-10">' +
                    ' <span class="alert-title" data-notify="title">Success</span>' +
                    ' <span class="toast-message" data-notify="message">'+msg+'</span></div>' +
                    ' </div>'+
                    ' </div>',
                    '',
                    {
                        timeOut: 3000,
                        closeButton: true,
                        enableHtml: true,
                        tapToDismiss: false,
                        titleClass: 'alert-title',
                        messageClass: 'w-100',
                        positionClass: 'toast-top-center',
                        toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
                    }
                );
                break;
            case 'error':
                this.toastr.show(
                    '<div class="row">'+
                    ' <div class="alert-text col-1 d-flex justify-content-center align-items-center">' +
                    ' <span class="alert-icon ni ni-bell-55 d-block mr-0" data-notify="icon"></span>' +
                    ' </div>' +
                    ' <div class="col-10">' +
                    ' <span class="alert-title" data-notify="title">Error</span>' +
                    ' <span class="toast-message" data-notify="message">'+msg+'</span></div>' +
                    ' </div>'+
                    ' </div>',
                    '',
                    {
                        timeOut: 0,
                        closeButton: true,
                        enableHtml: true,
                        tapToDismiss: false,
                        titleClass: 'alert-title',
                        messageClass: 'w-100',
                        positionClass: 'toast-top-center',
                        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
                    }
                );
                break;
        }
    }

    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

}