import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentInit, HostListener, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'

import { diffrentDate } from "../../../validation-global/diffrent-date";

import { canComponentDeactive } from 'src/app/services/deactivate-guard'

import {ToastrService} from "ngx-toastr";
import swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';


@Component({
    selector:"payroll-groups-form",
    templateUrl:"payroll-groups-form.component.html",
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

export class PayrollGroupsFormComponent implements OnInit, AfterViewInit, canComponentDeactive {

showSkeletonText:boolean = true;

cancelStatus:boolean = false;

tempPayrollName:string;
tempDescription:string;
tempFirstPeriodDom:string;

@ViewChild('payrollName') payrollName:ElementRef;
@ViewChild('description') description:ElementRef;
@ViewChild('firstPeriodDOM') firstPeriodDOM:ElementRef;
@ViewChild('paySlipDOM') paySlipDOM:ElementRef;
@ViewChild('cutDOM') cutDOM:ElementRef

option:boolean;

@HostListener('window:beforeunload',['$event'])
canDeactivate(event:BeforeUnloadEvent){
    event.returnValue = true
}

canLeave(){
    if (this.cancelStatus == false){
        if (this.statusChange == true){
            this.option = confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
            if (this.option === false){
                this.methodServices.aktif_table.next(false)
                if (typeof(localStorage.getItem('effectivedate')) != 'undefined' &&
                    localStorage.getItem('effectivedate') != null &&
                    localStorage.getItem('effectivedate') != '' )
                {
                    let dateLocaleConv = new Date(localStorage.getItem('effectivedate'))
                    this.modelEffectiveDate = dateLocaleConv
                }
                if (typeof(localStorage.getItem('payrollname')) != 'undefined' &&
                    localStorage.getItem('payrollname') != null &&
                    localStorage.getItem('payrollname') != '' )
                {
                    this.modelPayrollName = localStorage.getItem('payrollname')
                }
                if (typeof(localStorage.getItem('description')) != 'undefined' &&
                    localStorage.getItem('description') != null &&
                    localStorage.getItem('description') != '' ){
                    this.modelDescription = localStorage.getItem('description')
                }
                if (typeof(localStorage.getItem('firstperioddom')) != 'undefined' &&
                    localStorage.getItem('firstperioddom') != null &&
                    localStorage.getItem('firstperioddom') != '' ){
                    this.modelFirstPeriodDOM = localStorage.getItem('firstperioddom')
                }
                if (typeof(localStorage.getItem('activestatus')) != 'undefined' &&
                    localStorage.getItem('activestatus') != null &&
                    localStorage.getItem('activestatus') != '' ){
                    this.modelActiveStatus = localStorage.getItem('activestatus') == 'true' ? true : false
                }
                if (typeof(localStorage.getItem('payslipdom')) != 'undefined' &&
                    localStorage.getItem('payslipdom') != null &&
                    localStorage.getItem('payslipdom') != '' ){
                    this.modelPayslipDOM = localStorage.getItem('payslipdom')
                }
                if (typeof(localStorage.getItem('cutdom')) != 'undefined' &&
                    localStorage.getItem('cutdom') != null &&
                    localStorage.getItem('cutdom') != '' ){
                    this.modelCutDOM = localStorage.getItem('cutdom')
                }
            }
        }
        else{
            this.option = true
        }        
    }
    else{
        this.option = true
    }
    localStorage.removeItem('payrollname')
    localStorage.removeItem('description')
    localStorage.removeItem('firstperioddom')
    localStorage.removeItem('effectivedate')
    localStorage.removeItem('activestatus')
    localStorage.removeItem('payslipdom')
    localStorage.removeItem('cutdom')

    return this.option
}


@ViewChild('f') f:NgForm;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

bsValue = new Date()

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeNoSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

defaultModalDeleteId:BsModalRef;

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
modelLocation:string;
modelPosition:string;
modelGrade:string;
modelOrganization:string;
modelJob:string;
modelPrimary:boolean;
modelAssignmentAction:string;
modelAssignmentStatus:string;
modelPeopleGroup:string;
modelPayroll:string;
modelReportingName:string;
modelElementClassification:any;
modelPriority:number;
modelRecurring:boolean;
modelProration:boolean;

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private router:Router,
                private diffrentDate:diffrentDate,
                private toastr:ToastrService,
                private http:HttpClient){
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
    
    id:string;
    decrypt_id: any;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:any;
    modelEffectiveDateCheck:any;
    modelActiveStatus:boolean=true;
    modelName:string;
    modelDescription:string;
    modelPriorityStart:number;
    modelPriorityEnd:number;
    modelTerminationRule:string;

    readOnlyInput:boolean = false;
    readOnlyInputSelect:boolean = false;
    
    aktif_error:boolean = false;
    disabledSubmit:boolean = true;

    alert_error_msg:string = '';
    alert_success_msg:string = '';

    loginCompanyId:any;
    status = '';
    rowsType = [];
    tempType = [];
    selectedTemp = [];

    modelPayrollName:string;
    modelElementName:string;
    modelFirstPeriodDOM:any;
    modelCutDOM:any;
    modelPayslipDOM:any;

    statusChange:boolean = false;

    ngOnInit(){
        let formatedDate = new Date(this.as_of_date)
        this.modelEffectiveDate = formatedDate;

        //GET USER LOGIN => COMPANYID
        // this.methodServices.getUserLogin((result)=>{
        //     this.loginCompanyId = Number(result.loginCompanyId)
        // });
        if (localStorage.getItem('company') != null){
            let decryptCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.loginCompanyId = Number(decryptCompany)
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
            var url = this.location.prepareExternalUrl(this.location.path())
            var urlEnd = url.lastIndexOf("/") + 1
            this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()
    
            //No Get QUery Params
            var urlQuestion = this.urlEndParse.indexOf("?")
            if (urlQuestion != -1){
              var urlFinal = this.urlEndParse.slice(0,urlQuestion)
              this.urlEndParse = urlFinal
            }  
            if (this.urlEndParse != 'GROUP'){
                this.methodServices.aktif_table.next(false)
            }

            this.id = result.id
            this.status = result.status
            
            if(typeof(result.id) != 'undefined'){
                this.decrypt_id = Number(this.methodServices.decryptOnline(result.id))
                // let decrypt_id = CryptoJS.AES.decrypt(result.id,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                // alert(this.decrypt_id)
            }
            if(typeof(result.effectiveDate) != 'undefined'){
                let decrypt_effectivedate = this.methodServices.decryptOnline(result.effectiveDate)
                let dateConv = new Date(decrypt_effectivedate)
                this.modelEffectiveDate = dateConv
            }
            if(typeof(result.groupName) != 'undefined'){
                let decrypt_groupname = this.methodServices.decryptOnline(result.groupName)
                this.modelPayrollName = decrypt_groupname
            }
            if(typeof(result.description) != 'undefined'){
                let decrypt_description = this.methodServices.decryptOnline(result.description)
                this.modelDescription = decrypt_description
            }
            if(typeof(result.active) != 'undefined'){
                let decrypt_active = this.methodServices.decryptOnline(result.active)
                this.modelActiveStatus = decrypt_active == 'true' ? true : false
            }
            if(typeof(result.payslipDom) != 'undefined'){
                let decrypt_payslipDom = this.methodServices.decryptOnline(result.payslipDom)
                this.modelPayslipDOM = decrypt_payslipDom
            }
            if(typeof(result.cutOffDom) != 'undefined'){
                let decrypt_cutOffDom = this.methodServices.decryptOnline(result.cutOffDom)
                this.modelCutDOM = decrypt_cutOffDom
            }
            if(typeof(result.periodEndDom) != 'undefined'){
                let decrypt_periodEndDom = this.methodServices.decryptOnline(result.periodEndDom)
                this.modelFirstPeriodDOM = decrypt_periodEndDom
            }

            if (typeof(result.status) != 'undefined'){
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                if (decrypt_status == 'new'){
                    this.disabledSubmit = false
                }
                this.status = decrypt_status
            }

            this.showSkeletonText = false;
        })
 
        // Element
        // this.params = "page=0&size=10"

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

    }

    // getElementTypesLocal(id,callback){
    //     this.selectedTemp = [];
    //     this.methodServices.getUrlApi('/api/admin/payelementtypes?page=0&size=100',
    //         localStorage.getItem('Token'),
    //         (result)=>{
    //         if (typeof(result) == 'object')
    //         {
    //             for(var key in result){
    //                 if (key == 'content'){
    //                     for(var i=0;i<result[key].length;i++){
    //                         let effectiveDateConvert = new Date(result[key][i].effectiveDate);
    //                         let effectiveDateConvertStr = new DatePipe('en-US').transform(effectiveDateConvert,'dd-MMM-yyyy')
                            
    //                         // let abc = new Date(effectiveDateConvertStr.toString())
    //                         // alert(abc)

    //                         this.selectedTemp.push({
    //                                     id:result[key][i].id,
    //                                     elementName:result[key][i].name,
    //                                     reportingName:result[key][i].reportingName,
    //                                     description:result[key][i].description,
    //                                     effectiveDate:effectiveDateConvertStr,
    //                                     elementClassification:result[key][i].payElementClassifications.name,
    //                                     elementClassificationId:result[key][i].payElementClassifications.id,
    //                                     elementClassificationDate:result[key][i].payElementClassifications.effectiveDate,
    //                                     elementClassificationPriorityStart:result[key][i].payElementClassifications.priorityStart,
    //                                     elementClassificationPriorityEnd:result[key][i].payElementClassifications.priorityEnd,
    //                                     elementClassificationCompanyId:result[key][i].payElementClassifications.companyId,
    //                                     elementClassificationActive:result[key][i].payElementClassifications.active,
    //                                     priority:result[key][i].priority,
    //                                     proration:result[key][i].proration,
    //                                     recurring:result[key][i].recurring,
    //                                     terminationRule:result[key][i].terminationRule,
    //                                     active:result[key][i].active
    //                                 })     
    //                     }
    //                 }
    //             }
    //             this.selectedTemp = this.selectedTemp.filter(resultChild=>{
    //                 return id == resultChild.id
    //             })
    //             console.log(this.selectedTemp)
    //             callback()
    //         }
    //         });
    // }

    dateChangeProd($event) {
        let inputStr;
        let dateStr;
        let tempInputStr;
        let tesDate;

        if (typeof($event) != 'undefined' && $event != null) {
            tempInputStr = $event;
            tesDate = new Date(tempInputStr)                
            if (tesDate == 'Invalid Date'){
                return
            }
            inputStr = new DatePipe('en-us').transform(tempInputStr,'dd-MMM-yyyy')

            dateStr = new Date(inputStr)
            this.modelEffectiveDateCheck = dateStr
            // alert(this.modelEffectiveDateCheck)
        }
    }

    submitProc(){
        this.modelPayrollName = this.payrollName.nativeElement.value
        this.modelDescription = this.description.nativeElement.value
        this.modelFirstPeriodDOM = Number(this.firstPeriodDOM.nativeElement.value)
        this.modelPayslipDOM = Number(this.paySlipDOM.nativeElement.value)
        this.modelCutDOM = Number(this.cutDOM.nativeElement.value)
        // console.log(this.modelEffectiveDateCheck, this.modelPayrollName, this.modelDescription, this.modelFirstPeriodDOM, this.modelPayslipDOM, this.modelCutDOM)
        // console.log(typeof(this.modelFirstPeriodDOM), typeof(this.modelPayslipDOM), typeof(this.modelCutDOM))
        // return
        this.alert_success_msg = '';
        let validDate = this.diffrentDate.notAllowFucture(this.modelEffectiveDateCheck, this.as_of_date) // return true or false
        let isValid = true
        let statusMsg = ''

        if (validDate) {
            statusMsg = "Effective Date must be less than or equal to as of date"
            isValid = false
        }

        if (this.modelEffectiveDateCheck == "Invalid Date") {
            statusMsg = "Effective Date must DD-MMM-YYY e.g. 01-Jan-2020"
            isValid = false
        }

        if (typeof(this.modelPayrollName) == 'undefined' || this.modelPayrollName == "") {
            statusMsg ='Name can\'t be Blank !'
            isValid = false
        }

        if (isValid) {
            this.alert_error_msg = ''            
            // postData(dataObj,urlapi,callback)

            let dataObj = {
                "id":this.decrypt_id,
                "name":this.modelPayrollName,
                "description":this.modelDescription,
                "payslipDom":this.modelPayslipDOM,
                "cutOffDom":this.modelCutDOM,
                "periodEndDom":this.modelFirstPeriodDOM,
                "effectiveDate": new DatePipe('en-us').transform(this.modelEffectiveDateCheck,'yyyy-MM-dd'),
                "active":this.modelActiveStatus,
                "companyId":this.loginCompanyId
            }

            if (this.status === "new") {
                // dataObj.active = true
                delete dataObj.id
            }

            console.log(dataObj)

            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/paypayrollgroups',
                (err,success)=>{
                    if (err != ''){
                        this.alert_error_msg = err
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.showToast("Submit Payroll Group successfuly", 'success')
                        window.scrollTo(0,0)
                        this.cancelStatus = true
                        this.router.navigate(['payroll','group'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        } else {
            this.showToast(statusMsg, 'error')
        }
    }

    deleteItemId(){
        // this.defaultModalDeleteId = this.modalService.show(this.modalDeleteIdRev,)
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-danger',
            confirmButtonText: 'Yes, delete it',
            cancelButtonClass: 'btn btn-secondary'
        }).then((result) => {
            if (result.value) {
                this.deleteHeader();
            }
        })
    }

    deleteHeader() {
        if (this.status !== 'new') {
            if (this.defaultModalDeleteId) {
                this.defaultModalDeleteId.hide()
            }
            this.alert_success_msg = '';
            // alert(this.methodServices.decryptOnline(this.id.toString()))
            this.methodServices.postData({
                    id: this.decrypt_id
                },
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/paypayrollgroups/delete',
                (err,success)=>{
                    if (err != ''){
                        // swal.fire({
                        //     title: 'Warning!',
                        //     text: err,
                        //     type: 'warning',
                        //     buttonsStyling: false,
                        //     confirmButtonClass: 'btn btn-primary'
                        // });
                        this.showToast(err,'error')
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.showToast(success,"success")
                        this.cancelStatus = true
                        this.router.navigate(['payroll','group'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
    }

    backCancel(){
        setTimeout(()=>{
            this.router.navigate(['/payroll/group'])
            this.cancelStatus = true
            this.methodServices.aktif_table.next(true)
        },1000)
    }

    ngAfterViewInit(){
        
        // this.methodServices.selectedTemp[0].elementClassificationId = 13
        // alert(this.methodServices.selectedTemp[0].elementClassificationId)
        // this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
    }
    ngOnDestroy(){
        this.tempPayrollName = this.modelPayrollName
        this.tempDescription = this.modelDescription
        if (typeof(localStorage.getItem('effectivedate')) !='undefined'){
            localStorage.removeItem('effectivedate')
        }
        if (typeof(localStorage.getItem('payrollname')) !='undefined'){
            localStorage.removeItem('payrollname')
        }
        if (typeof(localStorage.getItem('description')) !='undefined'){
            localStorage.removeItem('description')
        }
        if (typeof(localStorage.getItem('firstperioddom')) !='undefined'){
            localStorage.removeItem('firstperioddom')
        }
        if (typeof(localStorage.getItem('activestatus')) !='undefined'){
            localStorage.removeItem('activestatus')
        }
        if (typeof(localStorage.getItem('payslipdom')) !='undefined'){
            localStorage.removeItem('payslipdom')
        }
        if (typeof(localStorage.getItem('firstperioddom')) !='undefined'){
            localStorage.removeItem('firstperioddom')
        }
        if (typeof(localStorage.getItem('cutdom')) !='undefined'){
            localStorage.removeItem('cutdom')
        }
        
        if (typeof(this.modelEffectiveDate) != 'undefined'){
            let dateLocaleConv = new Date(this.modelEffectiveDate)
            let dateLocaleConvStr = new DatePipe('en-us').transform(dateLocaleConv,'dd-MMM-yyyy')
            localStorage.setItem('effectivedate',dateLocaleConvStr)
        }
        if (typeof(this.modelPayrollName) != 'undefined'){
            localStorage.setItem('payrollname',this.modelPayrollName)
        }
        if (typeof(this.modelDescription) != 'undefined'){
            localStorage.setItem('description',this.modelDescription)
        }
        if (typeof(this.modelFirstPeriodDOM) != 'undefined'){
            localStorage.setItem('firstperioddom',this.modelFirstPeriodDOM)
        }
        if (typeof(this.modelActiveStatus) != 'undefined'){
            localStorage.setItem('activestatus',this.modelActiveStatus.toString())
        }
        if (typeof(this.modelPayslipDOM) != 'undefined'){
            localStorage.setItem('payslipdom',this.modelPayslipDOM)
        }
        if (typeof(this.modelCutDOM) != 'undefined'){
            localStorage.setItem('cutdom',this.modelCutDOM)
        }
        
        if (this.option == true){       //when canleave 
            localStorage.removeItem('payrollname')
            localStorage.removeItem('description')
            localStorage.removeItem('firstperioddom')
            localStorage.removeItem('effectivedate')
            localStorage.removeItem('activestatus')
            localStorage.removeItem('payslipdom')
            localStorage.removeItem('cutdom')
        }

        this.methodServices.aktif_table.next(false)
        // this.aktifTableTemp.emit(true)
        // this.methodServices.aktif_table.next(false)       
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
                        timeOut: 3000,
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

    changeDateProc(){
        this.statusChange = true       
    }
    changeProc(){
        this.statusChange = true       
    }

}