import {
    Component,
    OnInit,
    Input,
    ViewChild,
    OnDestroy,
    Output,
    EventEmitter,
    AfterViewInit,
    AfterViewChecked,
    AfterContentInit,
    HostListener,
    ElementRef
} from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe, CurrencyPipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'

import { Select2OptionData } from 'ng-select2';
import { element } from 'protractor';

import { canComponentDeactive } from 'src/app/services/deactivate-guard'
import {ToastrService} from "ngx-toastr";
import swal from "sweetalert2";
import {BsModalRef} from "ngx-bootstrap/modal";


@Component({
    selector:"employee-element-entries-form",
    templateUrl:"employee-element-entries-form.component.html",
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

export class EmployeeElementEntriesFormComponent implements OnInit, AfterViewInit, canComponentDeactive {

showSkeletonText:boolean = true;
showSkeletonApiElementType:boolean = true;

cancelStatus:boolean = false;
statusChange:boolean = false;

tempPayrollName:string;
tempDescription:string;
tempFirstPeriodDom:string;

option:boolean;

@HostListener('window:beforeunload',['$event'])
@ViewChild('valueId') valueId:ElementRef;
canDeactivate(event:BeforeUnloadEvent){
    event.returnValue = true
}

canLeave(){
    if (this.cancelStatus == false){
        if (this.statusChange) {
            // alert(localStorage.getItem('elementId'))
            // localStorage.setItem('elementId',this.modelElementTypes)
            // localStorage.setItem('effectivedate',this.modelEffectiveDate)
            // localStorage.setItem('processingtype',this.modelProcessingType)
            // localStorage.setItem('activeentries',this.modelActiveStatus.toString())
            // localStorage.setItem('valueentries',this.modelValue)

            this.option = confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
            if (this.option === false){
                // this.methodServices.aktif_table.next(false)
                this.methodServices.aktif_table_child.next(false)
                if (typeof(localStorage.getItem('effectivedate')) != 'undefined' &&
                    localStorage.getItem('effectivedate') != null &&
                    localStorage.getItem('effectivedate') != '' )
                {
                    let dateLocaleConv = new Date(localStorage.getItem('effectivedate'))
                    this.modelEffectiveDate = dateLocaleConv
                }

                if (typeof(localStorage.getItem('elementId')) != 'undefined' &&
                    localStorage.getItem('elementId') != null &&
                    localStorage.getItem('elementId') != '' ){
                    this.modelElementTypes = localStorage.getItem('elementId')
                }

                if (typeof(localStorage.getItem('processingtype')) != 'undefined' &&
                    localStorage.getItem('processingtype') != null &&
                    localStorage.getItem('processingtype') != '' ){
                    this.modelProcessingType = localStorage.getItem('processingtype')
                }
                if (typeof(localStorage.getItem('activeentries')) != 'undefined' &&
                    localStorage.getItem('activeentries') != null &&
                    localStorage.getItem('activeentries') != '' ){
                    this.modelActiveStatus = localStorage.getItem('activeentries').toString() == 'true' ? true : false
                }
                if (typeof(localStorage.getItem('valueentries')) != 'undefined' &&
                    localStorage.getItem('valueentries') != null &&
                    localStorage.getItem('valueentries') != '' ){
                    this.modelValue = localStorage.getItem('valueentries')
                }
                // if (typeof(localStorage.getItem('payslipdom')) != 'undefined' &&
                //     localStorage.getItem('payslipdom') != null &&
                //     localStorage.getItem('payslipdom') != '' ){
                //     this.modelPayslipDOM = localStorage.getItem('payslipdom')
                // }
                // if (typeof(localStorage.getItem('cutdom')) != 'undefined' &&
                //     localStorage.getItem('cutdom') != null &&
                //     localStorage.getItem('cutdom') != '' ){
                //     this.modelCutDOM = localStorage.getItem('cutdom')
                // }
            }
            else{
                this.option = true
                // this.methodServices.aktif_table.next(false)
                // this.methodServices.aktif_table_child.next(true)
            }
        } else {
            this.option = true
        }
    }
    else{
        this.option = true
        // this.methodServices.aktif_table.next(false)
        // this.methodServices.aktif_table_child.next(true)
    }
    // localStorage.removeItem('elementId')
    // localStorage.removeItem('effectivedate')
    // localStorage.removeItem('processingtype')
    // localStorage.removeItem('activeentries')
    // localStorage.removeItem('valueentries')
    
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
modelElementTypes:any;
modelElementTypesRev:any;
modelProcessingType:any;
modelValue:any = "";
modelElementName:string;
elementTypesSelectr:any;
processingTypeSelectr:any;

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private currencyPipe:CurrencyPipe,
                private router:Router,
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
    rowsElementTypes: any = [];
    rowsElementTypesSelect2:Array<Select2OptionData>;

    rowsRecurringTypes:any[] = [
        {id:'Recurring', text:'Recurring'},
        {id:'Non Recurring', text:'Non Recurring'}
    ]
    rowsRecurringTypesSelect2:Array<Select2OptionData> = [...this.rowsRecurringTypes]
    id:string;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:any;
    modelActiveStatus:boolean=true;
    modelName:string;
    modelDescription:string;
    modelPriorityStart:number;
    modelPriorityEnd:number;
    modelTerminationRule:string;

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
    selectedTemp = [];
    decrypt_status:any;


    modelPayrollName:string;
    modelFirstPeriodDOM:any;
    modelCutDOM:any;
    modelPayslipDOM:any;

    employeeId:any;
    assignmentId:any;
    defaultModalDeleteId:BsModalRef;

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
            //   this.urlEndParse = urlFinal
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
              this.methodServices.urlEndParse.next('ELEMENT ENTRIES')
              this.urlEndParse = urlFinal
            }  

            if (this.urlEndParse != 'ELEMENT-ENTRIES-FORM'){
                this.methodServices.aktif_table_child.next(true)
            }
        
            //Parsing Back to Object After Not canLeave
            if (localStorage.getItem('elementId') != null && 
                localStorage.getItem('elementId') != '')
            {
                this.modelElementTypesRev = localStorage.getItem('elementId')
            }
            if (localStorage.getItem('effectivedate') != null){
                this.modelEffectiveDate = localStorage.getItem('effectivedate')
            }
            if (localStorage.getItem('processingtype') != null){
                this.modelProcessingType = localStorage.getItem('processingtype')
            }
            if (localStorage.getItem('activeentries') != null){
                this.modelActiveStatus = localStorage.getItem('activeentries').toString() == 'true' ? true : false
            }
            if (localStorage.getItem('valueentries') != null){
                this.modelValue = localStorage.getItem('valueentries')
            }
            
            localStorage.removeItem('elementId')
            localStorage.removeItem('effectivedate')
            localStorage.removeItem('processingtype')
            localStorage.removeItem('activeentries')
            localStorage.removeItem('valueentries')

            if (typeof(result.idEntries) != 'undefined') {
                this.id = this.methodServices.decryptOnline(result.idEntries)
            }
            this.status = result.status

            

            if (typeof(result.status) != 'undefined'){
                // let decrypt_status = CryptoJS.AES.decrypt(result.status,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                this.decrypt_status = this.methodServices.decryptOnline(result.status)
                if (this.decrypt_status == 'new'){
                    this.disabledSubmit = false
                }
            }

            if(typeof(result.assignmentId) != 'undefined'){
                // let decrypt_payslipDom = CryptoJS.AES.decrypt(result.payslipDom,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                let decrypt_assignmentId = this.methodServices.decryptOnline(result.assignmentId)
                this.assignmentId = decrypt_assignmentId
            }

            if(typeof(result.elementName) != 'undefined'){
                // let decrypt_payslipDom = CryptoJS.AES.decrypt(result.payslipDom,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                let decrypt_elementName = this.methodServices.decryptOnline(result.elementName)
                this.modelElementName = decrypt_elementName
                this.showSkeletonApiElementType = false
            }


            if(this.decrypt_status != 'new'){
                if(typeof(result.employeeid) != 'undefined'){
                    this.employeeId = CryptoJS.AES.decrypt(result.employeeid,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                }
                if(typeof(result.effectiveDateEntries) != 'undefined'){
                    // let decrypt_effectivedate = CryptoJS.AES.decrypt(result.effectiveDateEntries,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                    let decrypt_effectivedate = this.methodServices.decryptOnline(result.effectiveDateEntries)                
                    let dateConv = new Date(decrypt_effectivedate)
                    this.modelEffectiveDate = dateConv
                }
                if(typeof(result.elementId) != 'undefined'){
                    // let decrypt_groupname = CryptoJS.AES.decrypt(result.groupName,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                    let decrypt_elementId = this.methodServices.decryptOnline(result.elementId)                
                    this.modelElementTypesRev = decrypt_elementId
                }
                if(typeof(result.processingType) != 'undefined'){
                    // let decrypt_description = CryptoJS.AES.decrypt(result.description,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                    let decrypt_processingType = this.methodServices.decryptOnline(result.processingType)
                    this.modelProcessingType = decrypt_processingType
                }
                if(typeof(result.activeEntries) != 'undefined'){
                    // let decrypt_active = CryptoJS.AES.decrypt(result.active,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                    let decrypt_activeEntries = this.methodServices.decryptOnline(result.activeEntries)
                    this.modelActiveStatus = decrypt_activeEntries == 'true' ? true : false
                }
                if(typeof(result.valueEncrypt) != 'undefined'){
                    // let decrypt_payslipDom = CryptoJS.AES.decrypt(result.payslipDom,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                    let decrypt_valueEncrypt = this.methodServices.decryptValue(result.valueEncrypt)
                    this.modelValue = decrypt_valueEncrypt
                    this.modelValue = this.currencyPipe.transform(this.modelValue, 'Rp ', 'symbol')
                }
            }
            this.showSkeletonText = false;
        }
        )
 

        //Element Types
        // this.params = "page=0&size=100"
        // this.methodServices.getUrlApi('/api/admin/payelementtypes',
        // localStorage.getItem('Token'),
        // (result)=>{
        // if (typeof(result) == 'object')
        // {
        //     for(var key in result){
        //         if (key == 'content'){
        //             for(var i=0;i<result[key].length;i++){
        //                 this.rowsElementTypes.push({
        //                             id:result[key][i].id,
        //                             name:result[key][i].name,
        //                             reportingName:result[key][i].reportingName,
        //                             effectiveDate:result[key][i].effectiveDate,
        //                             active:result[key][i].active})     
        //             }
        //         }
        //     }          
        // }
        // },this.params);
        
        this.loadElementTypes((result)=>{
            setTimeout(()=>{
                // let elementTypes:any = document.getElementById('elementTypesId')
                // let options = {searchable:true}
                // this.elementTypesSelectr = new Selectr(elementTypes,options)
            },500)
        })
       
        if(this.decrypt_status == 'new' &&
            localStorage.getItem('new') != null &&
            localStorage.getItem('new') != ''){
            this.modelEffectiveDate = formatedDate
            this.modelProcessingType = null
            this.modelElementTypesRev = null
            this.modelActiveStatus = true
            this.modelValue = null
            localStorage.removeItem('new')
        }
        
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

    loadElementTypes(callback){
        if (this.decrypt_status != "new") {
            // this.params = "id="+this.modelElementTypes
            // this.methodServices.getUrlApi('/api/admin/payelementtypes/detail',
            // localStorage.getItem(this.methodServices.seasonKey),
            // (result)=>{
            // if (typeof(result) == 'object') {
            //         this.modelElementName = result.name
            //     callback()
            // }},this.params);
        } else {
            this.params = "page=0&size=300"
            this.methodServices.getUrlApi('/api/admin/payelementtypes',
                localStorage.getItem(this.methodServices.seasonKey),
                (result) => {
                    if (typeof(result) == 'object')
                    {
                        for(var key in result){
                            if (key == 'content'){
                                this.rowsElementTypes = []
                                for(var i=0;i<result[key].length;i++){
                                    this.rowsElementTypes.push({
                                        id:result[key][i].id,
                                        text:result[key][i].name,
                                        reportingName:result[key][i].reportingName,
                                        effectiveDate:result[key][i].effectiveDate,
                                        active:result[key][i].active,
                                        recurring:result[key][i].recurring})
                                }
                            }
                        }
                        this.rowsElementTypesSelect2 = [...this.rowsElementTypes]
                        this.modelElementTypesRev = this.modelElementTypes
                        this.showSkeletonApiElementType = false;
                        callback()
                    }
                },this.params);
        }
    }

    submitProc(){
        this.alert_success_msg = '';
        if (typeof(this.valueId.nativeElement.value) == "undefined" || this.valueId.nativeElement.value == '')
            this.valueId.nativeElement.value == null;

        if (typeof(this.modelElementTypesRev) == 'undefined'){
            this.showToast('Element Name can\'t be Blank !','error')
        }
        // else
        // if (this.modelPriorityEnd <= this.modelPriorityStart){
        //     this.alert_error_msg = 'Priority End must be greater than Priority Start !'
        // }
        else
        {
            this.alert_error_msg = ''            
            // postData(dataObj,urlapi,callback)
            let dataObj = {
                "id":Number(this.id),
                "assignmentId":Number(this.assignmentId),
                "effectiveDate": new DatePipe('en-us').transform(this.modelEffectiveDate,'yyyy-MM-dd'),
                "active":this.modelActiveStatus == null ? false : this.modelActiveStatus,
                "processingType":this.modelProcessingType,
                "payElementTypesId":Number(this.modelElementTypesRev),
                "value": this.valueId.nativeElement.value == '' ? null : Number(this.valueId.nativeElement.value.replace(/[Rp,]/g, "")).toString(),
                "companyId":this.loginCompanyId
            }
            // console.log('Analyze \n')
            // console.log(dataObj)

            if (this.decrypt_status == 'new')
                delete dataObj.id

            
            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payelemententries',
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
                        this.router.navigate(['/employee/element-entries'],
                        {
                            queryParams:{status:null,
                                elementId:null,
                                elementName:null,
                                valueEncrypt:null,
                                idEntries:null,
                                activeEntries:null,
                                processingType:null,
                                assignmentId:null,
                                effectiveDateEntries:null},
                            queryParamsHandling:'merge'
                        })
                        this.methodServices.aktif_table_child.next(true)
                        this.cancelStatus = true
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
                        
        }
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

    ngAfterViewInit(){
        
        // this.methodServices.selectedTemp[0].elementClassificationId = 13
        // alert(this.methodServices.selectedTemp[0].elementClassificationId)
        // this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
    }
    ngOnDestroy(){
        // this.tempPayrollName = this.modelPayrollName
        // this.tempDescription = this.modelDescription
        // if (typeof(localStorage.getItem('effectivedate')) !='undefined'){
        //     localStorage.removeItem('effectivedate')
        // }
        // if (typeof(localStorage.getItem('elementId')) !='undefined'){
        //     localStorage.removeItem('elementId')
        // }
        // if (typeof(localStorage.getItem('processingtype')) !='undefined'){
        //     localStorage.removeItem('processingtype')
        // }
        // if (typeof(localStorage.getItem('activeentries')) !='undefined'){
        //     localStorage.removeItem('activeentries')
        // }
        // if (typeof(localStorage.getItem('valueentries')) !='undefined'){
        //     localStorage.removeItem('valueentries')
        // }
        // if (typeof(localStorage.getItem('payslipdom')) !='undefined'){
        //     localStorage.removeItem('payslipdom')
        // }
        // if (typeof(localStorage.getItem('firstperioddom')) !='undefined'){
        //     localStorage.removeItem('firstperioddom')
        // }
        // if (typeof(localStorage.getItem('cutdom')) !='undefined'){
        //     localStorage.removeItem('cutdom')
        // }
        
        // if (typeof(this.modelEffectiveDate) != 'undefined'){
        //     let dateLocaleConv = new Date(this.modelEffectiveDate)
        //     let dateLocaleConvStr = new DatePipe('en-us').transform(dateLocaleConv,'dd-MMM-yyyy')
        //     localStorage.setItem('effectivedate',dateLocaleConvStr)
        // }
        //
        // if (typeof(this.modelElementTypes) != 'undefined'){
        //     localStorage.setItem('elementId',this.modelElementTypes)
        // }
        // if (typeof(this.modelProcessingType) != 'undefined'){
        //     localStorage.setItem('processingtype',this.modelProcessingType)
        // }
        // if (typeof(this.modelActiveStatus) != 'undefined'){
        //     let activestatusDes = this.modelActiveStatus == true ? 'true':'false'
        //     localStorage.setItem('activeentries',activestatusDes)
        // }
        // if (typeof(this.modelValue) != 'undefined'){
        //     localStorage.setItem('valueentries',this.modelValue)
        // }
        // if (typeof(this.modelPayslipDOM) != 'undefined'){
        //     localStorage.setItem('payslipdom',this.modelPayslipDOM)
        // }
        // if (typeof(this.modelCutDOM) != 'undefined'){
        //     localStorage.setItem('cutdom',this.modelCutDOM)
        // }
        
        // if (this.option == true){       //when canleave 
        //     localStorage.removeItem('elementId')
        // //     localStorage.removeItem('description')
        //     localStorage.removeItem('firstperioddom')
        //     localStorage.removeItem('effectivedate')
        //     localStorage.removeItem('activestatus')
        //     localStorage.removeItem('payslipdom')
        //     localStorage.removeItem('cutdom')
        // }
        this.methodServices.aktif_table.next(false)       
        // this.methodServices.aktif_table_child.next(false)
        // this.aktifTableTemp.emit(true)
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
            // this.defaultModalDeleteId.hide()
            this.alert_success_msg = '';
            this.methodServices.postData({
                    id: this.id
                },
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payelemententries/delete',
                (err,success)=>{
                    if (err != ''){
                        // swal.fire({
                        //     title: 'Error!',
                        //     text: err,
                        //     type: 'error',
                        //     buttonsStyling: false,
                        //     confirmButtonClass: 'btn btn-primary'
                        // });
                        this.showToast(err, 'error')
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        // swal.fire({
                        //     title: 'Success',
                        //     text: success,
                        //     type: 'success',
                        //     buttonsStyling: false,
                        //     confirmButtonClass: 'btn btn-primary'
                        // }).then((result) => {
                        //     if (result.value) {
                        //         this.backCancel()
                        //     }
                        // })
                        this.showToast(success,'success')
                        this.backCancel()
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
    }


    editFixed(event){
        // var num = event.replace(/[Rp,]/g, "");
        // return Number(num);
        if (this.valueId.nativeElement.value != "") {
            if (isNaN(Number(this.valueId.nativeElement.value))) {
                this.valueId.nativeElement.value = ''
            }
            else {
                this.valueId.nativeElement.value = this.currencyPipe.transform(this.valueId.nativeElement.value, 'Rp ', 'symbol')
            }
        }
    }

    onFocus(event) {
        if (event.target.value != "") {
            var num = event.target.value.replace(/[Rp,]/g, "");
            this.valueId.nativeElement.value = num
        }
    }

    changeType(event){
        let typeReccuring = this.rowsElementTypes.find(element => {
            if (element.id == event) {
                this.modelProcessingType = element.recurring ? 'Recurring' : 'Non Recurring'
                this.statusChange = true
                this.modelElementTypesRev = event
            }
        })
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
                        positionClass: 'toast-top-center',
                        messageClass: 'w-100',
                        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
                    }
                );
                break;
        }
    }

    changeProc($event){
        this.statusChange = true
    }

    // procs(event: KeyboardEvent){
    //     let aa = event.key
    //     alert(aa.charCodeAt(0))
    // }
}