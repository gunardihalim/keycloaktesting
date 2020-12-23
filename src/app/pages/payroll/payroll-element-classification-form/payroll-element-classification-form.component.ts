import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, HostListener, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { HttpClient } from '@angular/common/http';
import  * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment';
import {Subject} from "rxjs";
import {diffrentDate} from "../../../validation-global/diffrent-date";
import {ToastrService} from "ngx-toastr";
import swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector:"payroll-element-classification-form",
    templateUrl:"payroll-element-classification-form.component.html",
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


export class PayrollElementClassificationFormComponent implements OnInit {

@HostListener('window:beforeunload',['$event'])
canDeactivate(event:BeforeUnloadEvent):void{
    event.returnValue = true
}

showSkeletonText:boolean = true;
    

@ViewChild('f') f:NgForm;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

bsValue = new Date()

@ViewChild('name') name:ElementRef;
@ViewChild('description') description:ElementRef;
@ViewChild('priorityStart') priorityStart:ElementRef;
@ViewChild('priorityEnd') priorityEnd:ElementRef;

// Data untuk view PDF
// pdfSource = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
    

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

hiddenModal = new Subject<boolean>()
cancelBackStatus:boolean = false;
statusChange:boolean = false;

canLeave():boolean{
    let aktif:boolean;
    if (this.cancelBackStatus === false){
        if (this.statusChange == true){
            aktif = window.confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.')
            if (aktif === false){
                this.methodServices.aktif_table.next(false)
            }
            if(aktif === true){
                this.hiddenModal.next(true)
            }
        }
        else{
            aktif = true
        }
    }
    else{
        aktif = true
    }

    return aktif
}

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

    readOnlyInput:boolean = false;
    readOnlyInputSelect:boolean = false;
    
    aktif_error:boolean = false;
    disabledSubmit:boolean = false;
    loginCompanyId:any;
    status = '';

    alert_error_msg:string = '';
    alert_success_msg:string = '';

    ngOnInit(){
        this.modelEffectiveDate = this.as_of_date;

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
            if(typeof(result.id) != 'undefined') {
                this.decrypt_id = Number(this.methodServices.decryptOnline(result.id))
            }

            if(typeof(result.effectiveDate) != 'undefined'){
                let decrypt_effectivedate = this.methodServices.decryptOnline(result.effectiveDate)
                let dateConv = new Date(decrypt_effectivedate)
                this.modelEffectiveDate = dateConv
            }
            if(typeof(result.name) != 'undefined'){
                this.modelName = this.methodServices.decryptOnline(result.name)
            }
            if(typeof(result.description) != 'undefined'){
                this.modelDescription = this.methodServices.decryptOnline(result.description)
            }
            if(typeof(result.active) != 'undefined'){
                let decrypt_active = this.methodServices.decryptOnline(result.active)
                this.modelActiveStatus = decrypt_active == "true" ? true : false
            }
            if(typeof(result.priorityStart) != 'undefined'){
                this.modelPriorityStart = Number(this.methodServices.decryptOnline(result.priorityStart))
            }
            if(typeof(result.priorityEnd) != 'undefined'){
                this.modelPriorityEnd = Number(this.methodServices.decryptOnline(result.priorityEnd))
            }
            if (typeof(result.status) != 'undefined'){
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                if (decrypt_status == 'new'){
                    this.disabledSubmit = false
                }
                // console.log(result.status)
                // console.log(decrypt_status)
                this.status = decrypt_status
            }

            this.showSkeletonText = false;
        })
        
        // Element Classification
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
        // this.methodServices.getUrlApi('/api/employee/' + this.employeeId,
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     this.modelFirstName = result.firstName;
        //     this.modelMiddleName = result.middleName;
        //     this.modelLastName = result.lastName;
        //     this.modelPlaceOfBirth = result.birthPlace;
        //     //Date Of Birth
        //     this.modelDateOfBirth = result.birthDate;
        //     var dateParse = new Date(this.modelDateOfBirth)
        //     var dateParseFormat = new DatePipe('en-US').transform(dateParse,'yyyy-MM-dd')
        //     this.modelDateOfBirth = dateParseFormat
        //     //----
        //     //Age
        //     let today = new Date()
        //     let ageDiffer = Math.floor(((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
        //                     -
        //                     Date.UTC(dateParse.getFullYear(),dateParse.getMonth(),dateParse.getDate())
        //                     ) / (1000 * 60 * 60 * 24 * 365)))
        //     this.modelAge = ageDiffer
        //     //----
            
        //     this.modelReligion = result.religion;
        //     this.modelGender = result.gender;
        //     this.modelMarital = result.maritalStatus;
        //     this.modelNationality = result.nationality;
        //     this.modelFamilyCardNo = result.familyCardNo;
        //     this.modelNoBpjsTk = result.bpjsTkNo;
        //     this.modelNoBpjsKesehatan = result.bpjsKesehatanNo;
        //     this.modelMobilePhone = result.mobilePhone;
        //     this.modelOtherPhone1 = result.mobilePhone1;
        //     this.modelOtherPhone2 = result.mobilePhone2;
        //     this.modelOfficeEmail = result.officeMail;
        //     this.modelPersonalEmail = result.email;            
        //     this.photoProfile = result.user.photoProfile;
        // }
        // });

        // this.methodServices.getUrlApi('/api/admin/employee/assignment?employeeid=' + this.employeeId,
        // localStorage.getItem('Token'),
        // (result)=>{
        //     if (result == 'Error'){
        //         this.aktif_error = true;
        //         this.router.navigate(['/employee/assignment/error'],{queryParamsHandling:'merge'})
        //         return
        //     }
        //     if (typeof(result) == 'object')
        //     {
        //         this.modelLocation = result.workLocationName;
        //         this.modelPosition = result.positionLevelName;
        //         this.modelGrade = result.gradeName
        //     }   
        // });
    }

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
        this.modelName = this.name.nativeElement.value
        this.modelDescription = this.description.nativeElement.value
        this.modelPriorityStart = Number(this.priorityStart.nativeElement.value)
        this.modelPriorityEnd = Number(this.priorityEnd.nativeElement.value)
        // console.log(this.modelEffectiveDateCheck, this.modelName, this.modelDescription, this.modelPriorityStart, this.modelPriorityEnd)
        // console.log(typeof(this.modelPriorityStart), typeof(this.modelPriorityEnd))
        // return
        this.alert_success_msg = '';

        let validDate = this.diffrentDate.notAllowFucture(this.modelEffectiveDateCheck, this.as_of_date) // return true or false
        let isValid = true
        let statusMsg = ''

        // alert(this.modelName)

        if (validDate) {
            statusMsg = "Effective Date must be less than or equal to as of date"
            isValid = false
        }

        if (this.modelEffectiveDateCheck == "Invalid Date") {
            statusMsg = "Effective Date must DD-MMM-YYY e.g. 01-Jan-2020"
            isValid = false
        }

        if (typeof(this.modelName) == 'undefined' || this.modelName == "") {
            statusMsg ='Name can\'t be Blank !'
            isValid = false
        }

        if (typeof(this.modelPriorityStart) == 'undefined' || typeof(this.modelPriorityEnd) == 'undefined'){
            statusMsg = 'Priority Start and End can\'t be Blank !'
            isValid = false
        }


        if (isValid) {
            this.alert_error_msg = ''            
            // postData(dataObj,urlapi,callback)
            let dataObj = {
                "id":this.decrypt_id,
                "name":this.modelName,
                "description":this.modelDescription,
                "effectiveDate": new DatePipe('en-us').transform(this.modelEffectiveDateCheck,'yyyy-MM-dd'),
                "active":this.modelActiveStatus,
                "priorityStart":this.modelPriorityStart,
                "priorityEnd":this.modelPriorityEnd,
                "companyId":this.loginCompanyId
            }

            if (this.status === "new") {
                delete dataObj.id
            }


            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payelementclassifications',
                (err,success)=>{
                    if (err != ''){
                        this.showToast(err, 'error')
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.showToast("Submit Element Classification successfuly",'success')
                        window.scrollTo(0,0)
                        this.cancelBackStatus = true
                        this.router.navigate(['payroll','element-classification'])
                        this.methodServices.aktif_table.next(true)
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
                '/api/admin/payelementclassifications/delete',
                (err,success)=>{
                    if (err != ''){
                        this.showToast(err, 'error')
                        // swal.fire({
                        //     title: 'Warning!',
                        //     text: err,
                        //     type: 'warning',
                        //     buttonsStyling: false,
                        //     confirmButtonClass: 'btn btn-primary'
                        // });
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)

                        this.showToast(success,"success")
                        setTimeout(()=>{
                            this.cancelBackStatus = true
                            this.router.navigate(['payroll','element-classification'])
                            this.methodServices.aktif_table.next(true)
                        },1000)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
    }

    cancelBack(){
        setTimeout(()=>{
            if (this.statusChange)
                this.cancelBackStatus = false
            else
                this.cancelBackStatus = true
            this.router.navigate(['/payroll/element-classification'])
            this.methodServices.aktif_table.next(true)
        },1000)
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

    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

}