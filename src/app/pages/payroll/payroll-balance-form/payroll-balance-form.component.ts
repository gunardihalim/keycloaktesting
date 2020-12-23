import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit, AfterViewChecked, AfterContentInit, TemplateRef, HostListener, ChangeDetectionStrategy, AfterContentChecked, ElementRef } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm, FormControl } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { HttpClient } from '@angular/common/http';
import * as CryptoJS from 'crypto-js'
import { environment } from 'src/environments/environment'
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs';

import { canComponentDeactive } from '../../../services/deactivate-guard'
import { Template } from '@angular/compiler/src/render3/r3_ast';
import swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr'
import {diffrentDate} from "../../../validation-global/diffrent-date";
import { Select2OptionData } from 'ng-select2';
import { element } from 'protractor';

@Component({
    selector:"payroll-balance-form",
    templateUrl:"payroll-balance-form.component.html",
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

export class PayrollBalanceFormComponent implements OnInit, OnDestroy, AfterContentChecked
            , canComponentDeactive{
    
@ViewChild('f') f:NgForm;
@ViewChild('tableBalance') table:DatatableComponent;
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

showSkeletonText:boolean = true;
showSkeletonApiTable:boolean = true;

bsValue = new Date()

@ViewChild('name') name:ElementRef;
@ViewChild('reportingName') reportingName:ElementRef;

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
modelTypeShowRev:string;

hiddenModal = new Subject<boolean>()

cancelBackStatus:boolean = false;

statusDetailBaru:boolean = false;

disabledButton:boolean = true;
statusChange:boolean = false;

@ViewChild('modalDefault') modalDefaultRev:TemplateRef<any>
@ViewChild('modalDeleteId') modalDeleteIdRev:TemplateRef<any>


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
                private toastr:ToastrService,
                private diffrentDate:diffrentDate,
                private modalService:BsModalService,
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
    rowsHeader:any = [];

    id:string;

    religionFinal = [];
    genderFinal = [];
    
    as_of_date = new Date()
    modelEffectiveDate:string;
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
    alert_error_modal_msg:string = '';
    alert_success_msg:string = '';

    modelEffectiveDateShow:any;
    modelEffectiveDateShowCheck:any;
    modelActiveShow:boolean= true;
    modelElementNameShow:number;
    modelElementNameShowRev:number;

    modelFilter:string;

    loginCompanyId:any;
    status = '';
    rowsType = [];
    tempType = [];
    
    rowsShow = [];
    rowsShowSelect2: Array<Select2OptionData> = [];
    arrTypeShow:any[] =[
        {id: 'Add', text: 'Add'},
        {id: 'Substract', text: 'Substract'}
    ]
    arrTypeShowSelect2: Array<Select2OptionData> = [...this.arrTypeShow];

    textModalSelect:string;
    indexModalSelect:any;
    modelEffectiveDateTop:any = new Date();
    elementTypesDetailClassId:any;
    elementTypesDetailClassName:any;
    statusCreateElement:boolean=false;

    // createDetail:boolean = true;
    default = {
        keyboard:true,
        class:'modal-dialog-centered modal-sm',
        ignoreBackdropClick:true
    }

    defaultDelete = {
        keyboard:true,
        class:'modal-dialog-centered modal-danger',
        ignoreBackdropClick:true
    }

    ngOnInit(){
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
        })

        this.activatedRoute.queryParams.subscribe(result=>{

            if (typeof(result.status) != 'undefined'){      //STATUS = NEW
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                this.status = decrypt_status
                // this.createDetail = true   //BUTTON CREATE DETAIL
            }

            if (typeof(result.id) != 'undefined'){
                this.id = this.methodServices.decryptOnline(result.id)
                // this.createDetail = true   //BUTTON CREATE DETAIL
            }
            
            if(typeof(result.balanceName) != 'undefined'){
                this.modelName = this.methodServices.decryptOnline(result.balanceName)
                // this.modelName = result.balanceName
            }
            if(typeof(result.reportingName) != 'undefined'){
                this.modelReportingName = this.methodServices.decryptOnline(result.reportingName)
                // this.modelReportingName = result.reportingName
            }
            if(typeof(result.active) != 'undefined'){
                let activeSign = this.methodServices.decryptOnline(result.active)
                this.modelActiveStatus = activeSign == 'true' ? true : false

                // this.modelActiveStatus = result.active
            }
            if (typeof(result.status) != 'undefined') {
                let status = this.methodServices.decryptOnline(result.status)
                this.status = status
            }

            //Balance Feed (use)
            if (this.id != null && this.id != 'undefined' && this.id != ''){
                this.balanceTypesDetailFunc(this.id,()=>{
                    this.balanceFeedsDetailFunc()
                })
            }

            // if (typeof(result.status) != 'undefined'){
            //     if (result.status == 'new'){
            //         this.disabledSubmit = false
            //     }
            // }

            if (this.status == 'new') {
                this.showSkeletonApiTable = false;
            }

            this.showSkeletonText = false;
        })
        
        // console.log(this.methodServices.selectedTemp)
        

        
        //FORCE INSERT DATATABLE FOR STRETCHING WIDTH OF TABLE
        this.methodServices.filterTemp.subscribe((result)=>{
            setTimeout(()=>{
              this.temp = [];
              this.temp = this.methodServices.filterTempObject.filter((result)=>{
                  return result.recordStatus != 'DELETE'
              })
            },150)
          })

        // setTimeout(()=>{
        //     this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
        // },950)
        
        // setTimeout(()=>{
        //     let selectrEle:any = document.getElementById('selectrEleClassification')
        //     let options = {searchable:true}
        //     let selectrEleConv = new Selectr(selectrEle,options)

            // this.modelElementClassification = 13
            // alert(this.methodServices.selectedTemp[0].recurring)
            // this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId 
        // },1000)
        
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
                                type:result[key][i].type == 1 ? "Add" : "Substract",
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
            // console.log('Header')
            // console.log(this.rowsHeader)
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
                    if (key == 'payElementTypes'){
                        resultLooping['payElementClassificationsId'] = result[key].payElementClassifications.id
                        resultLooping['payElementClassificationsName'] = result[key].payElementClassifications.name
                    }
                    if (key == 'effectiveDate'){
                        let effDateTemp = new Date(result.effectiveDate)
                        let effDateTempStr = new DatePipe('en-us').transform(effDateTemp,'dd-MMM-yyyy')
                        resultLooping['effectiveDate'] = effDateTempStr
                    }
                    if (key == 'companyId'){
                        resultLooping['companyId'] = result.companyId
                    }
                    if (key == 'active'){
                        resultLooping['active'] = result.active
                        resultLooping['activeRev'] = result.active == true ? 'Yes' : 'No'
                    }
                }
            }
                // setTimeout(()=>{
                    this.temp = [...this.rows]
                    this.showSkeletonApiTable = false;
                // },100)
            },idBalanceFeed);
        })
        
        
        this.methodServices.filterTempObject = [...this.rows]
        // console.log('New Balance Feed')
        // console.log(this.temp)
    }

    

    onActivate(event){
        this.activeRow = event.row
    }

    onSelect({selected}) {
        // console.log('selected\n')
        // console.log(selected)
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

     updateItem(){
        let newElementIdShow = this.modelElementNameShowRev
        
        let newTypeShow = this.modelTypeShowRev
        if (newTypeShow == null){
            newTypeShow = ''
        }
        let newEffectiveDateShowConv = new Date(this.modelEffectiveDateShowCheck)
        let newEffectiveDateShowConvStr = new DatePipe('en-us').transform(newEffectiveDateShowConv,'dd-MMM-yyyy')
        let newEffectiveDateShow = newEffectiveDateShowConvStr
        
        let newActiveShow = this.modelActiveShow
         let validDate = this.diffrentDate.notAllowFucture(this.modelEffectiveDateShowCheck, this.as_of_date) // return true or false
         let isValid = true

         if (validDate) {
             this.alert_error_modal_msg = "Effective Date must be less than or equal to as of date"
             isValid = false
         }

         if (this.modelEffectiveDateShowCheck == "Invalid Date") {
             this.alert_error_modal_msg = "Effective Date must DD-MMM-YYY e.g. 01-Jan-2020"
             isValid = false
         }

        let modelEffectiveDateTopConv = new Date(this.modelEffectiveDateTop)
        let modelEffectiveDateTopConvStr = new DatePipe('en-us').transform(modelEffectiveDateTopConv,'dd-MMM-yyyy')
        
        //ELEMENT ID MAY NOT BE SAME IF CREATE ELEMENT NEW
        if (this.statusCreateElement == true){
            let findElementId = this.rows.find((result)=>{
                return result.payElementTypesId == newElementIdShow
            })
            if (findElementId){
                let findElementNameTemp:any;
                let findElementName = this.rowsShow.find((result)=>{
                    return result.id == findElementId.payElementTypesId
                })
                if (findElementName){
                    findElementNameTemp = findElementName.name
                }
                
                this.showError('Element ' + findElementNameTemp + ' already exists !')
                return 
            }
        }


        //PROTECT EFFECTIVE DATE MAY NOT GREATER THAN ON TOP
        if (newEffectiveDateShowConv > this.modelEffectiveDateTop){
            this.showError('Effective Date Can\'t more than As of Date ! ')
            return
        }
        // else 
        //     if (this.selected.length > 0){
        //         if (newEffectiveDateShowConvStr != this.selected[0].effectiveDate){
        //             this.statusDetailBaru = true
        //         }
        //     }

        let nameElementFilter = []
         if (isValid) {
            //rowsShow => Element
            nameElementFilter = this.rowsShow.filter(result=>{
                if (result.id == newElementIdShow){
                    return true
                }
            })
            // console.log('nameElementFilter => ', nameElementFilter)
            // console.log('newTypeShow => ', newTypeShow)

            if (this.statusDetailBaru == false){
                let posisiIndex = this.selected[0].index
                this.rows[posisiIndex].payElementTypesId = Number(newElementIdShow)
                this.rows[posisiIndex].elementName = nameElementFilter[0].text
                this.rows[posisiIndex].payElementClassificationsName = this.elementTypesDetailClassName
                this.rows[posisiIndex].type = newTypeShow
                this.rows[posisiIndex].effectiveDate = newEffectiveDateShow
                this.rows[posisiIndex].active = this.modelActiveShow
                this.rows[posisiIndex].activeRev = this.modelActiveShow == true ? 'Yes' : 'No'
                this.rows[posisiIndex].index = posisiIndex
                this.rows[posisiIndex].companyId = this.loginCompanyId
                this.rows[posisiIndex].recordStatus = 'CHANGE'
            }
            else{
                this.table.sorts = []
                let newItem = {
                    active:this.modelActiveShow,
                    activeRev:this.modelActiveShow == true ? 'Yes' : 'No',
                    companyId:this.loginCompanyId,
                    effectiveDate:newEffectiveDateShow,
                    elementName:nameElementFilter[0].text,
                    payElementClassificationsName:this.elementTypesDetailClassName,
                    index:this.rows.length,
                    payElementTypesId:Number(newElementIdShow),
                    recordStatus:'CHANGE',
                    type:newTypeShow
                }
                this.rows.push(newItem)
            }
            this.statusChange = true
            
            this.table.sorts = []
            let idx:number=0;
            if (typeof(this.modelFilter) != 'undefined'){
                this.temp = this.rows.filter((d)=>{
                    d['index'] = idx++;
                    for (var key in d){
                        if (d[key].toString().toLowerCase().indexOf(this.modelFilter) != -1 &&
                            key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
                            return true
                        }
                    }
                    return false
                })
            }
            else{
                this.temp = this.rows.filter((result)=>{
                    result['index'] = idx++;
                    return result.recordStatus != 'DELETE'
                })
            }

            setTimeout(()=>{
                this.temp = [...this.temp]
            },100)
            // this.temp = [...this.rows]

            // console.log('After Update \n')
            // console.log(this.temp)
            this.methodServices.filterTempObject = [...this.temp]
            this.defaultModal.hide()
        }
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
                    this.modelElementNameShowRev = this.payElementTypesIdShow
                    this.modelTypeShow = this.typeShow
                    this.modelTypeShowRev = this.typeShow == 1 ? "Add" : "Substract"

                    this.elementTypesDetailClassId = result.payElementTypes.payElementClassifications.id
                    this.elementTypesDetailClassName = result.payElementTypes.payElementClassifications.name

                    let effectiveDateConv = new Date(this.effectiveDateShow)
                    this.modelEffectiveDateShow = effectiveDateConv
                    this.modelEffectiveDateShowCheck = effectiveDateConv


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
                            let effDateTemp = new Date(this.selected[0].effectiveDate)
                            let effDateTempStr = new DatePipe('en-us').transform(effDateTemp,'dd-MMM-yyyy')
                            this.modelEffectiveDateShow = effDateTemp 
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
                                            text:elementName,
                                            reportingName:elementReportingName
                                        })
                        }
                        console.log('Element List')
                        console.log(this.rowsShow)
                        this.rowsShowSelect2 = [...this.rowsShow]
                    }
                }   
            }
            callback()
            }
        );
 }

    submitProc(){
        this.modelName = this.name.nativeElement.value
        this.modelReportingName = this.reportingName.nativeElement.value
        // console.log(this.modelName, this.modelReportingName)
        // return
        this.alert_success_msg = '';
        
        // window.scrollTo(0,0)
        
        if (typeof(this.modelName) == 'undefined' || this.modelName == ''){
            this.alert_error_msg = 'Name can\'t be Blank !'
            this.showError(this.alert_error_msg)
        }
        else
        if (typeof(this.modelReportingName) == 'undefined' || this.modelReportingName == ''){
            this.alert_error_msg = 'Reporting Name can\'t be Blank !'
            this.showError(this.alert_error_msg)
        }

        //Proteksi tidak boleh ada element yang sama kalau create


        // else
        // if (this.modelPriorityEnd <= this.modelPriorityStart){
        //     this.alert_error_msg = 'Priority End must be greater than Priority Start !'
        // }
        else
        {
            this.alert_error_msg = ''            
            // postData(dataObj,urlapi,callback)
            
            var dataObj = {}

            if (this.id != null && this.id != '')
            {    
                dataObj["id"] = Number(this.id)
                // dataObj = {
                //     "id":Number(this.id),
                //     "name":this.modelName
                // }
            }
            dataObj["name"] = this.modelName
            dataObj["reportingName"] = this.modelReportingName
            dataObj["active"] = Boolean(this.modelActiveStatus)
            dataObj["companyId"] = Number(this.loginCompanyId)
            dataObj["recordStatus"] = 'CHANGE'
            dataObj["payBalanceFeedsList"] = []
            
            if (this.rows.length > 0){
                let effectiveDateDetailConv:any;
                let effectiveDateDetailConvStr:any;
                this.rows.forEach((item,index)=>{
                    if (typeof(item.effectiveDate)!='undefined'){
                        effectiveDateDetailConv = new Date(item.effectiveDate)
                        effectiveDateDetailConvStr = new DatePipe('en-us').transform(effectiveDateDetailConv,'yyyy-MM-dd')
                    }
                    if (typeof(item.id) != 'undefined'){
                        dataObj["payBalanceFeedsList"].push({
                            "id":item.id,
                            "payElementTypesId":item.payElementTypesId,
                            "type":item.type == "Add" ? 1 : -1,
                            "effectiveDate":effectiveDateDetailConvStr,
                            "active":item.active,
                            "companyId":item.companyId,
                            "recordStatus":item.recordStatus
                        })
                    }
                    else{
                        dataObj["payBalanceFeedsList"].push({
                            "payElementTypesId":item.payElementTypesId,
                            "type":item.type == "Add" ? 1 : -1,
                            "effectiveDate":effectiveDateDetailConvStr,
                            "active":item.active,
                            "companyId":item.companyId,
                            "recordStatus":item.recordStatus
                        })
                    }
                })
                
                // dataObj["payBalanceFeedsList"].push(...this.rows)
                // for (let i=0;i<dataObj["payBalanceFeedsList"].length;i++){
                //     delete dataObj["payBalanceFeedsList"][i].elementName
                //     delete dataObj["payBalanceFeedsList"][i].index
                // }
            }

            console.log('Saving !')
            console.log(dataObj)
            
            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/paybalancetypes',
                (err,success)=>{                    
                    if (err != ''){
                        // this.alert_error_msg = err`
                        this.showToast(err, 'error')
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


    openDefaultModal(modalDefault: TemplateRef<any>) {
        this.defaultModal = this.modalService.show(modalDefault, this.default);
    }

    ngOnDestroy(){
        this.methodServices.aktif_table.next(false)
        this.hiddenModal.next(true)
    }

    ngAfterContentChecked(){

    }

    entriesChange($event){
        this.entries = Number($event.target.value);
      }
    
    deleteShow(index,modalTemp:TemplateRef<any>){
        this.textModalSelect = this.temp[index].elementName
        this.indexModalSelect = this.temp[index].index
        // this.defaultModalDelete = this.modalService.show(modalTemp,this.defaultDelete)
        this.deleteItem()
    }

    deleteItem(){
        this.statusChange = true
        if (typeof(this.rows[this.indexModalSelect].id) != 'undefined'){
            this.rows[this.indexModalSelect].recordStatus = 'DELETE'
        }
        else{
            //RESET ARRAY FROM INSERT DATA AND ADJUST INDEX ON THIS.ROWS
            this.rows.splice(this.indexModalSelect,1)

            let tempArr = []
            tempArr = this.rows.filter((result)=>{
                return typeof(result.id) == 'undefined'
            })
            this.rows = this.rows.filter((result)=>{
                return typeof(result.id) != 'undefined'
            })

            let rowsLength:number;
            rowsLength = this.rows.length;

            tempArr.forEach((result)=>{
                result.index = rowsLength
                rowsLength += 1
            })
            
            this.rows.push(...tempArr)

            console.log('temp Arr Delete Index')
            console.log(tempArr)        
        }
        
        if (this.defaultModalDelete){
            this.defaultModalDelete.hide()
        }

        let idx:number=0;
        this.table.sorts = []
        this.temp = this.rows.filter((result)=>{
            result['index'] = idx++;
            return result.recordStatus != 'DELETE'
        })

        setTimeout(()=>{
            this.temp = [...this.temp]
        },150)

        console.log('Delete')
        console.log(this.rows)
        this.methodServices.filterTempObject = [...this.rows]
        // console.log('Delete item')
        // console.log(this.rows)
        // console.log(this.temp)
    }

    editShow(index,modalTemp:TemplateRef<any>){
        this.statusDetailBaru = false
        this.textModalSelect = this.temp[index].elementName
        this.indexModalSelect = this.temp[index].index
        this.alert_error_modal_msg = ""
        this.statusCreateElement = false

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
            this.disabledButton = false
            this.modelEffectiveDateShowCheck = dateStr
            // alert(this.modelEffectiveDateCheck)
        }
    }

    parsingNewItemPrior(callback){
            
        
        callback()
    }

    cancelBack(){
        this.cancelBackStatus = true
        this.router.navigate(['/payroll/balance'])
        this.methodServices.aktif_table.next(true)
    }

    createElement(){
        this.statusDetailBaru = true       
        this.modelElementNameShow = null
        this.disabledButton = true
        this.modelTypeShow = null
        let today = new Date()
        let todayStr = new DatePipe('en-us').transform(today,'dd-MMM-yyyy')
        this.modelEffectiveDateShow = today
        this.modelActiveShow = true

        this.getElementTypesLocal(()=>{
            this.statusCreateElement = true
            this.openDefaultModal(this.modalDefaultRev)
            // setTimeout(()=>{
            //     let selectrType:any = document.getElementById('selectrTypeShow')
            //     let selectrOptions = {searchable:true}
            //     let selectrRes = new Selectr(selectrType,selectrOptions)

            //     let selectrElement:any = document.getElementById('selectrElementShow')
            //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
            // },100)
        })
    }

    changeStatus(type,value){
        if (typeof(type) != "undefined" && typeof(value) != "undefined") {
            switch (type) {
                case 'elementName':
                    this.modelElementNameShowRev = value
                    this.params = 'id=' + value
                    this.methodServices.getUrlApi('/api/admin/payelementtypes/detail',
                    localStorage.getItem(this.methodServices.seasonKey),
                    (result)=>{
                    if (typeof(result) == 'object')
                    {
                        this.elementTypesDetailClassId = result.payElementClassifications.id
                        this.elementTypesDetailClassName = result.payElementClassifications.name
                    }
                    },this.params)
                    this.disabledButton = false
                    break;
                case 'typeShow':
                    this.arrTypeShow.find(element => {
                        if (element.id == value) {
                            this.modelTypeShowRev = element.id
                        }
                    })
                    this.disabledButton = false
                    break;
                default:
                    break;
            }
        } else {
            this.disabledButton = true
        }
        
        // if (event.target.value != null){
        //     this.params = 'id=' + this.modelElementNameShow
        //     this.methodServices.getUrlApi('/api/admin/payelementtypes/detail',
        //     localStorage.getItem(this.methodServices.seasonKey),
        //     (result)=>{
        //     if (typeof(result) == 'object')
        //     {
        //         this.elementTypesDetailClassId = result.payElementClassifications.id
        //         this.elementTypesDetailClassName = result.payElementClassifications.name
        //     }
        //     },this.params)
        //     this.disabledButton = false
        // }
        // else{
        //     this.disabledButton = true
        // }
    }

    deleteItemId(){
        // this.defaultModalDeleteId = this.modalService.show(this.modalDeleteIdRev,this.defaultDelete)
        this.swalDelete()        
        // swal.fire({
        //     title: 'Are you sure?',
        //     text: "You won't be able to revert this!",
        //     type: 'warning',
        //     showCancelButton: true,
        //     buttonsStyling: false,
        //     confirmButtonClass: 'btn btn-danger',
        //     confirmButtonText: 'Yes, delete it',
        //     cancelButtonClass: 'btn btn-secondary'
        // }).then((result) => {
        //     if (result.value) {
        //         this.deleteItemIdYes();
        //     }
        // })
        // this.defaultModalDeleteId = this.modalService.show(this.modalDeleteIdRev,this.defaultDelete)
    }
    
    deleteItemIdYes(){
        var dataObj = {}

        // window.scrollTo(0,0)

        if (this.id != null && this.id != '')
        {    
            dataObj["id"] = Number(this.id)
        }
        
        if (this.defaultModalDeleteId){
            this.defaultModalDeleteId.hide()
        }

        this.methodServices.postData(dataObj,
            localStorage.getItem(this.methodServices.seasonKey),
            '/api/admin/paybalancetypes/delete',
            (err,success)=>{
                if (err != ''){
                    // this.alert_error_msg = err
                    // this.showError(err)
                    // swal.fire({
                    //     title:'Delete Fail',
                    //     type:'error',
                    //     text:err,
                    //     allowOutsideClick:false,
                    //     showConfirmButton:true
                    // })
                    this.showToast(err,'error')
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
                    // this.alert_success_msg = success
                    // // this.showSuccess(success)
                    // swal.fire({
                    //     title:'Success',
                    //     type:'success',
                    //     text:success,
                    //     allowOutsideClick:false,
                    //     showConfirmButton:true
                    // }).then((result)=>{
                    //     if (result.value){
                    //         this.cancelBackStatus = true
                    //         this.router.navigate(['payroll','balance'])
                    //         this.methodServices.aktif_table.next(true)
                    //     }
                    // })
                    this.showToast(success, 'success')
                    this.cancelBackStatus = true
                    this.router.navigate(['payroll','balance'])
                    this.methodServices.aktif_table.next(true)
                    // this.showToast(success,"success")
                    // setTimeout(()=>{
                    //     this.cancelBackStatus = true
                    //     this.router.navigate(['payroll','balance'])
                    //     this.methodServices.aktif_table.next(true)
                    // },1000)
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
    
    showError(content){
        this.toastr.show(            
            `<span class='alert-icon ni ni-bell-55' data-notify='icon'></span>
            <div class = 'alert-text'>
                <span class = 'alert-title' data-notify='title'>Error</span>
                <span data-notify='message'>` + content + `</span>
            </div>`,
            "",
            {
                timeOut:5000,
                enableHtml:true,
                closeButton:true,
                tapToDismiss:false,
                progressBar:false,
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
                <span class = 'alert-title' data-notify='title'>Success</span>
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

    swalDelete(msg?){
        swal.fire({
            title:"Are you sure?",
            text:"You won't be able to revert this!",
            type:"warning",
            showCancelButton:true,
            allowOutsideClick:false,
            buttonsStyling:false,
            allowEscapeKey:true,
            confirmButtonClass:'btn btn-danger',
            confirmButtonText:'Yes, delete it',
            confirmButtonColor:'red',
            cancelButtonClass:'btn btn-secondary',
            cancelButtonText:'Cancel',
            cancelButtonColor:'gray',
            showLoaderOnConfirm:true
        }).then((result)=>{
            if (result.value){
                this.deleteItemIdYes()
                // swal.fire({
                //     title:'Success Delete',
                //     type:'success',
                //     text:msg,
                //     allowOutsideClick:false,
                //     showConfirmButton:true
                // })
            }
            // else if(result.dismiss){
            //     swal.fire({
            //         title:'Delete Fail',
            //         type:'error',
            //         text:msg,
            //         allowOutsideClick:false,
            //         showConfirmButton:true
            //     })
            // }
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

    changeProd(){
        this.statusChange = true
    }

    // this.defaultModal.hide()
    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }
}