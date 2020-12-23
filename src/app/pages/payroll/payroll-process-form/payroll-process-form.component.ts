import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentInit, TemplateRef, HostListener, ChangeDetectionStrategy, AfterContentChecked, ElementRef, ViewContainerRef, AbstractType } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe, Time } from '@angular/common'
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm, FormControl, NumberValueAccessor } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { Subject, fromEvent } from 'rxjs';

import { canComponentDeactive } from '../../../services/deactivate-guard'
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
import { AlertComponent } from 'ngx-bootstrap';
import { ThrowStmt } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';
import swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2'
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { isDate } from 'util';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { randomBytes, DEFAULT_ENCODING } from 'crypto';

@Component({
    selector:"payroll-process-form",
    templateUrl:"payroll-process-form.component.html",
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

export class PayrollProcessFormComponent implements OnInit, OnDestroy, AfterContentChecked
            , canComponentDeactive{

showSkeletonText:boolean = true;
showSkeletonApi:boolean = true;
showSkeletonApiPartial:boolean = true;


example: Array<Select2OptionData>;

@ViewChild('hideele') hideele:ElementRef

@ViewChild('f') f:NgForm;
@ViewChild('tableBalance') table:DatatableComponent;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

modelClone:any;
@ViewChild('clone') clone;
@ViewChild('container',{read:ViewContainerRef}) container;

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
modelRequestNo:any;

defaultModal:BsModalRef;
defaultModalDelete:BsModalRef;
defaultModalDeleteId:BsModalRef;

payBalanceFeedIdShow:any;
typeShow:any;
balanceTypeIdShow:any;
payElementTypesIdShow:any;
payElementTypesNameShow:any;
effectiveDateShow:string;
activeShow:boolean;

modelElementName:string;
modelTypeShow:string;

hiddenModal = new Subject<boolean>()

cancelBackStatus:boolean = false;

statusDetailBaru:boolean = false;

disabledButton:boolean = false;

modelFilterList:any;

statusChange:boolean = false;

tesArr = ['GIT','ONE','DRIVE'];

@ViewChild('modalDefault') modalDefaultRev:TemplateRef<any>
@ViewChild('modalDeleteId') modalDeleteIdRev:TemplateRef<any>
@ViewChild('modalElementEntries') modalElementEntriesRev:TemplateRef<any>


  @HostListener('window:beforeunload',['$event'])       //MODIFIED URL
  canDeactivate(event:BeforeUnloadEvent):void{
    event.returnValue = true
  } 
//   @HostListener('window:hashchange',['$event'])
//   @HostListener('window:popstate',['$event'])
//   onPopState(event){
//       console.log(event)
//     //   history.go(1)
//   }

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
                private http:HttpClient,
                private modalService:BsModalService,
                private _ele:ElementRef,
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
    entriesList: number = 10;
    entriesListEntries: number = 10;
    entriesListFive:number = 5;
    
    selected: any[] = [];
    temp = [];
    tempMaster = [];
    activeRow: any;
    rows: any = [];
    rowsHeader:any = [];
    rowsPayrollGroup = [];
    rowsPayrollGroupSelect2:Array<Select2OptionData> = [];

    rowsEntries = [];

    id:string;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:string;
    modelActiveStatus:boolean=false;
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
    alert_error_modal_msg:string = '';
    alert_success_msg:string = '';

    modelEffectiveDateShow:any;
    modelActiveShow:boolean;
    modelElementNameShow:number;

    modelFilter:string;
    modelFilterEntries:string;

    loginCompanyId:any;
    status = '';
    rowsType = [];
    tempType = [];
    tempEmp = [];
    rowsEmp = [];
    tempEntries = [];

    rowsShow = [];

    textModalSelect:string;
    indexModalSelect:any;
    noModalSelect:any;

    modelPayrollGroup:any;
    modelPayrollGroup2:any;

    modelPayslipDate:any;
    modelCutoffDate:any;
    modelPeriodEndDate:any;
    modelRunType:any;

    payrollGroupId:any;
    modelPeriod:any;
    modelPeriodCheck:any;

    statusErrPayroll:boolean = false;
    aktifPeriod:boolean = false;
    firstCondition:boolean = true;
    countLoadAwal:number = 0;
    
    rowsRunType = []
    rowsRunTypeSelect2: Array<Select2OptionData>;

    runTypeId:any;

    //KONDISI AWAL
    countCutOffDate:number = 0;
    countPeriodEndDate:number = 0;
    countRunType:number = 0;
    payrollProcessId:any;


    // createDetail:boolean = true;
    default = {
        keyboard:true,
        class:'modal-dialog-centered modal-xl',
        ignoreBackdropClick:true
    }

    defaultEntries = {
        keyboard:true,
        class:'modal-dialog-centered modal-lg',
        ignoreBackdropClick:true
    }

    defaultDelete = {
        keyboard:true,
        class:'modal-dialog-centered modal-danger',
        ignoreBackdropClick:true
    }

    select2PayrollGroup:any;
    select2RunType:any;
    select2PayrollGroupDisabled:boolean = false;
    select2RunTypeDisabled:boolean = false;
    awalMasuk:boolean = true;
    awalMasukDateChangeOther:number=0;
    awalMasukDateChangePeriodEnd:number=0;
    awalMasukPayrollGroup:number=0;
    awalMasukRunType:number=0;

    @ViewChild('payrollProcessInput',{static:true}) payrollProcessInput: ElementRef

    procChangeRunType(event){
        this.modelRunType = event
        if(this.awalMasukRunType == 1)
        {
            this.statusChange = true
        }
        this.awalMasukRunType++;
    }

    procChangePayrollGroup(event){
        // this.select2PayrollGroup = event
        this.modelPayrollGroup = event
        if(this.awalMasukPayrollGroup == 1)
        {
            this.statusChange = true
        }
        this.awalMasukPayrollGroup++;
        
    }
    
    ivSha256Encrypt(text:string){
        let _key = CryptoJS.enc.Utf8.parse('Bar12345Bar12345')
        let _iv = CryptoJS.lib.WordArray.random(16)
        
        let encryptTxt = CryptoJS.AES.encrypt(
            text,_key,{
                iv:_iv,
                format:CryptoJS.format.Hex,
                mode:CryptoJS.mode.CTR,
                padding:CryptoJS.pad.NoPadding
            }
        ).toString();
        encryptTxt = _iv + encryptTxt
        return encryptTxt
    }

    ivSha256Decrypt(encryptTxt:string){
        let _key = CryptoJS.enc.Utf8.parse('Bar12345Bar12345')

        let decryptTxt = CryptoJS.AES.decrypt(
            encryptTxt.slice(32,encryptTxt.length).toString(),_key,{
                iv:CryptoJS.enc.Hex.parse((encryptTxt.slice(0,32))),
                format:CryptoJS.format.Hex,
                mode:CryptoJS.mode.CTR,
                padding:CryptoJS.pad.NoPadding
            }
        ).toString(CryptoJS.enc.Utf8)
        
        console.log('Encrypt : ' + encryptTxt + '\nDecrypt : ' + decryptTxt)
    }

    funcTuple<T>(arg:T[]):T[]{
        return new Array().concat(arg)
    }

    ngOnInit(){
        let enc = this.ivSha256Encrypt('Tim Git')
        this.ivSha256Decrypt(enc)
        enc = this.ivSha256Encrypt('Tim Git')
        this.ivSha256Decrypt(enc)
        enc = this.ivSha256Encrypt('Tim Git')
        this.ivSha256Decrypt(enc)
        
        let cobaTup = this.funcTuple<number>([30,50,70])
        console.log(`Hasilnya : ${cobaTup}`)

        // fromEvent(this.payrollProcessInput.nativeElement,'keyup').pipe(
        //     map((event:any)=>{
        //         return event.target.value; 
        //     })
        //     // ,filter(res=>res.length == 8)
        //     ,debounceTime(3000)
        //     ,distinctUntilChanged(),
        // ).subscribe((text:string)=>{
        //     this.dateChangeProd(text,'keyup')
        //     alert(text)
        // })

        // this.example = [
        //     {id:'1',text:'Basicc 1'},
        //     {id:'2',text:'Basicc 2'}
        // ]
        // this.example.push({id:'3',text:'basicc 333'})

        // this.select2PayrollGroup = null
        // this.modelPeriod = new Date()

        
        let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'yyyy-MM-dd')
        this.modelEffectiveDate = formatedDate;

        //GET USER LOGIN => COMPANYID
        // this.methodServices.getUserLogin((result)=>{
        //     this.loginCompanyId = Number(result.loginCompanyId)
        // });
        if (localStorage.getItem('company') != null){
            let decryptCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.loginCompanyId = Number(decryptCompany)
        }

        //hide
        this.hiddenModal.subscribe(hasil=>{
            if (hasil == true){
                if(this.defaultModal){
                    this.defaultModal.hide()
                }
                if(this.defaultModalDelete){
                    this.defaultModalDelete.hide()
                }
            }
        })

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

            //PAYROLL GROUP
            this.params = "page=0&size=3000&isactive=true"
            this.methodServices.getUrlApi('/api/admin/paypayrollgroups',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
            if (typeof(result) == 'object')
            {
                this.tempEmp = []
                for(var key in result){
                    if (key == 'content'){
                        for(var i=0;i<result[key].length;i++){
                            this.rowsPayrollGroup.push({
                                id:result[key][i].id,
                                text:result[key][i].name
                                })
                            // this.rowsPayrollGroup.push({
                            //     id:result[key][i].id.toString(),
                            //     text:result[key][i].name
                            //     })
                        }
                    }
                }
                console.log(this.rowsPayrollGroup)
                this.rowsPayrollGroupSelect2 = [...this.rowsPayrollGroup]

                if(typeof(this.payrollGroupId) != 'undefined'){
                    this.modelPayrollGroup = this.payrollGroupId
                }

                if (typeof(this.rowsRunTypeSelect2) != 'undefined' && 
                    typeof(this.rowsPayrollGroupSelect2) != 'undefined'){
                    if(this.rowsRunTypeSelect2.length && this.rowsPayrollGroupSelect2.length){
                        this.showSkeletonApi = false
                    }
                }

                this.modelPayrollGroup = this.payrollGroupId
                // setTimeout(()=>{
                //     let selectrPayGroup:any = document.getElementById('payroll-group-id')
                //     let optionsSelectr = {searchable:true}
                //     let selectrPayGroupRev = new Selectr(selectrPayGroup,optionsSelectr)
                //     if (this.readOnlyInput) {
                //         selectrPayGroupRev.disable()
                //     } else {
                //         selectrPayGroupRev.enable()
                //     }
                // },100)
            }
            },this.params)

            //RUN TYPE
            this.params = "page=0&size=3000&isactive=true"
            this.methodServices.getUrlApi('/api/admin/payruntypes',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
            if (typeof(result) == 'object')
            {
                this.rowsRunType = [];
                for(var key in result){
                    if (key == 'content'){
                        for(var i=0;i<result[key].length;i++){
                            this.rowsRunType.push({
                                id:result[key][i].id,
                                // name:result[key][i].name
                                text:result[key][i].name
                            })
                        }
                    }
                }
                console.log(this.rowsRunType)
                this.rowsRunTypeSelect2 = [...this.rowsRunType]
                
                if (typeof(this.runTypeId) != 'undefined'){
                    this.modelRunType = Number(this.runTypeId)
                } 

                if (typeof(this.rowsRunTypeSelect2) != 'undefined' && 
                    typeof(this.rowsPayrollGroupSelect2) != 'undefined'){
                    if(this.rowsRunTypeSelect2.length && this.rowsPayrollGroupSelect2.length){
                        this.showSkeletonApi = false
                    }
                }
                
                
                // setTimeout(()=>{
                //     let selectrRunType:any = document.getElementById('run-type-id')
                //     let optionsSelectr = {searchable:true}
                //     let selectrRunTypeRev = new Selectr(selectrRunType,optionsSelectr)
                //     if (this.readOnlyInput) {
                //         selectrRunTypeRev.disable()
                //     } else {
                //         selectrRunTypeRev.enable()
                //     }
                // },100)
            }
            },this.params);
        })

        this.activatedRoute.queryParams.subscribe(result=>{
            if (typeof(result.id) != 'undefined'){      //STATUS = NEW
                let decrypt_processid = this.methodServices.decryptOnline(result.id)
                this.payrollProcessId = decrypt_processid
                this.select2PayrollGroupDisabled = true
                this.awalMasuk = true
            }

            if (typeof(result.requestNo) != 'undefined') {
                let decrypt_requestNo = this.methodServices.decryptOnline(result.requestNo)
                this.modelRequestNo = decrypt_requestNo
            }

            if (typeof(result.status) != 'undefined'){      //STATUS = NEW
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                this.status = decrypt_status
            }

            if (this.status == 'new'){
                this.readOnlyInput = false;
                this.showSkeletonApiPartial = false
            } else {
                this.readOnlyInput = true;
            }

            if (typeof(result.payPayrollGroupId) != 'undefined'){      
                let decrypt_payrollGroupId = this.methodServices.decryptOnline(result.payPayrollGroupId)
                this.payrollGroupId = decrypt_payrollGroupId
                this.modelPayrollGroup = decrypt_payrollGroupId
                this.select2PayrollGroup = decrypt_payrollGroupId
            }

            if (typeof(result.payRunTypeId) != 'undefined'){      
                let decrypt_payRunTypeId = this.methodServices.decryptOnline(result.payRunTypeId)
                this.runTypeId = decrypt_payRunTypeId
                this.modelRunType = decrypt_payRunTypeId
                this.select2RunType = decrypt_payRunTypeId
                this.select2RunTypeDisabled = true
            }

            if (typeof(result.periodEndDate) != 'undefined'){  
                let decrypt_periodEndDateConv;
                this.firstCondition = true    
                let decrypt_periodEndDate = this.methodServices.decryptOnline(result.periodEndDate)

                try{
                    decrypt_periodEndDateConv = new Date(decrypt_periodEndDate)
                    let decrypt_periodEndDateConvStr = new DatePipe('en-us').transform(decrypt_periodEndDateConv,'dd-MMM-yyyy')
                    this.modelPeriod = decrypt_periodEndDateConvStr
                    this.modelPeriodEndDate = decrypt_periodEndDateConvStr
                }catch{
                    decrypt_periodEndDateConv = new Date('01-' + decrypt_periodEndDate)
                    let periodEndDateYear = Number(decrypt_periodEndDateConv.getFullYear().toString().replace(/\-/g,''))
                    let periodEndDateTemp = new Date(periodEndDateYear,decrypt_periodEndDateConv.getMonth(),decrypt_periodEndDateConv.getDate())
                    this.modelPeriod = decrypt_periodEndDate
                    this.modelPeriodEndDate = periodEndDateTemp
                }

                let decrypt_cutOffDate = this.methodServices.decryptOnline(result.cutOffDate)
                let decrypt_cutOffDateConv = new Date(decrypt_cutOffDate)
                let decrypt_cutOffDateConvStr = new DatePipe('en-us').transform(decrypt_cutOffDateConv,'dd-MMM-yyyy')
                this.modelCutoffDate = decrypt_cutOffDateConvStr

                let decrypt_payslipDate = this.methodServices.decryptOnline(result.payslipDate)
                let decrypt_payslipDateConv = new Date(decrypt_payslipDate)
                let decrypt_payslipDateConvStr = new DatePipe('en-us').transform(decrypt_payslipDateConv,'dd-MMM-yyyy')
                this.modelPayslipDate = decrypt_payslipDateConvStr


                //IF DATA EXISTS => PAYROLL GROUP & PERIOD then show period, and populate
                if(typeof(this.payrollGroupId) != 'undefined')
                {
                    this.aktifPeriod = true

                    //API PAYROLLGROUP POPULATE
                    let dateStrConv = new DatePipe('en-us').transform(decrypt_periodEndDateConv,'yyyy-MM')
                    
                    this.loadPayrollGroupPopulate(this.payrollGroupId,dateStrConv,()=>{
                        this.loadListEmployeetoPartial(()=>{
                            this.updateActiveToRowsEmp();
                        })
                    })
                }
            }

            //IF ONLY VIEW, SHOW DETAIL TO PARTIAL EMPLOYEE
            if (this.status != 'new'){
                
            }

            
            if(typeof(result.balanceName) != 'undefined'){
                this.modelName = CryptoJS.AES.decrypt(result.balanceName,environment.encryptKey).toString(CryptoJS.enc.Utf8) 
                // this.modelName = result.balanceName
            }
            if(typeof(result.reportingName) != 'undefined'){
                this.modelReportingName = CryptoJS.AES.decrypt(result.reportingName,environment.encryptKey).toString(CryptoJS.enc.Utf8) 
                // this.modelReportingName = result.reportingName
            }
            if(typeof(result.active) != 'undefined'){
                let activeSign = CryptoJS.AES.decrypt(result.active,environment.encryptKey).toString(CryptoJS.enc.Utf8)
                this.modelActiveStatus = activeSign == 'true' ? true : false

                // this.modelActiveStatus = result.active
            }

            //Load Employee List
            // this.loadEmployeeList()
            this.showSkeletonText = false
        })
        
        
        //FORCE INSERT DATATABLE FOR STRETCHING WIDTH OF TABLE
        this.methodServices.filterTemp.subscribe((result)=>{
            setTimeout(()=>{
              this.temp = [];
              this.temp = [...this.methodServices.filterTempObject];
            //   console.log('Filter Temp Object \n')
            //   console.log(this.methodServices.filterTempObject)
            },150)
          })

          
    }

    loadEmployeeList(){
        //Load Employee List
        //Employee List
        
        // this.params = "page=0&size=3000"
        // this.methodServices.getUrlApi('/api/employee/find',

        let idx:number = 1,idxPartial:number = 1;
        let cutOffDateConv = new DatePipe('en-us').transform(this.modelCutoffDate,'yyyy-MM-dd')

        this.params = "cutoffdate=" + cutOffDateConv + "&payrollid=" + this.modelPayrollGroup
        this.methodServices.getUrlApi('/api/admin/paypayrollgroups/listemployee',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
        if (typeof(result) == 'object')
        {
            this.rowsEmp = []
            this.tempEmp = []
            // for(var key in result){
                // if (key == 'content'){
                    for(var i=0;i<result.length;i++){
                        this.rowsEmp.push({
                            no:idx++,
                            // assignmentId:result[key][i].assignmentId,
                            assignmentId:result[i].assigmentId,
                            employeeId:result[i].employeeId,
                            // employeeName:result[key][i].name,
                            employeeName:result[i].fullName,
                            employeeNumber:result[i].employeeNo,
                            // employeeNumber:result[key][i].employeeNumber,
                            // employeeStatus:result[key][i].employeeStatus,
                            employeeStatus:result[i].employeeStatus,
                            // companyName:result[key][i].workLocationName,
                            companyName:result[i].company,
                            // companyId:result[key][i].companyId,
                            companyId:result[i].companyId,
                            positionName:result[i].position,
                            positionId:result[i].positionId,
                            index:idx-2,
                            active:false,
                            action:'DELETE'})
                    }
                // }
                // this.temp = [...this.rows]
            // }

            // setTimeout(()=>{
            this.tempEmp = [...this.rowsEmp];
            this.methodServices.filterTempObject = [...this.rows]
            this.updateActiveToRowsEmp();
            console.log(this.tempEmp)

            let hideArrow = document.getElementsByClassName('hide_arrow')[0]
                if(document.body.contains(hideArrow.nextSibling.nextSibling.nextSibling)){
                    hideArrow.nextSibling.nextSibling.nextSibling.remove()
                }
            // },800) 
        }
        },this.params);
    }


    loadPayrollGroupPopulate(payrollGroupId,dateStrConv,callback){
        this.params = "payrollid=" + this.payrollGroupId + "&period=" + dateStrConv
        this.methodServices.getUrlApi('/api/admin/paypayrollgroups/populate',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            for(var res in result){
                if (typeof(result[res].payslipDate) != 'undefined' &&
                    this.status == 'new'){
                    this.modelPayslipDate = new Date(result[res].payslipDate)
                }
                if (typeof(result[res].cutOffDate) != 'undefined' && 
                    this.status == 'new'){
                    this.modelCutoffDate = new Date(result[res].cutOffDate)
                }
                if (typeof(result[res].periodEndDate) != 'undefined' && 
                    this.status == 'new'){
                    this.modelPeriodEndDate = new Date(result[res].periodEndDate)
                }
            }
            callback()
        },this.params);
    }

    loadListEmployeetoPartial(callback){
        let employeeNo,fullName,employeeId,assignmentId,status,id,companyName,companyId,positionName,positionId;
        let tempPartialView = [];
        let idx:number = 1,idxPartial:number = 1;
        let cutOffDateConv = new DatePipe('en-us').transform(this.modelCutoffDate,'yyyy-MM-dd')
        
        // this.params = "cutoffdate=" + cutOffDateConv + "&payrollid=" + this.payrollGroupId
        // this.methodServices.getUrlApi('/api/admin/paypayrollgroups/listemployee',
        this.params = "payrollprocessid=" + this.payrollProcessId
        this.methodServices.getUrlApi('/api/admin/payrunassigment',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            console.log('hasil payroll process id \n')
            console.log(result)
            for(var res in result){
                if (res == 'content'){
                    for (var res2 in result[res]){
                        if (typeof(result[res][res2].employeeNo) != 'undefined'){
                            employeeNo = result[res][res2].employeeNo
                        }else{employeeNo = null}
    
                        if (typeof(result[res][res2].employeeName) != 'undefined'){
                            fullName = result[res][res2].employeeName
                        }else{fullName = null}
    
                        if (typeof(result[res][res2].id) != 'undefined'){
                            employeeId = result[res][res2].id
                        }else{employeeId = null}
    
                        if (typeof(result[res][res2].assignmentId) != 'undefined'){
                            assignmentId = result[res][res2].assignmentId
                        }else{assignmentId = null}

                        if (typeof(result[res][res2].status) != 'undefined'){
                            status = result[res][res2].status
                        }else{status = null}

                        if (typeof(result[res][res2].id) != 'undefined'){
                            id = result[res][res2].id
                        }else{id = null}

                        if (typeof(result[res][res2].company) != 'undefined'){
                            companyName = result[res][res2].company
                        }else{companyName = null}

                        if (typeof(result[res][res2].companyId) != 'undefined'){
                            companyId = result[res][res2].companyId
                        }else{companyName = null}

                        if (typeof(result[res][res2].position) != 'undefined'){
                            positionName = result[res][res2].position
                        }else{companyName = null}

                        if (typeof(result[res][res2].positionId) != 'undefined'){
                            positionId = result[res][res2].positionId
                        }else{companyName = null}
    
                        tempPartialView.push({
                            no:idx++,
                            noPartial:idxPartial++,
                            assignmentId:assignmentId,
                            employeeId:employeeId,
                            employeeName:fullName,
                            employeeNumber:employeeNo,
                            employeeStatus:status,
                            runAssignmentId:id,
                            companyName:companyName,
                            companyId:companyId,
                            positionName:positionName,
                            positionId:positionId,
                            index:idx-2,
                            active:true,
                            action:'DELETE'
                        })    
                    }
                }
            }
            setTimeout(()=>{
                this.temp = [...tempPartialView]
                this.tempMaster = [...tempPartialView]
                this.methodServices.filterTempObject = [...tempPartialView]
                this.showSkeletonApiPartial = false
                console.log('Load List Employee to Partial \n')
                console.log(this.temp)
                this.aktifPeriod = true
                callback()
            },100)
        },this.params);
    }


    loadListEmployeeCreate(callback){
        let employeeNo,fullName,employeeId,assigmentId;
        let tempPartialView = [];
        let idx:number = 1,idxPartial:number = 1;
        let cutOffDateConv = new DatePipe('en-us').transform(this.modelCutoffDate,'yyyy-MM-dd')

        this.params = "cutoffdate=" + cutOffDateConv + "&payrollid=" + this.payrollGroupId
        this.methodServices.getUrlApi('/api/admin/paypayrollgroups/listemployee',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            for(var res in result){
                if (typeof(result[res].employeeNo) != 'undefined'){
                    employeeNo = result[res].employeeNo
                }else{employeeNo = null}

                if (typeof(result[res].fullName) != 'undefined'){
                    fullName = result[res].fullName
                }else{fullName = null}

                if (typeof(result[res].employeeId) != 'undefined'){
                    employeeId = result[res].employeeId
                }else{employeeId = null}

                if (typeof(result[res].assigmentId) != 'undefined'){
                    assigmentId = result[res].assigmentId
                }else{assigmentId = null}

                tempPartialView.push({
                    no:idx++,
                    noPartial:idxPartial++,
                    assignmentId:assigmentId,
                    employeeId:employeeId,
                    employeeName:fullName,
                    employeeNumber:employeeNo,
                    employeeStatus:null,
                    companyName:null,
                    companyId:null,
                    index:idx-2,
                    active:true,
                    action:'DELETE'
                })
            }
            setTimeout(()=>{
                this.temp = [...tempPartialView]
                this.methodServices.filterTempObject = [...tempPartialView]
                console.log('Load List Employee to Partial \n')
                console.log(this.temp)
                callback()
            },100)
        },this.params);
    }

    updateActiveToRowsEmp(){
        if(this.temp.length > 0 && this.rowsEmp.length > 0){
            this.temp.forEach((item,index)=>{
                let findItem = this.rowsEmp.find((col)=>{
                    return item.assignmentId == col.assignmentId
                })
                if (findItem){
                    this.rowsEmp[findItem.index].active = true
                    item.index = this.rowsEmp[findItem.index].index
                }
            })
            this.methodServices.filterTempObject = [...this.temp]            
        }
    }


    balanceTypesDetailFunc(idBalanceTypes,callback){
        this.params = 'id=' + idBalanceTypes
        this.methodServices.getUrlApi('/api/admin/paybalancetypes/detail',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
        if (typeof(result) == 'object')
        {
            //LOAD FEED DETAIL
            for(var key in result){
                if (key == 'payBalanceFeedsList'){
                    for(var i=0;i<result[key].length;i++){
                            this.rows.push({
                                id:result[key][i].id,   //id balance feed
                                elementName:result[key][i].elementName,
                                type:result[key][i].type,
                                recordStatus:'',
                                index:i
                            })     
                    }
                }
            }

            //LOAD HEADER BALANCE TYPES
            let idTypes:any;
            let nameTypes:any;
            let reportingNameTypes:any;
            let activeTypes:any;
            let companyIdTypes:any;
            if(typeof(result['id']) != 'undefined'){
                idTypes = result['id']
            }
            if(typeof(result['name']) != 'undefined'){
                nameTypes = result['name']
            }
            if(typeof(result['reportingName']) != 'undefined'){
                reportingNameTypes = result['reportingName']
            }
            if(typeof(result['active']) != 'undefined'){
                activeTypes = result['active']
            }
            if(typeof(result['companyId']) != 'undefined'){
                companyIdTypes = result['companyId']
            }
            this.rowsHeader.push({
                id:idTypes,
                name:nameTypes,
                reportingName:reportingNameTypes,
                active:activeTypes,
                companyId:companyIdTypes,
                recordStatus:''
            })

            // this.temp = this.rows;
            // console.log('Balance Feed')
            // console.log(this.rows)
            console.log('Header')
            console.log(this.rowsHeader)
            callback()
        }
        },this.params);
    }

    balanceFeedsDetailFunc(){
        //BALANCE FEED DETAIL
        let idBalanceFeed:any;
        this.rows.forEach((resultLooping)=>{
            idBalanceFeed = 'id=' + resultLooping.id
            this.methodServices.getUrlApi('/api/admin/paybalancefeeds/detail',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
            if (typeof(result) == 'object')
            {
                for (var key in result){
                    if (key == 'payElementTypesId'){
                        resultLooping['payElementTypesId'] = result.payElementTypesId
                    }
                    if (key == 'effectiveDate'){
                        resultLooping['effectiveDate'] = result.effectiveDate
                    }
                    if (key == 'companyId'){
                        resultLooping['companyId'] = result.companyId
                    }
                    if (key == 'active'){
                        resultLooping['active'] = result.active
                    }
                }
            }
            },idBalanceFeed);
        })
        this.temp = this.rows
        this.methodServices.filterTempObject = [...this.rows]
        console.log('New Balance Feed')
        console.log(this.temp)
    }

    

    onActivate(event){
        this.activeRow = event.row
    }

    onSelect({selected}) {
        console.log('selected\n')
        console.log(selected)
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);

        // if (this.selected.length > 0){
        //     let id = this.selected[0].id
        //     let elementName = this.selected[0].elementName
        //     let type = this.selected[0].type

        //     this.getBalanceFeedFilter(id,()=>{
        //         this.getElementTypesLocal(()=>{
        //             this.openDefaultModal(this.modalDefaultRev)
        //             setTimeout(()=>{
        //                 let selectrType:any = document.getElementById('selectrTypeShow')
        //                 let selectrOptions = {searchable:true}
        //                 let selectrRes = new Selectr(selectrType,selectrOptions)

        //                 let selectrElement:any = document.getElementById('selectrElementShow')
        //                 let selectrResElement = new Selectr(selectrElement,selectrOptions)
        //             },100)
        //         })
        //     })
        // }
        // alert(this.selected[0].index)
     }

     onSelectList({selected}) {
        let tempFilter = [];
        console.log('selected\n')
        console.log(selected)
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        this.rowsEmp[this.selected[0].index].active = !this.selected[0].active
        
        tempFilter = this.rowsEmp.find((result)=>{
            return result.active == true
        })
        // if (tempFilter){
        //     this.disabledButton = false
        // }
        // else{
        //     this.disabledButton = true
        // }

        // setTimeout(()=>{
        //     this.tempEmp = [...this.rowsEmp]
        // },100)
        console.log('selected rows After\n')
        console.log(this.tempEmp)
     }

     onSelectEntries({selected}){
        console.log('selected\n')
        console.log(selected)
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
     }

     updateItem(){
        let index=1, indexPartial=1;
        
        this.temp = this.rowsEmp.filter((result)=>{
            this.statusChange = true
            return result.active == true
        })

        this.temp.forEach((result)=>{
            result.no = index++;
            result.noPartial = indexPartial++;
        })
        
        // this.temp.sort(function(a,b){
        //     return b.noPartial - a.noPartial
        // })
        this.table.sorts = [];

        // setTimeout(()=>{
        //     console.log('partial \n')
        //     console.log(this.temp)
        //     this.temp = [...this.temp]
        // },300)

        this.methodServices.filterTempObject = [...this.temp]

        if(this.defaultModal){
            this.defaultModal.hide()
        }

        // let newElementIdShow = this.modelElementNameShow
        // let newTypeShow = this.modelTypeShow
        // if (newTypeShow == null){
        //     newTypeShow = ''
        // }
        // let newEffectiveDateShow = this.modelEffectiveDateShow
        // let newActiveShow = this.modelActiveShow

        // let nameElementFilter = []
        //  if (this.modelEffectiveDateShow != "Invalid Date") {
        //     //rowsShow => Element
        //     nameElementFilter = this.rowsShow.filter(result=>{
        //         if (result.id == newElementIdShow){
        //             return true
        //         }
        //     })

        //     if (this.statusDetailBaru == false){
        //         let posisiIndex = this.selected[0].index
        //         this.rows[posisiIndex].payElementTypesId = Number(newElementIdShow)
        //         this.rows[posisiIndex].elementName = nameElementFilter[0].name
        //         this.rows[posisiIndex].type = newTypeShow
        //         this.rows[posisiIndex].effectiveDate = newEffectiveDateShow
        //         this.rows[posisiIndex].active = this.modelActiveShow
        //         this.rows[posisiIndex].index = posisiIndex
        //         this.rows[posisiIndex].companyId = this.loginCompanyId
        //         this.rows[posisiIndex].recordStatus = 'CHANGE'
        //     }
        //     else{
        //         let newItem = {
        //             active:this.modelActiveShow,
        //             companyId:this.loginCompanyId,
        //             effectiveDate:newEffectiveDateShow,
        //             elementName:nameElementFilter[0].name,
        //             index:this.rows.length,
        //             payElementTypesId:Number(newElementIdShow),
        //             recordStatus:'CHANGE',
        //             type:newTypeShow
        //         }
        //         this.rows.push(newItem)
        //     }

        //     if (typeof(this.modelFilter) != 'undefined'){
        //         this.temp = this.rows.filter((d)=>{
        //             for (var key in d){
        //                 if (d[key].toString().toLowerCase().indexOf(this.modelFilter) != -1 &&
        //                     key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
        //                     return true
        //                 }
        //             }
        //             return false
        //         })
        //     }
        //     else{
        //         this.temp = this.rows.filter((result)=>{
        //             return result.recordStatus != 'DELETE'
        //         })
        //     }

        //     // this.temp = [...this.rows]

        //     console.log('After Update \n')
        //     console.log(this.temp)
            // this.methodServices.filterTempObject = [...this.temp]
        //     this.defaultModal.hide()
        // } else {
        //     this.alert_error_modal_msg = "Effective Date must DD-MMM-YYY e.g. 01-Jan-2020"
        // }
     }

     itemDetail(itemDetail){
        alert(itemDetail)
     }

//tes dulu
    getBalanceFeedFilterOnList(id,callback){
    // Balance Feeds
    this.params = 'id=' + id
    this.methodServices.getUrlApi('/api/admin/paybalancefeeds/detail',
    localStorage.getItem(this.methodServices.seasonKey),
    (result)=>{
        if (typeof(result) == 'object')
        {
            callback(result)
            // this.payBalanceFeedIdShow = result.id
            // this.balanceTypeIdShow = result.payBalanceTypesId
            // this.typeShow = result.type
            // this.payElementTypesIdShow = result.payElementTypesId
            // this.payElementTypesNameShow = result.payElementTypes.name
            // this.effectiveDateShow = result.effectiveDate
            // this.activeShow = result.active
            
            // // this.modelElementName = this.payElementTypesNameShow
            // this.modelElementNameShow = this.payElementTypesIdShow
            // this.modelTypeShow = this.typeShow

            // let effectiveDateConv = new Date(this.effectiveDateShow)
            // let effectiveDateConvStr = new DatePipe('en-us').transform(effectiveDateConv,'yyyy-MM-dd')
            // this.modelEffectiveDateShow = this.effectiveDateShow
            
            
            // this.modelActiveShow = this.activeShow
        }
        },this.params
    );
}

//


     getBalanceFeedFilter(id,callback){
            // Balance Feeds
            this.params = 'id=' + id
            this.methodServices.getUrlApi('/api/admin/paybalancefeeds/detail',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
                if (typeof(result) == 'object')
                {
                    this.payBalanceFeedIdShow = result.id
                    this.balanceTypeIdShow = result.payBalanceTypesId
                    this.typeShow = result.type
                    
                    this.payElementTypesIdShow = result.payElementTypesId
                    this.payElementTypesNameShow = result.payElementTypes.name
                    this.effectiveDateShow = result.effectiveDate
                    this.activeShow = result.active

                    // this.modelElementName = this.payElementTypesNameShow
                    this.modelElementNameShow = this.payElementTypesIdShow
                    this.modelTypeShow = this.typeShow

                    let effectiveDateConv = new Date(this.effectiveDateShow)
                    this.modelEffectiveDateShow = effectiveDateConv


                    this.modelActiveShow = this.activeShow
                    if (this.selected.length > 0)
                    {
                        if(typeof(this.selected[0].payElementTypesId) != 'undefined')
                        {
                            this.modelElementNameShow = this.selected[0].payElementTypesId    
                        }

                        if(typeof(this.selected[0].type) != 'undefined')
                        {
                            this.modelTypeShow = this.selected[0].type
                        }

                        if(typeof(this.selected[0].active) != 'undefined')
                        {
                            this.modelActiveShow = this.selected[0].active
                        }
                        if(typeof(this.selected[0].effectiveDate) != 'undefined')
                        {
                            this.modelEffectiveDateShow = this.selected[0].effectiveDate
                        }
                    }

                }
                callback()
                },this.params
            );
     }


     getElementTypesLocal(callback){
        // ELEMENT TYPES
        let elementId:any;
        let elementName:string;
        let elementReportingName:string;        

        this.methodServices.getUrlApi('/api/admin/payelementtypes?page=0&size=100',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            if (typeof(result) == 'object')
            {
                this.rowsShow = []
                for (var key in result){
                    if (key == 'content'){
                        for (var i=0;i<result[key].length;i++){
                            elementId = result[key][i].id
                            elementName = result[key][i].name
                            elementReportingName = result[key][i].reportingName
                            this.rowsShow.push({id:elementId,
                                            name:elementName,
                                            reportingName:elementReportingName
                                        })
                        }
                        console.log('Element List')
                        console.log(this.rowsShow)
                    }
                }   
            }
            callback()
            }
        );
 }

    submitProc(){
        let arrSave = {}

        this.alert_success_msg = '';
        
        // window.scrollTo(0,0)
        

        if (typeof(this.modelPayrollGroup) == 'undefined' || this.modelPayrollGroup == '' ||
            this.modelPayrollGroup == null){
            this.alert_error_msg = 'Payroll Group is Blank !'
            this.showError('Payroll Group is Blank !');
            return
        }
        else
        if (typeof(this.modelPeriodCheck) == 'undefined' || this.modelPeriodCheck == '' ||
            this.modelPeriodCheck == null){
            this.alert_error_msg = 'Period is Blank !'
            this.showError('Period is Blank !');
            return
        }
        // if (typeof(this.modelPeriod) == 'undefined' || this.modelPeriod == '' ||
        //     this.modelPeriod == null){
        //     this.alert_error_msg = 'Period is Blank !'
        //     this.showError('Period is Blank !');
        //     return
        // }
        else
        if (this.modelPeriodCheck == 'Invalid Date'){
            this.alert_error_msg = 'Period Invalid Date !'
            this.showError('Period Invalid Date !');
            return
        }
        // if (this.modelPeriod == 'Invalid Date'){
        //     this.alert_error_msg = 'Period Invalid Date !'
        //     this.showError('Period Invalid Date !');
        //     return
        // }
        else
        if (typeof(this.modelPayslipDate) == 'undefined' || this.modelPayslipDate == '' ||
            this.modelPayslipDate == null){
            this.alert_error_msg = 'Payslip Date is Blank !'
            this.showError('Payslip Date is Blank !');
            return
        }
        else
        if (this.modelPayslipDate == 'Invalid Date'){
            this.alert_error_msg = 'Payslip Invalid Date !'
            this.showError('Payslip Invalid Date !');
            return
        }
        else
        if (typeof(this.modelCutoffDate) == 'undefined' || this.modelCutoffDate == '' ||
            this.modelCutoffDate == null){
            this.alert_error_msg = 'Cutoff Date is Blank !'
            this.showError('Cutoff Date is Blank !');
            return
        }
        else
        if (this.modelCutoffDate == 'Invalid Date'){
            this.alert_error_msg = 'Cutoff Invalid Date !'
            this.showError('Cutoff Invalid Date !');
            return
        }
        else
        if (typeof(this.modelPeriodEndDate) == 'undefined' || this.modelPeriodEndDate == '' ||
            this.modelPeriodEndDate == null){
            this.alert_error_msg = 'Period End Date is Blank !'
            this.showError('Period End Date is Blank !');
            return
        }
        else
        if (this.modelPeriodEndDate == 'Invalid Date'){
            this.alert_error_msg = 'Period End Invalid Date !'
            this.showError('Period End Invalid Date  !');
            return
        }
        else
        if (typeof(this.modelRunType) == 'undefined' || this.modelRunType == '' || 
            this.modelRunType == null){
            this.alert_error_msg = 'Run Type is Blank !'
            this.showError('Run Type is Blank !');
            return
        }
        else
        // if (this.temp.length == 0){
        //     this.alert_error_msg = 'Detail Partial Employee is Blank !'
        //     this.showError('Detail Partial Employee is Blank !');
        // }
        // else
        // {
            swal.fire({
                title: 'Are you sure want to submit this process?',
                type: 'question',
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary',
                confirmButtonText: 'Yes',
                cancelButtonClass: 'btn btn-secondary'
            }).then((result) => {
                if (result.value) {
                    this.alert_error_msg = ''            
                    
                    let payslipDateStr = new DatePipe('en-us').transform(this.modelPayslipDate,'yyyy-MM-dd')
                    let cutOffDateStr = new DatePipe('en-us').transform(this.modelCutoffDate,'yyyy-MM-dd')
                    let periodEndDateStr = new DatePipe('en-us').transform(this.modelPeriodEndDate,'yyyy-MM-dd')
        
                    arrSave = {
                        payrollGroupId:Number(this.modelPayrollGroup),
                        payslipDate:payslipDateStr,
                        cutOffDate:cutOffDateStr,
                        periodEndDate:periodEndDateStr,
                        payRunTypeId:Number(this.modelRunType)
                    }
                    
                    if (this.temp.length > 0){
                        arrSave['payPayrollRequestMembersList'] = []
                        this.temp.forEach((item,index)=>{
                            arrSave['payPayrollRequestMembersList'].push({
                                assigmentId:item.assignmentId
                            })
                        })
                    }
                    
                    console.log('Saving !')
                    console.log(arrSave)
                    console.log('Saving Temp \n')
                    console.log(this.temp)
                    // this.showSuccess('Submit successfully !')
                    this.disabledSubmit = true
                    // setTimeout(()=>{
                    //     this.cancelBackStatus = true
                    //     this.router.navigate(['/payroll','process-result'])
                    //     this.methodServices.aktif_table.next(true)
                    // },3500)
                    
                    // console.log(dataObj)
                    
                    this.methodServices.postData(arrSave,
                        localStorage.getItem(this.methodServices.seasonKey),
                        '/api/admin/paypayrollrequest',
                        (err,success)=>{
                            if (err != ''){
                                console.log('Error \n')
                                console.log(err)
                                this.disabledSubmit = false
                                // this.alert_error_msg = err
                                this.showError(err);
                            }
                            else
                            if(success != ''){
                                console.log('Success : ' + success)
                                this.showToast(success,'success')
                                // this.alert_success_msg = success
                                // this.showSuccess(success)
                                // setTimeout(()=>{
                                this.cancelBackStatus = true
                                this.router.navigate(['/payroll','process-result'])
                                this.methodServices.aktif_table.next(true)
                                // },3500)
                            }
                        }
                    )
                }
            })
            
        // }
    }

    filterTable($event) {
        let val = $event.target.value.toLowerCase();
        let recordStatusFilter:any;
        this.temp = this.rows.filter(function(d) {
          for(var key in d){
            if(d[key].toString().toLowerCase().indexOf(val) !== -1 && 
                key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
              return true;
            }
          }
          return false;
        });
        this.methodServices.filterTempObject = [...this.temp]
      }

      filterTableList($event) {
        let val = $event.target.value.toLowerCase();
        let recordStatusFilter:any;
        this.tempEmp = this.rowsEmp.filter(function(d) {
            for(var key in d){
                if (d[key] != null){
                    if(d[key].toString().toLowerCase().indexOf(val) !== -1 && 
                        key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
                        return true;
                    }
                }
            }
            return false;
            });
        
        this.methodServices.filterTempObject = [...this.temp]
      }

      filterTableEntries($event) {
        let val = $event.target.value.toLowerCase();
        let recordStatusFilter:any;
        this.tempEntries = this.rowsEntries.filter(function(d) {
          for(var key in d){
            if(d[key] != null){
                if(d[key].toString().toLowerCase().indexOf(val) !== -1 && 
                    key != 'recordStatus' && d['recordStatus'] != 'DELETE' &&
                    d[key] != null){
                    return true;
                }
                else
                    if(key == 'value'){
                        let valueTemp = d[key].replace(/\./gim,'')
                        if (valueTemp.toString().toLowerCase().indexOf(val) !== -1 &&
                            d['recordStatus'] != 'DELETE'){
                            return true;
                        }
                    }
            }
          }
          return false;
        });
        
        this.methodServices.filterTempObject = [...this.temp]
      }

      filterTablePartial($event) {
        let val = $event.target.value.toLowerCase();
        let recordStatusFilter:any;
        let index:number = 1;
        if (this.status == 'new'){
            this.temp = this.rowsEmp.filter(function(d) {
            for(var key in d){
                if (d[key] != null){
                    if(d[key].toString().toLowerCase().indexOf(val) !== -1 && 
                        d['active'] == true && 
                        (key == 'employeeName' || key == 'employeeNumber' ||
                            key == 'no' )){                        
                        d['noPartial'] = index++;
                    return true;
                    }
                }
            }
            return false;
            });    
        }
        else{
            this.temp = this.tempMaster.filter(function(d) {
            for(var key in d){
                if (d[key] != null){
                    if (typeof(d[key]) == 'number'){
                        val = val.toString()
                    }

                    if(d[key].toString().toLowerCase().indexOf(val) !== -1 && 
                        d['active'] == true && 
                        (key == 'employeeName' || key == 'employeeNumber' ||
                            key == 'no' )){                        
                        d['noPartial'] = index++;
                       return true;
                    }
                }
            }
            return false;
            });    
        }
        

        this.table.sorts = []
        // console.log(this.temp)
        // this.temp.forEach((result)=>{
        //     result.no = index++;
        // })

        this.methodServices.filterTempObject = [...this.temp]
      }


    openDefaultModal(modalDefault: TemplateRef<any>) {
        this.defaultModal = this.modalService.show(modalDefault, this.default);
    }

    openDefaultModalEntries(modalDefault: TemplateRef<any>) {
        this.defaultModal = this.modalService.show(modalDefault, this.defaultEntries);
    }

    ngOnDestroy(){
        // this.methodServices.aktif_table.next(false)
        this.hiddenModal.next(true)
    }

    ngAfterContentChecked(){
    }

    entriesChange($event){
        this.entries = Number($event.target.value);
      }

      entriesChangeList($event){
        this.entriesList = Number($event.target.value);
        this.tempEmp = []
        this.tempEmp.push(...this.rowsEmp);
        
        // this.tempEmp = []
        // setTimeout(()=>{
        //     this.defaultModal.hide();
        //     this.openDefaultModal(this.modalDefaultRev)
        //     this.tempEmp = [...this.rowsEmp]
        // },200)
      }

      entriesChangeEnteriesList($event){
        this.entriesListEntries = Number($event.target.value);
        this.tempEntries = []
        this.tempEntries.push(...this.rowsEntries);
        
        // this.tempEmp = []
        // setTimeout(()=>{
        //     this.defaultModal.hide();
        //     this.openDefaultModal(this.modalDefaultRev)
        //     this.tempEmp = [...this.rowsEmp]
        // },200)
      }

    deleteShow(index,modalTemp:TemplateRef<any>){
        console.log('delete temp \n')
        console.log(this.temp)
        // console.log('select Item \n')
        // console.log(selectItem)

        this.indexModalSelect = this.temp[index].index
        this.noModalSelect = index
        // this.defaultModalDelete = this.modalService.show(modalTemp,this.defaultDelete)
        this.deleteItem();
        this.textModalSelect = this.temp[index].employeeName
        // alert(this.temp[index].index)
    }

    deleteItem(){
        let index=1, indexPartial=1;
        // this.rowsEmp[this.selected[0].index].active = false
        this.rowsEmp[this.indexModalSelect].active = false
        // this.temp.splice(this.selected[0].no-1,1)
        this.temp.splice(Number(this.noModalSelect),1)
        // setTimeout(()=>{
            this.statusChange = true
            this.temp = [...this.temp]
        // },100)
        

        this.temp.forEach((result)=>{
            result.no = index++;
            result.noPartial = indexPartial++;
        })

        console.log('after delete \n')
        console.log(this.temp)
        if(this.defaultModalDelete)
        {
            this.defaultModalDelete.hide()
        }
        // if (typeof(this.rows[this.indexModalSelect].id) != 'undefined'){
        //     this.rows[this.indexModalSelect].recordStatus = 'DELETE'
        // }
        // else{
        //     //RESET ARRAY FROM INSERT DATA AND ADJUST INDEX ON THIS.ROWS
        //     this.rows.splice(this.indexModalSelect,1)

        //     let tempArr = []
        //     tempArr = this.rows.filter((result)=>{
        //         return typeof(result.id) == 'undefined'
        //     })
        //     this.rows = this.rows.filter((result)=>{
        //         return typeof(result.id) != 'undefined'
        //     })

        //     let rowsLength:number;
        //     rowsLength = this.rows.length;

        //     tempArr.forEach((result)=>{
        //         result.index = rowsLength
        //         rowsLength += 1
        //     })
            
        //     this.rows.push(...tempArr)

        //     console.log('temp Arr Delete Index')
        //     console.log(tempArr)        
        // }
        
        // this.defaultModalDelete.hide()
        // this.temp = this.rows.filter((result)=>{
        //     return result.recordStatus != 'DELETE'
        // })
        // console.log('Delete')
        // console.log(this.rows)
        this.methodServices.filterTempObject = [...this.temp]
        // console.log('Delete item')
        // console.log(this.rows)
        // console.log(this.temp)
    }

    editShow(index,modalTemp:TemplateRef<any>){
        this.statusDetailBaru = false
        this.textModalSelect = this.temp[index].elementName
        this.indexModalSelect = this.temp[index].index
        this.alert_error_modal_msg = ""

        if (typeof(this.temp[index].id) != 'undefined'){
            let idSelect = this.temp[index].id
        
            let id = idSelect
            // let elementName = this.selected[0].elementName
            // let type = this.selected[0].type

            this.getBalanceFeedFilter(id,()=>{
                this.getElementTypesLocal(()=>{
                    this.openDefaultModal(this.modalDefaultRev)
                    // setTimeout(()=>{
                    //     let selectrType:any = document.getElementById('selectrTypeShow')
                    //     let selectrOptions = {searchable:true}
                    //     let selectrRes = new Selectr(selectrType,selectrOptions)

                    //     let selectrElement:any = document.getElementById('selectrElementShow')
                    //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
                    // },100)
                })
            })
        // this.defaultModal = this.modalService.show(modalTemp,this.default)
        }
        else{
            let tempArr = [];
            // console.log('selected baru')
            
            // this.selected.push(this.temp[index])
            tempArr.push(this.temp[index])
            console.log('tempArr')
            console.log(tempArr)

            if(typeof(tempArr[0].payElementTypesId) != 'undefined')
            {
                this.modelElementNameShow = tempArr[0].payElementTypesId
            }

            if(typeof(tempArr[0].type) != 'undefined')
            {
                this.modelTypeShow = tempArr[0].type
            }

            if(typeof(tempArr[0].active) != 'undefined')
            {
                this.modelActiveShow = tempArr[0].active
            }
            if(typeof(tempArr[0].effectiveDate) != 'undefined')
            {
                this.modelEffectiveDateShow = tempArr[0].effectiveDate
            }

            this.getElementTypesLocal(()=>{
                this.openDefaultModal(this.modalDefaultRev)
                // setTimeout(()=>{
                //     let selectrType:any = document.getElementById('selectrTypeShow')
                //     let selectrOptions = {searchable:true}
                //     let selectrRes = new Selectr(selectrType,selectrOptions)

                //     let selectrElement:any = document.getElementById('selectrElementShow')
                //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
                // },100)
            })

            // if (this.selected.length > 0)
            // {
            //     this.parsingNewItemPrior(()=>{
            
            //     })
            // }
        }
    }

    parsingNewItemPrior(callback){
            
        
        callback()
    }

    cancelBack(){
        this.cancelBackStatus = true
        this.router.navigate(['/payroll/process-result'])
        this.methodServices.aktif_table.next(true)
    }

    createElement(){
        this.statusDetailBaru = true       
        this.modelElementNameShow = null
        // this.disabledButton = true
        this.modelTypeShow = null
        let today = new Date()
        let todayStr = new DatePipe('en-us').transform(today,'yyyy-MM-dd')
        this.modelEffectiveDateShow = todayStr
        this.modelActiveShow = false

        if(typeof(this.modelPayrollGroup) == 'undefined' || 
            this.modelPayrollGroup == null || this.modelPayrollGroup == ''){
            this.showError('Payroll Group can\'t be blank !')
            return
        }
        if (this.modelPeriodCheck == null || typeof(this.modelPeriodCheck) == 'undefined' ||
            this.modelPeriodCheck == 'Invalid Date')
        {
            this.showError('Check again your Period Date !')
            return
        }
        // if (this.modelPeriod == null || typeof(this.modelPeriod) == 'undefined' ||
        //     this.modelPeriod == 'Invalid Date')
        // {
        //     this.showError('Check again your Period Date !')
        //     return
        // }
        if (this.modelCutoffDate == null || typeof(this.modelCutoffDate) == 'undefined' ||
            this.modelCutoffDate == 'Invalid Date')
        {
            this.showError('Check again your Cutoff Date !')
            return
        }
        
        //Load Employee List
        this.loadEmployeeList();

        this.openDefaultModal(this.modalDefaultRev)

        

        // this.getElementTypesLocal(()=>{
        //     this.openDefaultModal(this.modalDefaultRev)
        //     setTimeout(()=>{
        //         let selectrType:any = document.getElementById('selectrTypeShow')
        //         let selectrOptions = {searchable:true}
        //         let selectrRes = new Selectr(selectrType,selectrOptions)

        //         let selectrElement:any = document.getElementById('selectrElementShow')
        //         let selectrResElement = new Selectr(selectrElement,selectrOptions)
        //     },100)
        // })
    }

    changeStatus(event){
        if (event.target.value != null){
            this.disabledButton = false
        }
        else{
            this.disabledButton = true
        }
    }

    deleteItemId(){
        this.defaultModalDeleteId = this.modalService.show(this.modalDeleteIdRev,this.defaultDelete)
    }
    
    deleteItemIdYes(){
        var dataObj = {}

        window.scrollTo(0,0)

        if (this.id != null && this.id != '')
        {    
            dataObj["id"] = Number(this.id)
        }
        
        this.defaultModalDeleteId.hide()

        this.methodServices.postData(dataObj,
            localStorage.getItem(this.methodServices.seasonKey),
            '/api/admin/paybalancetypes/delete',
            (err,success)=>{
                if (err != ''){
                    this.alert_error_msg = err
                    this.showError(err)
                }
                else
                if(success != ''){
                    console.log('Success : ' + success)
                    // this.alert_success_msg = success
                    this.showSuccess(success)
                    this.cancelBackStatus = true
                    this.router.navigate(['payroll','balance'])
                    this.methodServices.aktif_table.next(true)
                }
            }
        )
    }

    onSort($event){
        console.log('hasil sort \n')
        console.log($event)
          let x;
          let y;
          let dataSort:boolean;
          
          let titleSort = ['active','employeeNumber','employeeName','no','action']
          if(titleSort.length > 0){
            dataSort = false;
            titleSort.forEach((colname)=>{
              if ($event.newValue == 'asc'){
                  if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                    this.tempEmp.sort(function(a,b){
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
                      setTimeout(()=>{
                          this.tempEmp = [...this.tempEmp]
                      },100)
                    }  
                    console.log('hasil \n')
                    console.log(this.tempEmp)
                  }
              }
              else if($event.newValue == 'desc'){
                if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                  this.tempEmp.sort(function(a,b){
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
                    this.tempEmp.reverse();
                    setTimeout(()=>{
                        this.tempEmp = [...this.tempEmp]
                    },100)
                  }
                  console.log('hasil \n')
                  console.log(this.tempEmp)
                }
              }
            })
          }


          return
    }
    

    onSortPartial($event){
        console.log('hasil sort Partial \n')
        console.log($event)
          let x;
          let y;
          let dataSort:boolean;

          let titleSort = ['active','employeeNumber','employeeName','no','noPartial','action']
          if(titleSort.length > 0){
            dataSort = false;
            titleSort.forEach((colname)=>{
              if ($event.newValue == 'asc'){
                  if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                    this.temp.sort(function(a,b){
                      if(colname == 'no' || colname == 'noPartial'){
                        return a[colname] - b[colname]
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
                      setTimeout(()=>{
                          this.temp = [...this.temp]
                          this.methodServices.filterTempObject = [...this.temp]
                      },100)
                    }  
                    console.log('hasil sort partial \n')
                    console.log(this.temp)
                  }
              }
              else if($event.newValue == 'desc'){
                if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                  this.temp.sort(function(a,b){
                    if(colname == 'no' || colname == 'noPartial'){
                      return b[colname] - a[colname]
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
                    this.temp.reverse();
                    setTimeout(()=>{
                        this.temp = [...this.temp]
                        this.methodServices.filterTempObject = [...this.temp]
                    },100)
                  }
                  console.log('hasil \n')
                  console.log(this.temp)
                }
              }
            })
          }
          return
    }

    onSortEntries($event){
        console.log('hasil sort Entries \n')
        console.log($event)
          let x;
          let y;
          let dataSort:boolean;

          let titleSort = ['elementName','elementClassification','value','no']
          if(titleSort.length > 0){
            dataSort = false;
            titleSort.forEach((colname)=>{
              if ($event.newValue == 'asc'){
                  if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                    this.tempEntries.sort(function(a,b){
                      if(colname == 'no'){
                        return a[colname] - b[colname]
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
                      setTimeout(()=>{
                          this.tempEntries = [...this.tempEntries]
                          this.methodServices.filterTempObject = [...this.temp]
                      },100)
                    }  
                    console.log('hasil sort entries \n')
                    console.log(this.tempEntries)
                  }
              }
              else if($event.newValue == 'desc'){
                if($event.column.prop.toLowerCase() == colname.toLowerCase()){
                  this.tempEntries.sort(function(a,b){
                    if(colname == 'no' || colname == 'noPartial'){
                      return b[colname] - a[colname]
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
                    this.tempEntries.reverse();
                    setTimeout(()=>{
                        this.tempEntries = [...this.tempEntries]
                        this.methodServices.filterTempObject = [...this.temp]
                    },100)
                  }
                  console.log('hasil sort entries \n')
                  console.log(this.tempEntries)
                }
              }
            })
          }
          return
    }


    parsingData(){
        // this.openDefaultModal(this.modalDefaultRev)
        setTimeout(()=>{
            // this.tesArr = [];
            this.modelClone = 'GIT'
            this.container.createEmbeddedView(this.clone)

            // let selectrPayGroup:any = document.getElementById('clone-id')
            // let optionsSelectr = {searchable:true}
            // let selectrPayGroupRev2 = new Selectr(selectrPayGroup,optionsSelectr)

            // let selectrRunType:any = document.getElementById('run-type-id')
            // let selectrRunTypeRev = new Selectr(selectrRunType,optionsSelectr)            
        },500)
    }

    
    dateChangeProd($event,method){
        let inputStr;
        let dateStr;
        let payslipDate;
        let cutOffDate;
        let periodEndDate;
        let tempInputStr;
        let tesDate;
        
        this.aktifPeriod = false

        // if($event.target.value.length != 8 && method == 'keyup'){
        //     return
        // }
        this.modelPeriodCheck = null

        if (typeof($event) != 'undefined' && $event != null){
            if (method == 'keyup'){ 
                if ($event.key != 'ArrowLeft' && $event.key != 'ArrowRight' &&
                        $event.key != 'ArrowUp' && $event.key != 'ArrowDown')
                {
                    this.statusChange = true
                }
                inputStr = $event.target.value.replace(' ','')
            }
            else{
                if (this.awalMasuk == false){
                    this.statusChange = true    //DETECT ANY CHANGE
                }
                else{
                    this.awalMasuk = false
                }
                
                tempInputStr = $event;
                tesDate = new Date(tempInputStr)                
                if (tesDate == 'Invalid Date'){
                    return
                }
                inputStr = new DatePipe('en-us').transform(tempInputStr,'MMM-yyyy')
            }
            

            dateStr = new Date(inputStr)
            this.modelPeriodCheck = dateStr
            
            if (dateStr == 'Invalid Date'){
                dateStr = inputStr
                if (dateStr == 'Invalid Date'){
                    this.aktifPeriod = false
                    return
                }
            }
            
            
            if (typeof(this.modelPayrollGroup) == 'undefined' && 
                inputStr.length >= 6){
                this.statusErrPayroll = true
                this.aktifPeriod = false
            }
            else{
                this.statusErrPayroll = false
            }

            //IF DATA EXISTS => PAYROLL GROUP & PERIOD then show period, and populate
            if(typeof(this.modelPayrollGroup) != 'undefined' && 
                inputStr.length == 8 && dateStr != 'Invalid Date')
            {
                this.aktifPeriod = true

                //API PAYROLLGROUP POPULATE
                let dateStrConv;
                try{
                    dateStrConv = new DatePipe('en-us').transform(dateStr,'yyyy-MM')
                }catch{
                    //dateStr jadi bertipe string
                    let dateStrOtherFirst = new Date('01-' + dateStr)
                    // let dateStrOtherFirst = new Date(2020,10,23)
                    let dateStrYear = Number(dateStrOtherFirst.getFullYear().toString().replace(/\-/g,''))
                    let dateStrOtherFinal = new Date(dateStrYear,
                        dateStrOtherFirst.getMonth(),dateStrOtherFirst.getDate())

                    // alert(new DatePipe('en-us').transform(dateStrOtherFinal,'yyyy-MM'))
                    if(dateStrOtherFinal.toString() == 'Invalid Date'){
                        this.aktifPeriod = false
                        return
                    }
                    dateStrConv = new DatePipe('en-us').transform(dateStrOtherFinal,'yyyy-MM')
                }
                

                if (typeof($event.key) != 'undefined')
                {
                    let charCode = $event.key.charCodeAt(0)
                    if ($event.key == 'ArrowLeft' || $event.key == 'ArrowRight' ||
                        $event.key == 'ArrowUp' || $event.key == 'ArrowDown' ||
                        (!((Number($event.key) >= 0 && Number($event.key) <= 9) || $event.key=='-')
                        )
                        )
                    {
                        return   
                    }
                }

                this.params = "payrollid=" + this.modelPayrollGroup + "&period=" + dateStrConv
                this.methodServices.getUrlApi('/api/admin/paypayrollgroups/populate',
                localStorage.getItem(this.methodServices.seasonKey),
                (result)=>{
                    for(var res in result){
                        if (typeof(result[res].payslipDate) != 'undefined'){
                             payslipDate = new Date(result[res].payslipDate)
                             this.modelPayslipDate = payslipDate
                        }
                        if (typeof(result[res].cutOffDate) != 'undefined'){
                            cutOffDate = new Date(result[res].cutOffDate)
                            this.modelCutoffDate = cutOffDate
                        }
                        if (typeof(result[res].periodEndDate) != 'undefined'){
                            periodEndDate = new Date(result[res].periodEndDate)
                            this.modelPeriodEndDate = periodEndDate
                        }
                    }
                },this.params);
            }
        }
        else{
            this.aktifPeriod = false
        }
        
    }

    payGroupProd(){
        let dateStr;

        if (this.status == 'new'){
            this.modelPeriod = undefined
            this.statusChange = true    //DETECT ANY CHANGE FOR CAN LEAVE
        }
        else
        {
            if(this.firstCondition == false){
                this.modelPeriod = undefined
                this.statusChange = true    //DETECT ANY CHANGE FOR CAN LEAVE
            }
            else{
                if (this.countLoadAwal >= 1){
                    this.firstCondition = false
                }
    
                this.countLoadAwal++;
            }
        }
        
        
        this.aktifPeriod = false

        if (typeof(this.modelPayrollGroup) != 'undefined'){
            this.statusErrPayroll = false
            
            if(typeof(this.modelPeriod) != 'undefined'){
                dateStr = new Date(this.modelPeriod)
                if (dateStr == 'Invalid Date'){
                    this.aktifPeriod = false
                }else{
                    this.aktifPeriod = true
                }
            }
        }
    }

    showError(content){
        this.toastr.show(            
            `<span class='alert-icon ni ni-bell-55' data-notify='icon'></span>
            <div class = 'alert-text'>
                <span class = 'alert-title' data-notify='title'>Warning</span>
                <span data-notify='message'>` + content + `</span>
            </div>`,
            "",
            {
                timeOut:3000,
                enableHtml:true,
                closeButton:true,
                tapToDismiss:false,
                titleClass:"alert-title",
                positionClass:"toast-top-center",
                toastClass:"ngx-toastr alert alert-dismissible alert-danger alert-notify"
            }
        )       
    }

    showSuccess(content){
        this.toastr.show(            
            `<span class='alert-icon ni ni-bell-55' data-notify='icon'></span>
            <div class = 'alert-text'>
                <span class = 'alert-title' data-notify='title'>Info</span>
                <span data-notify='message'>` + content + `</span>
            </div>`,
            "",
            {
                timeOut:3000,
                enableHtml:true,
                closeButton:true,
                tapToDismiss:false,
                titleClass:"alert-title",
                positionClass:"toast-top-center",
                toastClass:"ngx-toastr alert alert-dismissible alert-success alert-notify"
            }
        )       
    }

    elementEntriesProc(rowIndex){
        // alert(this.temp[rowIndex].assignmentId)
        this.tempEntries = []
        this.loadEntries(Number(this.temp[rowIndex].runAssignmentId),()=>{
            this.openDefaultModalEntries(this.modalElementEntriesRev)
        })
    }

    loadEntries(runAssignmentId,callback){
        let idx:number = 1;
        let valueDecrypt;
        let valueDecryptNumber;
        this.rowsEntries = [];
        this.tempEntries = [];  
        this.params = "runassignmentid=" + runAssignmentId
        this.methodServices.getUrlApi('/api/admin/payrunresult',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
        if (typeof(result) == 'object')
        {
            // console.log('result ', result)
            for(var i=0;i<result.length;i++){
                // console.log('data ',result.payRunResults)
                if (result[i].encryptedValue != null &&  
                    result[i].encryptedValue != '' &&
                    typeof(result[i].encryptedValue) != 'undefined')
                {
                    let tempNumber = this.methodServices.decryptValue(result[i].encryptedValue)
                    let options = {
                        style:"decimal",
                        minimumFractionDigits:2,
                        useGrouping:true,
                        currency:"IDR"
                    }
                    valueDecryptNumber = new Number(tempNumber).toLocaleString('id-ID',options)
                    valueDecrypt = valueDecryptNumber
                } 
                else{
                    valueDecrypt = null
                }

                this.rowsEntries.push({
                    no:idx++,
                    id:result[i].id,
                    // assignmentId:result[i].assignmentId,
                    elementName:result[i].elementName,
                    elementClassification:result[i].elementClassificationName,
                    value:valueDecrypt != null ? valueDecrypt : ''
                    })
            }
            this.tempEntries = [...this.rowsEntries]
            // console.log(this.rowsEntries);
            callback()
        }
        },this.params);
    }

    dateChangeOther($event){
        if (this.awalMasukDateChangeOther == 2){
            this.statusChange = true
        }
        this.awalMasukDateChangeOther++
        // if (this.countCutOffDate >= 1){
        //     this.statusChange = true
        //     return
        // }
        // this.countCutOffDate++;
    }

    dateChangePeriodEnd($event){
        if(this.awalMasukDateChangePeriodEnd == 1){
            this.statusChange = true
        }
        this.awalMasukDateChangePeriodEnd++;
        // if (this.countPeriodEndDate >= 1){
        //     this.statusChange = true
        //     return
        // }
        // this.countPeriodEndDate++;
    }

    runTypeProd(){
        if (typeof(this.status) != 'undefined' && this.status != 'new'){
            if(this.countRunType == 2){
                this.statusChange = true
                return
            }
            this.countRunType++;
        }
        else
        if (this.status == 'new')
        {
            this.statusChange = true
        }
    }

    // this.defaultModal.hide()
    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

    onOpenCalendar(container) {
        container.monthSelectHandler = (event: any): void => {
          container._store.dispatch(container._actions.select(event.date));
        };     
        container.setViewMode('month');
 
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
                        messageClass: 'w-100',
                        titleClass: 'alert-title',
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
                        messageClass: 'w-100',
                        titleClass: 'alert-title',
                        positionClass: 'toast-top-center',
                        toastClass: "ngx-toastr alert alert-dismissible alert-danger alert-notify",
                    }
                );
                break;
        }
    }
}