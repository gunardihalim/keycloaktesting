import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentInit, HostListener, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import {FormGroup, NgForm} from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'
import {Subject, GroupedObservable} from "rxjs";
import {type} from "os";
import { AlternativeComponent } from '../../dashboards/alternative/alternative.component';
import { dateToLocalArray } from '@fullcalendar/core/datelib/marker';
import { ToastrService } from 'ngx-toastr';
import {diffrentDate} from "../../../validation-global/diffrent-date";
import swal from "sweetalert2";
import { Select2OptionData } from 'ng-select2';
import { element } from 'protractor';

@Component({
    selector:"payroll-element-form",
    templateUrl:"payroll-element-form.component.html",
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

export class PayrollElementFormComponent implements OnInit, AfterViewInit {

showSkeletonText:boolean = true;
showSkeletonApiElementClass:boolean = true;
showSkeletonApiFormula:boolean = true;

changeValue:string='0';
startInit:boolean = false;
index:number = 0;

@ViewChild('name') name:ElementRef;
@ViewChild('reportingName') reportingName:ElementRef;
@ViewChild('description') description:ElementRef;
@ViewChild('priority') priority:ElementRef;
@ViewChild('formulaType') formulaTypeElementRef:ElementRef

@ViewChild('f') f:NgForm;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

bsValue = new Date()
formElement:FormGroup

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeNoSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;

public arrTerminationRule:any[] = [
    {id: 'Terminate Date', text:'Terminate Date'},
    {id: 'Pay Thru Date', text:'Pay Thru Date'}
];
public arrTerminationRuleSelect2: Array<Select2OptionData> = [...this.arrTerminationRule];

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
modelRecurring:boolean=false;
modelProration:boolean = false;
modelFormulaDescription:string;
hiddenModal = new Subject<boolean>()
cancelBackStatus:boolean = false;
modelFormulaIdRev: any;
modelElementClassificationRev: any;

@HostListener('window:beforeunload',['$event'])
canDeactivate(event:BeforeUnloadEvent){
    event.returnValue = true
}

    canLeave():boolean{
        let aktif:boolean;
        // alert('can leave ' + localStorage.getItem('masukOnDestroy'))
        if (typeof(localStorage.getItem('tempmasukOnDestroy')) != 'undefined' &&
            localStorage.getItem('tempmasukOnDestroy') === 'true'){
            // this.changeValue = localStorage.getItem('changeValue')
            // let dateConvTemp = new Date(this.modelEffectiveDate)
            // localStorage.setItem('tempeffectivedate',this.modelEffectiveDate)
                // alert(localStorage.getItem('tempeffectivedate'))
                // alert('can leave' + localStorage.getItem('tempmasukOnDestroy'))
            let tempeffectivedate = new Date(localStorage.getItem('tempeffectivedate'))
            this.modelEffectiveDate = tempeffectivedate
            this.modelActiveStatus = localStorage.getItem('tempactiveStatus') == 'true' ? true : false
            this.modelName = localStorage.getItem('tempelementName')
            this.modelReportingName = localStorage.getItem('tempreportingName')
            this.modelDescription = localStorage.getItem('tempdescription')
            this.modelElementClassification = Number(localStorage.getItem('tempelementClassification'))
            this.modelRecurring = localStorage.getItem('temprecurring') == 'true' ? true : false
            this.modelProration = localStorage.getItem('tempproration') == 'true' ? true : false
            // alert(localStorage.getItem('tempproration'))
            this.modelPriority = Number(localStorage.getItem('temppriority'))
            this.modelTerminationRule = localStorage.getItem('tempterminationRule')
            localStorage.setItem('tempmasukOnDestroy','false')
        }
        // alert('2. recurring (can) ' + this.modelRecurring)

        // alert('can leave   ' + this.modelRecurring)
        // alert(localStorage.getItem('priority'))
        // alert(localStorage.getItem('changeValue'))
        this.changeValue = localStorage.getItem('tempchangeValue')
        if (this.cancelBackStatus === false){
            if (this.changeValue == '1'){
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
        // alert(this.changeValue)
        // localStorage.removeItem('changeValue')
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
        return aktif
    }

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private router:Router,
                private http:HttpClient,
                private diffrentDate:diffrentDate,
                private toastr:ToastrService){
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
    modelFormulaId:any;

    readOnlyInput:boolean = false;
    readOnlyInputSelect:boolean = false;
    
    aktif_error:boolean = false;
    disabledSubmit:boolean = false;

    alert_error_msg:string = '';
    alert_success_msg:string = '';

    loginCompanyId:any;
    status = '';
    rowsType = [];
    tempType = [];
    tempTypeSelect2 = [];
    selectedTemp = [];
    formulaType = [];
    formulaTypeSelect2 = [];

    ngOnInit(){
        this.startInit = true;
        // alert('init ' + localStorage.getItem('changeValue'))
        this.modelEffectiveDate = this.as_of_date;

        //GET USER LOGIN => COMPANYID
        // this.methodServices.getUserLogin((result)=>{
        //     this.loginCompanyId = Number(result.loginCompanyId)
        // });
        if (localStorage.getItem('company') != null){
            let decryptCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.loginCompanyId = Number(decryptCompany)
        }

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
            // this.status = result.status
            if (typeof(result.status) != 'undefined'){      //STATUS = NEW
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                this.status = decrypt_status
                this.disabledSubmit = false
            }
            // alert('query params : ' + localStorage.getItem('changeValue'))
            // alert('recurring ' + this.modelRecurring)

            if(typeof(result.id) != 'undefined') {
                this.id = this.methodServices.decryptOnline(result.id)
            }
            
            if(typeof(result.effectiveDate) != 'undefined'){
                let decrypt_effectivedate = this.methodServices.decryptOnline(result.effectiveDate)
                let dateConv = new Date(decrypt_effectivedate)
                this.modelEffectiveDate = dateConv
            }
            if(typeof(result.description) != 'undefined'){
                this.modelDescription = this.methodServices.decryptOnline(result.description)
            }
            if(typeof(result.formula) != 'undefined'){
                this.modelFormulaIdRev = this.methodServices.decryptOnline(result.formula)
            }
            if(typeof(result.active) != 'undefined'){
                let decrypt_active = this.methodServices.decryptOnline(result.active)
                this.modelActiveStatus = decrypt_active == 'true' ? true : false
            }


            if(typeof(this.id) != 'undefined'){
                // this.getElementTypesLocal(result.id,()=>{
                this.methodServices.getElementTypes(this.id,()=>{
                    this.parsingElementClassification(()=>{
                        this.getDataFromApi()
                        // setTimeout(() => {
                        //     let selectrEle: any = document.getElementById('selectrEleClassification')
                        //     let options = {searchable: true}
                        //     let selectrEleConv = new Selectr(selectrEle, options)
                        //     // localStorage.setItem('recurring',this.modelRecurring === true ? 'true' : 'false')
                        // }, 200)
                    })
                })
            }
            if (this.status == 'new') {
                this.getDataFromApi();
            }
            // localStorage.setItem('elementClassification',this.modelElementClassification)
            // localStorage.setItem('recurring',this.modelRecurring === true ? 'true' : 'false')
            // localStorage.setItem('proration',this.modelProration === true ? 'true' : 'false')
            // localStorage.setItem('priority',this.modelPriority != true ? 'false' : 'true')
            // localStorage.setItem('terminationRule',this.modelTerminationRule)
            if (this.status == 'new') {
                this.modelTerminationRule = null
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

    getDataFromApi() {
        this.params = 'page=0&size=3000'
        //Element Classification
        this.methodServices.getUrlApi('/api/admin/payelementclassifications',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
                if (typeof(result) == 'object')
                {
                    for(var key in result){
                        if (key == 'content'){
                            for(var i=0;i<result[key].length;i++){
                                this.rowsType.push({
                                    id:result[key][i].id,
                                    text:result[key][i].name,
                                    priorityStart:result[key][i].priorityStart,
                                    priorityEnd:result[key][i].priorityEnd
                                })
                            }
                        }
                    }
                    this.tempType = this.rowsType;
                    this.tempTypeSelect2 = [...this.rowsType]
                    this.showSkeletonApiElementClass = false;
                    // if (this.status == 'new') {
                    //     setTimeout(()=>{
                    //         let selectrEle:any = document.getElementById('selectrEleClassification')
                    //         let options = {searchable:true}
                    //         let selectrEleConv = new Selectr(selectrEle,options)

                    //         // localStorage.setItem('recurring',this.modelRecurring === true ? 'true' : 'false')
                    //     },200)
                    // }
                }
            },this.params);

        this.methodServices.getUrlApi('/api/admin/payformulas',
            localStorage.getItem(this.methodServices.seasonKey),
            (result) => {
                if (typeof(result) == 'object') {
                    for(let key in result) {
                        if (key == 'content') {
                            for(let i=0;i<result[key].length;i++) {
                                this.formulaType.push({
                                    id:result[key][i].id,
                                    text:result[key][i].name,
                                    description:result[key][i].description
                                })
                            }
                        }
                    }
                    this.formulaTypeSelect2 = [...this.formulaType]
                    this.modelFormulaId = this.modelFormulaIdRev
                    this.showSkeletonApiFormula = false;
                }
                // setTimeout(() => {
                //     var selectrFormulaType:any = document.getElementById('selectrFormula')
                //     var options = {searchable:true}
                //     var selectFormula = new Selectr(selectrFormulaType,options)
                // }, 200)
            }, this.params)
    }

    parsingElementClassification(callback){
        this.tempType = [...this.rowsType];
        this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
        // this.modelElementClassification = this.selectedTemp[0].elementClassificationId
        this.modelName = this.methodServices.selectedTemp[0].elementName
        // this.modelName = this.selectedTemp[0].elementName
        // alert(this.methodServices.selectedTemp[0].elementClassificationId)
        this.modelReportingName = this.methodServices.selectedTemp[0].reportingName
        // this.modelReportingName = this.selectedTemp[0].reportingName
        this.modelRecurring = this.methodServices.selectedTemp[0].recurring
        // this.modelRecurring = this.selectedTemp[0].recurring
        this.modelProration = this.methodServices.selectedTemp[0].proration
        // this.modelProration = this.selectedTemp[0].proration
        this.modelPriority = this.methodServices.selectedTemp[0].priority
        // alert('query params ' + this.methodServices.selectedTemp[0].proration)
        // this.modelPriority = this.selectedTemp[0].priority
        this.modelTerminationRule = this.methodServices.selectedTemp[0].terminationRule
        // this.modelTerminationRule = this.selectedTemp[0].terminationRule

        //jika exists localestorage

        // if (localStorage.getItem('tempelementClassification')!=null){
        //     this.modelElementClassification = Number(localStorage.getItem('tempelementClassification'))
        // }
        // localStorage.removeItem('changeValue')
        // localStorage.removeItem('activeStatus')
        // localStorage.removeItem('elementName')
        // localStorage.removeItem('reportingName')
        // localStorage.removeItem('description')

        // localStorage.removeItem('elementClassification')
        // localStorage.removeItem('recurring')
        // localStorage.removeItem('proration')
        // localStorage.removeItem('priority')
        // localStorage.removeItem('terminationRule')

        // localStorage.removeItem('changeValue')
        // localStorage.removeItem('elementClassification')
        // localStorage.removeItem('recurring')
        // localStorage.removeItem('proration')
        // localStorage.removeItem('priority')
        // localStorage.removeItem('terminationRule')
        callback()
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
        // console.log(this.modelName, this.modelReportingName, this.modelDescription, typeof(this.modelFormulaId), this.modelFormulaDescription, typeof(this.modelActiveStatus), typeof(this.modelProration), typeof(this.modelRecurring), this.modelTerminationRule, typeof(this.modelElementClassification), typeof(this.modelPriority), (this.modelPriorityEnd), this.modelPriorityStart)
        this.modelName = this.name.nativeElement.value
        this.modelReportingName = this.reportingName.nativeElement.value
        this.modelDescription = this.description.nativeElement.value
        this.modelPriority = Number(this.priority.nativeElement.value)
        // console.log(this.modelElementClassificationRev)
        // console.log(this.modelName, this.modelReportingName, this.modelDescription, typeof(this.modelPriority))
        // return
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

        if (typeof(this.modelName) == 'undefined' || this.modelName == ""){
            statusMsg = 'Name can\'t be Blank !'
            isValid = false
        }

        if (typeof(this.modelReportingName) == 'undefined'){
            statusMsg = 'Reporting Name can\'t be Blank !'
            isValid = false
        }

        if (typeof(this.modelElementClassificationRev) == 'undefined'){
            statusMsg = 'Element Classification can\'t be Blank !'
            isValid = false
        }
        if (typeof(this.modelEffectiveDate) == 'undefined') {
            statusMsg = 'Effective Date can\'t be Blank !'
            isValid = false
        }
        if (this.modelEffectiveDateCheck == 'Invalid Date') {
            statusMsg = 'Effective Date must DD-MMM-YYYY e.g. 01-Oct-2020'
            isValid = false
        }
        // else
        // if (this.modelPriorityEnd <= this.modelPriorityStart){
        //     this.alert_error_msg = 'Priority End must be greater than Priority Start !'
        // }
        if (isValid) {
            this.alert_error_msg = ''            
            // postData(dataObj,urlapi,callback)
            let dataObj = {
                "id":Number(this.id),
                "name":this.modelName,
                "reportingName":this.modelReportingName,
                "effectiveDate": new DatePipe('en-us').transform(this.modelEffectiveDateCheck,'yyyy-MM-dd'),
                "active":this.modelActiveStatus,
                "description":this.modelDescription,
                "payElementClassificationsId":Number(this.modelElementClassificationRev),
                "formulaId":Number(this.modelFormulaIdRev),
                "recurring":this.modelRecurring,
                "proration":this.modelProration,
                "priority":this.modelPriority,
                "terminationRule":this.modelTerminationRule,
                "companyId":this.loginCompanyId
            }

            if (this.status === "new") {
                delete dataObj.id
            }

            console.log(dataObj)

            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payelementtypes',
                (err,success)=>{
                    if (err != ''){
                        this.showToast(err, 'error')
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.cancelBackStatus = true
                        this.showToast(success, 'success')
                        this.router.navigate(['payroll','element'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved SuccessfuFlly ! '
                    }
                }
            )
            
        } else {
            this.showToast(statusMsg, 'error')
        }
    }

    cancelBack(){
        this.cancelBackStatus = true
        this.router.navigate(['/payroll/element'])
        this.methodServices.aktif_table.next(true)
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
            // if (this.defaultModalDeleteId) {
            //     this.defaultModalDeleteId.hide()
            // }
            // this.alert_success_msg = '';
            this.methodServices.postData({
                    id: this.id
                },
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payelementtypes/delete',
                (err,success)=>{
                    if (err != ''){
                        swal.fire({
                            title: 'Warning!',
                            text: err,
                            type: 'error',
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-primary'
                        });
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.showToast(success, 'success')
                        this.cancelBackStatus = true
                        this.router.navigate(['payroll', 'element'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
    }


    ngAfterViewInit(){
        
        // this.methodServices.selectedTemp[0].elementClassificationId = 13
        // alert(this.methodServices.selectedTemp[0].elementClassificationId)
        // this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
    }

    generateExcel(){
        // let a;
        // a = [
        //         // {kode:'abc',nama:'def'},
        //         ['asa','wes']
        //     ]
        // if (a instanceof Array){
        //     alert('Array')
        // }
        // else
        // if(a instanceof Object){
        //     alert('Object')
        // }
        // for (let contoh of a){
        //     alert(contoh.constructor)
        // }
        // this.methodServices.generate()
    }

    procChange(type?,value?){
        // console.log(value)
        if (this.index <= 1){
            this.index++;
        }
        else{
            this.changeValue = '1'
            // localStorage.setItem('tempchangeValue','1')
        }

        if (typeof(type) != "undefined" && typeof(value) != "undefined") {

            switch (type) {
                case 'formula':
                    let payFormulaDescription = this.formulaType.find(element => {
                        if (element.id == value) {
                            this.modelFormulaIdRev = element.id
                            this.modelFormulaDescription = element.description
                        }
                    })
                    break;
                case 'classification':
                    let payElementClassification = this.rowsType.find(element => {
                        if (element.id == value) {
                            this.modelElementClassificationRev = element.id
                            this.modelPriorityStart = element.priorityStart
                            this.modelPriorityEnd = element.priorityEnd
                            // alert(this.modelElementClassification)
                        }
                    })
                    break;
                case 'name':
                    this.modelName = value.path[0].value
                    // console.log(this.modelName);
                    break;
                case 'reportingName':
                    this.modelReportingName = value.path[0].value
                    break;
                case 'description':
                    this.modelDescription = value.path[0].value
                    break;
                case 'termination':
                    this.arrTerminationRule.find(element => {
                        if (element.id == value) {
                            this.modelTerminationRule = element.id
                        }
                    })
                    break;
                case 'priority':
                    this.modelPriority = Number(value.path[0].value)
                    break;
            }
        }
    }

    ngOnDestroy(){
        // this.aktifTableTemp.emit(true)
        // if (typeof(localStorage.getItem('changeValue')) != 'undefined'){
        //     localStorage.removeItem('changeValue')
        // }
        // localStorage.setItem('changeValue',this.changeValue)
        // alert('on destroy :' + this.changeValue)
        // let dateConvTemp = new Date(this.modelEffectiveDate)
        // alert('masuk destroy ' + localStorage.getItem('tempmasukOnDestroy'))
        let tempeffectivedate = new DatePipe('en-us').transform(this.modelEffectiveDate,'dd-MMM-yyyy')
        localStorage.setItem('tempeffectivedate',tempeffectivedate)
        localStorage.setItem('tempactiveStatus',this.modelActiveStatus === true ? 'true' : 'false')
        localStorage.setItem('tempelementName',this.modelName)
        localStorage.setItem('tempreportingName',this.modelReportingName)
        localStorage.setItem('tempdescription',this.modelDescription)

        localStorage.setItem('tempelementClassification',this.modelElementClassification)
        localStorage.setItem('temprecurring',this.modelRecurring === true ? 'true' : 'false')
        // alert('1. recurring ' + localStorage.getItem('recurring'))
        localStorage.setItem('tempproration',this.modelProration === true ? 'true' : 'false')
        localStorage.setItem('temppriority',this.modelPriority.toString())
        localStorage.setItem('tempterminationRule',this.modelTerminationRule)

        localStorage.setItem('tempmasukOnDestroy','true')
        // alert('on destroy ' + this.modelRecurring)
        this.methodServices.aktif_table.next(false);
    }

    changeValueOption(){      

        // alert('change ' + localStorage.getItem('changeValue'))
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

    invokeComponent(){
        this.toastr.show(
            '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span> <div class="alert-text"</div> <span class="alert-title" data-notify="title">Ngx Toastr</span> <span data-notify="message">Turning standard Bootstrap alerts into awesome notifications</span></div>',
            "",
            {
              timeOut: 2000,
              closeButton: false,
              enableHtml: true,
              tapToDismiss: false,
              titleClass: "alert-title",
              positionClass: "toast-center-center",
              toastClass:
                "ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
          );
          setTimeout(()=>{
            this.router.navigate(['/payroll/element'])
          },2100)
          
    }
}