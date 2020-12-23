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
    TemplateRef,
    HostListener,
    ElementRef
} from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import * as CryptoJS from 'crypto-js'
import { HttpClient } from '@angular/common/http';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from "ngx-toastr";
import {Subject} from "rxjs";
import {environment} from "../../../../environments/environment";
import { DataTablePagerComponent } from "@swimlane/ngx-datatable";
import { AlternativeComponent } from '../../dashboards/alternative/alternative.component';
import { diffrentDate } from "../../../validation-global/diffrent-date";
import swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import {type} from "os";


@Component({
    selector:"payroll-runtype-form",
    templateUrl:"payroll-runtype-form.component.html",
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

export class PayrollRuntypeFormComponent implements OnInit, AfterViewInit {

    @HostListener('window:beforeunload',['$event'])
    canDeactivate(event:BeforeUnloadEvent):void{
        event.returnValue = true
    }

    @ViewChild('f') f:NgForm;
    @ViewChild('modalDeleteId') modalDeleteIdRev:TemplateRef<any>
    @ViewChild('modalDefault') modalDefault:TemplateRef<any>
    @ViewChild('tableRuntypeDetail') table;

    @ViewChild('name') name:ElementRef;
    @ViewChild('description') description:ElementRef;

    @Output() aktifTableTemp = new EventEmitter<boolean>();
    url:string;
    urlEnd:string;
    urlEndParse:string;
    
    showSkeletonText:boolean = true;
    showSkeletonApiTable:boolean = true;

    bsValue = new Date()

    aktif_table:boolean = true;
    statusDetailBaru:boolean = false;
    disabledButton:boolean = true;
    modelActiveShow:boolean;
    alert_error_modal_msg:string = '';
    modelElementNameShow:number;
    modelElementNameShowRev:number;
    modelPayElementDetailIdShow:number;
    indexModalSelect:any;
    class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';


    employeeNoSelect:string;

    ColumnMode = ColumnMode;
    SelectionType = SelectionType;

    defaultModalDelete:BsModalRef;
    defaultModalDeleteId:BsModalRef;


    defaultModal: BsModalRef;
    configModal = {
        keyboard: true,
        class: "modal-dialog-centered",
        ignoreBackdropClick:true
    };

    defaultDelete = {
        keyboard:true,
        class:'modal-dialog-centered modal-danger',
        ignoreBackdropClick:true
    }

    hiddenModal = new Subject<boolean>()

    cancelBackStatus:boolean = false;
    statusChange:boolean = false;

    canLeave():boolean{
        let aktif:boolean;
        if (this.cancelBackStatus === false){
            if (this.statusChange == true){
                aktif = window.confirm('WARNING: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.')
                if (aktif === false){
                    this.methodServices.aktif_table.next(true)
                }
            }
            else{
                aktif = true
            }
            if(aktif === true){
                this.hiddenModal.next(true)
            }
        }
        else{
            aktif = true
        }

        return aktif
    }

    page = new DataTablePagerComponent();
    constructor(
        private location:Location,
        private methodServices:MethodServices,
        private activatedRoute:ActivatedRoute,
        private router:Router,
        private http:HttpClient,
        private modalService:BsModalService,
        private toastr:ToastrService,
        private diffrentDate:diffrentDate
    ){
        this.temp = this.rows.map((prop,key)=>{
            return {
                ...prop,
                id: key
            };
        });
    }

    params:string;

    textModalSelect:string;
    dataModalSelect:any;

    entries: number = 10;
    selected: any[] = [];
    temp = [];
    tempElementList = [];
    activeRow: any;
    rows: any = [];
    rowsElementList: any = [];
    rowsElementListSelect2: Array<Select2OptionData> = [];


    id:any;
    idxDetailRunType:number

    religionFinal = [];
    genderFinal = [];

    as_of_date = new Date()
    modelEffectiveDate:string;
    modelActiveStatus:boolean=true;
    modelName:string;
    modelDescription:string;
    modelElementName:string;
    modelEffectiveDateShow:any
    modelEffectiveDateShowCheck:any
    modelFilter:string;

    readOnlyInput:boolean = false;
    readOnlyInputSelect:boolean = false;

    aktif_error:boolean = false;
    disabledSubmit:boolean = false;

    alert_error_msg:string = '';
    alert_success_msg:string = '';

    loginCompanyId:any;
    status = '';
    tempSelectedElement = [];
    runTypeDetailData = [];
    elementListData = [];


    ngOnInit(){
        // let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'yyyy-MM-dd')
        // this.modelEffectiveDate = formatedDate;

        //GET USER LOGIN => COMPANYID
        if (localStorage.getItem('company') != null){
            let decryptCompany = CryptoJS.AES.decrypt(localStorage.getItem('company'),environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.loginCompanyId = Number(decryptCompany)
        }

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

        this.methodServices.aktif_table.subscribe(result=>{

            this.aktif_table = result
            setTimeout(()=>{
                this.temp = [...this.rows];
            },800)
        })

        this.activatedRoute.params.subscribe(result => {
            var url = this.location.prepareExternalUrl(this.location.path())
            var urlEnd = url.lastIndexOf("/") + 1
            this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()

            this.urlEndParse = this.urlEndParse.replace('-',' ')

            //No Get QUery Params
            var urlQuestion = this.urlEndParse.indexOf("?")
            if (urlQuestion != -1){
                var urlFinal = this.urlEndParse.slice(0,urlQuestion)
                this.urlEndParse = urlFinal
            }
        })

        this.activatedRoute.queryParams.subscribe(result=>{
            if (typeof(result.id) != 'undefined'){
                this.id = Number(this.methodServices.decryptOnline(result.id))
                // alert(typeof(this.id))
                // this.createDetail = true   //BUTTON CREATE DETAIL
            }

            if (typeof(result.status) != 'undefined'){      //STATUS = NEW
                let decrypt_status = this.methodServices.decryptOnline(result.status)
                this.status = decrypt_status
                // this.createDetail = true   //BUTTON CREATE DETAIL
            }

            if(typeof(result.runTypeName) != 'undefined') {
                this.modelName = this.methodServices.decryptOnline(result.runTypeName)
            }

            if(typeof(result.description) != 'undefined'){
                this.modelDescription = this.methodServices.decryptOnline(result.description)
            }

            if(typeof(result.active) != 'undefined'){
                let activeSign = this.methodServices.decryptOnline(result.active)
                this.modelActiveStatus = activeSign == 'true' ? true : false
            }

            // if (typeof(result.status) != 'undefined'){
            //     if (result.status == 'new'){
            //         this.disabledSubmit = false
            //     }
            // }

            if (this.urlEndParse != 'RUNTYPE FORM'){
                this.aktif_table = true
            }

            if (this.status == 'new') {
                this.showSkeletonApiTable = false;
            }

            this.showSkeletonText = false;
        })

        if(this.status !== 'new'){
            this.params = 'id=' + this.id
            this.methodServices.getUrlApi('/api/admin/payruntypes/detail',
                localStorage.getItem(this.methodServices.seasonKey),
                (result) => {
                    if (typeof(result) !== "undefined") {
                        if (typeof(result.payRunTypeDetails) !== "undefined") {
                            for (let key in result.payRunTypeDetails) {
                                this.rows.push({
                                    id:result.payRunTypeDetails[key].id,
                                    payElementTypesId:result.payRunTypeDetails[key].payElementTypes.id,
                                    payElementName:result.payRunTypeDetails[key].payElementTypes.name,
                                    payDescription:result.payRunTypeDetails[key].payElementTypes.description,
                                    payClassificationName:result.payRunTypeDetails[key].payElementTypes.elementClassificationName,
                                    effectiveDate:result.payRunTypeDetails[key].effectiveDate,
                                    companyId:result.payRunTypeDetails[key].companyId,
                                    active:result.payRunTypeDetails[key].active,
                                    recordStatus:''
                                })
                            }
                        }
                        this.temp = this.rows;
                        this.methodServices.filterTempObject = [...this.rows]
                        this.showSkeletonApiTable = false;
                    }
            }
            , this.params)
        }

        if (this.urlEndParse != 'RUNTYPE FORM')
            this.aktif_table = false
        else
            this.aktif_table = true

        this.methodServices.filterTemp.subscribe((result)=>{
        setTimeout(()=>{
            this.temp = [];
            this.temp = this.methodServices.filterTempObject.filter((result)=>{
                return result.recordStatus != 'DELETE'
            })
            // this.temp = [...this.methodServices.filterTempObject];
        },150)
        })
    }

    //GET ALL DATA TO DATATABLE
    // elementClassLoad(callback) {
    //     this.rows = [];
    //     this.temp = [];
    //     this.rowsElementList = [];
    //     this.tempElementList = [];
    //
    //
    //     this.temp = this.rows;
    //     callback();
    // }

    elementDetailLoad(callback) {
        this.methodServices.getUrlApi('/api/admin/payelementtypes?page=0&size=100',
            localStorage.getItem(this.methodServices.seasonKey),
            (result) => {
                if (typeof(result) == 'object') {
                    this.rowsElementList = []
                    for (let key in result) {
                        if (key == "content") {
                            for (let i = 0; i < result[key].length; i++) {
                                this.rowsElementList.push({
                                    id: result[key][i].id,
                                    text: result[key][i].name,
                                    effectiveDate:result[key][i].effectiveDate,
                                    companyId:result[key][i].companyId,
                                    payDescription:result[key][i].description,
                                    payClassificationName:result[key][i].payElementClassifications.name,
                                    active:result[key][i].active
                                })
                            }
                            this.rowsElementListSelect2 = [...this.rowsElementList]
                        }
                    }
                }
                callback()
            })
        this.tempElementList = this.rowsElementList;
        this.methodServices.filterTempObject = [...this.rowsElementList]
    }

    entriesChange($event){
        this.entries = Number($event.target.value);
    }
    filterTable($event) {
        let val = $event.target.value;
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

    deleteShow(idx){
        this.textModalSelect = this.temp[idx].payElementName
        this.dataModalSelect = this.temp[idx]
        this.deleteData()
        // this.defaultModalDelete = this.modalService.show(modalTemp,this.defaultDelete)
    }


    //DELETE ROW IN DATATABLE
    deleteData() {
        if(typeof(this.dataModalSelect) !== "undefined") {
            let idxTemp = this.temp.indexOf(this.dataModalSelect);
            let idxRow = this.rows.indexOf(this.dataModalSelect);
            if (typeof(idxTemp) != "undefined" && typeof(idxRow) != "undefined") {
                // if (this.rows[idxRow].idRunTypeDetail != 0) //revisi
                if (typeof(this.rows[idxRow].id) != "undefined") {
                    this.rows[idxRow].recordStatus = 'DELETE';
                } else {
                    this.rows.splice(idxRow, 1);
                }
                this.statusChange = true

                console.log(this.rows[idxRow])
                this.temp[idxTemp].recordStatus = 'DELETE';
                this.temp = this.dataRemove(this.temp, "DELETE")
                this.methodServices.filterTempObject = [...this.rows]
            }
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
            this.methodServices.postData({
                    id: this.id
                },
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payruntypes/delete',
                (err,success)=>{
                    if (err != ''){
                        this.showToast(err, 'error')
                        // swal.fire({
                        //     title: 'Warning!',
                        //     text: err,
                        //     type: 'error',
                        //     buttonsStyling: false,
                        //     confirmButtonClass: 'btn btn-primary'
                        // });
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.toastr.show(
                            '<span class="alert-icon ni ni-bell-55" data-notify="icon"></span>' +
                            ' <div class="alert-text"</div> ' +
                            '<span class="alert-title" data-notify="title">Success</span> ' +
                            '<span data-notify="message">'+success+'</span></div>',
                            '',
                            {
                                timeOut: 8000,
                                closeButton: true,
                                enableHtml: true,
                                tapToDismiss: false,
                                titleClass: 'alert-title',
                                positionClass: 'toast-top-center',
                                toastClass: "ngx-toastr alert alert-dismissible alert-success alert-notify",
                            }
                        );
                        this.cancelBackStatus = true
                        this.router.navigate(['payroll','runtype'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
    }


    createElement(){
        this.statusDetailBaru = true
        this.modelElementNameShow = null
        this.disabledButton = true
        let today = new Date()
        this.modelEffectiveDateShow = today
        this.modelActiveShow = true

        this.elementDetailLoad(()=>{
            this.openDefaultModal(this.modalDefault)
            // setTimeout(()=>{
            //     let selectrOptions = {searchable:true}
            //     let selectrElement:any = document.getElementById('selectrElementShow')
            //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
            // },100)
        })
    }

    editShow(index,modalTemp:TemplateRef<any>){
        this.statusDetailBaru = false
        this.textModalSelect = this.temp[index].elementName
        this.indexModalSelect = this.temp[index].index
        this.alert_error_modal_msg = ""

        if (typeof(this.temp[index].id) != 'undefined'){
            this.idxDetailRunType = index
            this.modelPayElementDetailIdShow = this.temp[index].id
            this.modelElementNameShow = this.temp[index].payElementTypesId
            this.modelElementNameShowRev = this.temp[index].payElementTypesId
            this.modelActiveShow = this.temp[index].active
            this.modelEffectiveDateShow = new Date(this.temp[index].effectiveDate)
            // let elementName = this.selected[0].payElementName


            this.elementDetailLoad(()=>{
                this.openDefaultModal(this.modalDefault)
                // setTimeout(()=>{
                //     let selectrOptions = {searchable:true}
                //     let selectrElement:any = document.getElementById('selectrElementShow')
                //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
                // },100)
            })
            // this.defaultModal = this.modalService.show(modalTemp,this.default)
        }
        else{
            let tempArr = [];
            // console.log('selected baru')

            this.selected.push(this.temp[index])
            tempArr.push(this.temp[index])
            console.log('tempArr')
            console.log(tempArr)

            if(typeof(tempArr[0].payElementTypesId) != 'undefined')
            {
                this.modelElementNameShow = tempArr[0].payElementTypesId
            }

            if(typeof(tempArr[0].active) != 'undefined')
            {
                this.modelActiveShow = tempArr[0].active
            }
            if(typeof(tempArr[0].effectiveDate) != 'undefined')
            {
                this.modelEffectiveDateShow = tempArr[0].effectiveDate
            }
            this.idxDetailRunType = index

            this.elementDetailLoad(()=>{
                this.openDefaultModal(this.modalDefault)
                // setTimeout(()=>{
                //     let selectrOptions = {searchable:true}
                //     let selectrElement:any = document.getElementById('selectrElementShow')
                //     let selectrResElement = new Selectr(selectrElement,selectrOptions)
                // },100)
            })
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

    changeStatus(value){
        if (value != null){
            this.modelElementNameShowRev = value
            this.disabledButton = false
        }
        else{
            this.disabledButton = true
        }
    }

    //ADD DATA TO ROW DATATABLE
    updateItem(){
        let newElementIdShow = this.modelElementNameShowRev
        let newEffectiveDateShow = this.modelEffectiveDateShowCheck
        let newActiveShow = this.modelActiveShow

        let nameElementFilter = []
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

        if (isValid) {
            //rowsShow => Element
            nameElementFilter = this.rowsElementList.filter(result=>{
                if (result.id == newElementIdShow){
                    return true
                }
            })
            // console.log('nameElementFilter => ', nameElementFilter)
            if (this.statusDetailBaru == false){
                let posisiIndex = this.idxDetailRunType
                this.rows[posisiIndex].payElementTypesId = Number(newElementIdShow)
                this.rows[posisiIndex].id = Number(this.modelPayElementDetailIdShow)
                this.rows[posisiIndex].payElementName = nameElementFilter[0].text
                this.rows[posisiIndex].effectiveDate = new DatePipe('en-US').transform(newEffectiveDateShow,'yyyy-MM-dd')
                this.rows[posisiIndex].active = this.modelActiveShow
                this.rows[posisiIndex].index = posisiIndex
                this.rows[posisiIndex].companyId = this.loginCompanyId
                this.rows[posisiIndex].payClassificationName = nameElementFilter[0].payClassificationName
                this.rows[posisiIndex].payDescription = nameElementFilter[0].payDescription
                this.rows[posisiIndex].recordStatus = 'CHANGE'
            }
            else{
                let newItem = {
                    active:this.modelActiveShow,
                    companyId:this.loginCompanyId,
                    effectiveDate:newEffectiveDateShow,
                    payElementName:nameElementFilter[0].text,
                    index:this.rows.length,
                    payElementTypesId:Number(newElementIdShow),
                    payClassificationName:nameElementFilter[0].payClassificationName,
                    payDescription:nameElementFilter[0].payDescription,
                    recordStatus:'CHANGE',
                }
                this.rows.push(newItem)
            }
            this.statusChange = true
        //
            if (typeof(this.modelFilter) != 'undefined'){
                this.temp = this.rows.filter((d)=>{
                    for (var key in d){
                        if (d[key].toString().toLowerCase().indexOf(this.modelFilter) != -1 &&
                            key != 'recordStatus' && d['recordStatus'] != 'DELETE'){
                            return true
                        }
                    }
                    return false
                })
            } else {
                this.temp = this.rows.filter((result)=>{
                    return result.recordStatus != 'DELETE'
                })
            }

            setTimeout(()=>{
                this.temp = [...this.temp]
            },100)
            // this.temp = [...this.rows]

            console.log('After Update \n')
            console.log(this.temp)
            this.methodServices.filterTempObject = [...this.temp]
            this.defaultModal.hide()
        }
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

    dataRemove(array, rowName) {
        return array.filter(function(element){
            return element.recordStatus != rowName;
        });
    }

    onActivate(event) {
        this.activeRow = event.row;
    }

    openDefaultModal(modalDefault: TemplateRef<any>) {
        this.defaultModal = this.modalService.show(modalDefault, this.configModal);
    }

    cancelForm() {
        setTimeout(()=>{
            this.cancelBackStatus = true
            this.router.navigate(['payroll','runtype'])
            this.methodServices.aktif_table.next(true)
        },1000)
    }

    submitProc(){
        this.modelName = this.name.nativeElement.value
        this.modelDescription = this.description.nativeElement.value
        // console.log(this.modelName, this.modelDescription)
        // return
        this.alert_success_msg = '';
        let tempPost = []

        if (typeof(this.modelName) == "undefined" || this.modelName == ""){
            this.showToast('Name can\'t be Blank !','error')
        } else {
            this.alert_error_msg = ''
            // postData(dataObj,urlapi,callback)

            for (let idx = 0; idx < this.rows.length; idx++) {
                if (typeof(this.rows[idx].id) == 'undefined') {
                    tempPost.push({
                        active:this.rows[idx].active,
                        companyId:this.rows[idx].companyId,
                        effectiveDate:this.rows[idx].effectiveDate,
                        index:this.rows[idx].index,
                        payElementTypesId:this.rows[idx].payElementTypesId,
                        recordStatus:this.rows[idx].recordStatus,
                    });
                } else {
                    tempPost.push({
                        id:this.rows[idx].id,
                        active:this.rows[idx].active,
                        companyId:this.rows[idx].companyId,
                        effectiveDate:this.rows[idx].effectiveDate,
                        index:this.rows[idx].index,
                        payElementTypesId:this.rows[idx].payElementTypesId,
                        recordStatus:this.rows[idx].recordStatus,
                    });
                }
            }


            let dataObj = {
                "id":this.id,
                "name":this.modelName,
                "active":this.modelActiveStatus,
                "description":this.modelDescription == '' ? null : this.modelDescription,
                "companyId":this.loginCompanyId,
                "recordStatus":"CHANGE",
                "payRunTypeDetailsList":tempPost
            }

            if (this.status === "new") {
                // dataObj.active = true
                delete dataObj.id
            }

            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/payruntypes',
                (err,success)=>{
                    if (err != ''){
                        this.showToast(err,'error')
                        console.log("=== ERROR ===")
                        console.log(this.rows)
                    }
                    else
                    if(success != ''){
                        console.log('Success : ' + success)
                        this.showToast(success,'success')
                        this.cancelBackStatus = true
                        this.router.navigate(['payroll','runtype'])
                        this.methodServices.aktif_table.next(true)
                        // this.alert_success_msg = 'Data Saved Successfully ! '
                    }
                }
            )
        }
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

    ngOnDestroy(){
        this.methodServices.aktif_table.next(false)
        this.hiddenModal.next(true)
    }

    ngAfterViewInit(){

        // this.methodServices.selectedTemp[0].elementClassificationId = 13
        // alert(this.methodServices.selectedTemp[0].elementClassificationId)
        // this.modelElementClassification = this.methodServices.selectedTemp[0].elementClassificationId
    }

    changeProc(){
        this.statusChange = true
    }
    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }
}