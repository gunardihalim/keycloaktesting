import {Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter, TemplateRef} from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import {environment} from "../../../../environments/environment";
import * as CryptoJS from 'crypto-js'
import {type} from "os";
import {ToastrService} from "ngx-toastr";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {Subject} from "rxjs";
import { Select2OptionData } from 'ng-select2';
import { element } from 'protractor';

@Component({
    selector:"employee-assignment",
    templateUrl:"employee-assignment.component.html",
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

export class EmployeeAssignmentComponent implements OnInit {

@ViewChild('f') f:NgForm;
@ViewChild('modalEmployee') modalEmployeeRev:TemplateRef<any>
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

showSkeletonText:boolean = true;
showSkeletonApiPosition:boolean = true;
showSkeletonApiGrade:boolean = true;
showSkeletonApiLocation:boolean = true;
showSkeletonApiEmploymentType:boolean = true;
showSkeletonApiPayroll:boolean = true;

bsValue = new Date()

aktif_table:boolean = true;
class_hover:string = 'btn btn-default rounded-circle bg-gradient-lighter text-dark text-lg';

employeeNoSelect:string;

ColumnMode = ColumnMode;
SelectionType = SelectionType;
hiddenModal = new Subject<boolean>()

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
modelAssignment:number;
modelLineManagerName:string;
modelLineManagerId:number;
modelLineManagerCode:string;
photoProfile:any;
modelLocation:any;
modelLocationRev:any;
modelPosition:any;
modelPositionRev: any;
modelGrade:any;
modelGradeRev:any;
modelOrganization:any;
modelJob:any;
modelPrimary:boolean;
modelAssignmentAction:string;
modelAssignmentStatus:string;
modelPeopleGroup:string;
modelPayroll:any;
modelPayrollRev:any;
modelEmploymentType:any;
modelEmploymentTypeRev:any;
public arrEmploymentType:any[] = [
    {id:'Contract', text:'Contract'},
    {id:'Permanent', text:'Permanent'}
];
arrPosition:any[] = [];
arrGrade:any[] = [];
arrPayrollGroup:any[] = [];
arrLocation:any[] = [];
arrEmploymentTypeSelect2:Array<Select2OptionData> = [...this.arrEmploymentType]
arrPositionSelect2:Array<Select2OptionData>;
arrGradeSelect2:Array<Select2OptionData>;
arrPayrollGroupSelect2:Array<Select2OptionData>;
arrLocationSelect2:Array<Select2OptionData>;
cancelStatus:boolean = false
listEmployeeModal: BsModalRef;
configModal = {
    keyboard: true,
    class: "modal-dialog-centered modal-lg",
    ignoreBackdropClick:true,
};

    constructor(private location:Location,
                private methodServices:MethodServices,
                private activatedRoute:ActivatedRoute,
                private toastr:ToastrService,
                private modalService:BsModalService,
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

    aktif_error:boolean = false;

    ngOnInit(){

        let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'yyyy-MM-dd')
        this.modelEffectiveDate = formatedDate;

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
        })

        this.hiddenModal.subscribe(hasil=>{
            if (hasil == true){
                if(this.listEmployeeModal){
                    this.listEmployeeModal.hide()
                }
            }
        })
        
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
        this.activatedRoute.queryParams.subscribe(result=>{
            this.employeeId = this.methodServices.decryptOnline(result.employeeid)
        })
        
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

        this.methodServices.getUrlApi('/api/admin/employee/assignment/summary?employeeid=' + this.employeeId,
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
            if (result == 'Error'){
                this.aktif_error = true;
                this.router.navigate(['/employee/assignment/error'],{queryParamsHandling:'merge'})
                return
            }
            if (typeof(result) == 'object')
            {
                for (let idx in result.activeAssignment) {
                    this.modelLocationRev = result.activeAssignment[idx].location.id;
                    this.modelPositionRev = result.activeAssignment[idx].position.id;
                    this.modelGradeRev = result.activeAssignment[idx].grade.id;
                    this.modelEmploymentTypeRev = result.activeAssignment[idx].employeeStatus;
                    this.modelPayrollRev = result.activeAssignment[idx].payrollGroupId;
                    this.modelAssignment = result.activeAssignment[idx].id;
                    this.modelLineManagerName = result.activeAssignment[idx].lineManager;
                    this.modelLineManagerId = result.activeAssignment[idx].lineManagerEmploymentId;
                    this.modelLineManagerCode = result.activeAssignment[idx].lineManagerNo;
                }
                this.showSkeletonText = false;
                this.showSkeletonApiEmploymentType = false;
            }   
        });
        this.loadDataPosition(() => {
            this.loadDataGrade(() => {
                this.loadDataLocation(() => {
                    this.loadDataGroup()
                })
            })
        })
    }

    loadDataPosition(callback) {
        this.params = 'page=0&size=300';
        this.methodServices.getUrlApi('/api/position/find',
            localStorage.getItem(this.methodServices.seasonKey),
            (result) => {
                if (result == 'Error') {
                    this.aktif_error = true;
                    this.router.navigate(['/employee/assigment/error'], {queryParamsHandling:'merge'})
                    return
                }
                if (typeof(result) == 'object') {
                    for (let key in result) {
                        if (key == "content") {
                            this.arrPosition = []
                            for (let i = 0; i < result[key].length; i++) {
                                this.arrPosition.push({
                                    id: result[key][i].id,
                                    text: result[key][i].name,
                                    organizationId: result[key][i].organization != null ? result[key][i].organization.id : null,
                                    organizationName: result[key][i].organization != null ? result[key][i].organization.name : null,
                                    jobTitleId: result[key][i].jobTitle.id,
                                    jobTitleName: result[key][i].jobTitle.name
                                })
                            }
                        }
                    }
                    this.arrPositionSelect2 = [...this.arrPosition]
                    this.modelPosition = this.modelPositionRev
                    this.showSkeletonApiPosition = false;
                    callback()
                }
            }, this.params)
    }

    loadDataGrade(callback) {
        this.params = 'page=0&size=300';
        this.methodServices.getUrlApi('/api/grade/find',
            this.methodServices.seasonKey,
            (result) => {
                if (typeof(result) == "object") {
                    for (let key in result) {
                        if (key == "content") {
                            this.arrGrade = [];
                            for (let i = 0; i < result[key].length; i++) {
                                this.arrGrade.push({
                                    id: result[key][i].id,
                                    text: result[key][i].name
                                })
                            }
                        }
                    }
                }
                this.arrGradeSelect2 = [...this.arrGrade]
                this.modelGrade = this.modelGradeRev
                this.showSkeletonApiGrade = false;
                callback()
            }, this.params)
    }

    loadDataLocation(callback) {
        this.params = 'page=0&size=300';
        this.methodServices.getUrlApi('/api/worklocation',
            this.methodServices.seasonKey,
            (result) => {
                if (typeof(result) == "object") {
                    for (let key in result) {
                        if (key == "content") {
                            this.arrLocation = [];
                            for (let i = 0; i < result[key].length; i++) {
                                this.arrLocation.push({
                                    id: result[key][i].id,
                                    text: result[key][i].name
                                })
                            }
                        }
                    }
                }
                this.arrLocationSelect2 = [...this.arrLocation]
                this.modelLocation = this.modelLocationRev
                this.showSkeletonApiLocation = false;
                callback()
            }, this.params)
    }

    loadDataGroup() {
        this.params = 'page=0&size=300&isactive=true';
        this.methodServices.getUrlApi('/api/admin/paypayrollgroups',
            this.methodServices.seasonKey,
            (result) => {
                if (typeof(result) == "object") {
                    for (let key in result) {
                        if (key == "content") {
                            this.arrPayrollGroup = [];
                            for (let i = 0; i < result[key].length; i++) {
                                this.arrPayrollGroup.push({
                                    id: result[key][i].id,
                                    text: result[key][i].name
                                })
                            }
                        }
                    }
                }
                this.arrPayrollGroupSelect2 = [...this.arrPayrollGroup]
                this.modelPayroll = this.modelPayrollRev
                this.showSkeletonApiPayroll = false;
            }, this.params)
    }

    openEmployeeList() {
        this.loadDataEmployee(() => {
            this.openEmployeeListModal(this.modalEmployeeRev)
        })
    }

    loadDataEmployee(callback) {
        this.params = 'page=0&size=3000'
        this.methodServices.getUrlApi('/api/employee/find',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
                if (typeof(result) == 'object')
                {
                    // this.totalPage = result['totalPages']
                    // this.totalElement = result['totalElements']
                    for(var key in result){
                        if (key == 'content'){
                            for(var i=0;i<result[key].length;i++){
                                this.rows.push({
                                    employmentId:result[key][i].employmentId,
                                    name:result[key][i].name,
                                    employeeNo:result[key][i].employeeNo})
                            }
                        }
                        // this.temp = [...this.rows]
                    }
                    // setTimeout(()=>{
                    this.temp = [...this.rows];
                    this.methodServices.filterTempObject = [...this.rows]
                    // },800)
                    callback()
                }
            },this.params);
    }

    openEmployeeListModal(modalListEmployee: TemplateRef<any>) {
        this.listEmployeeModal = this.modalService.show(modalListEmployee, this.configModal);
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

    onSelect({selected}) {
        this.selected.splice(0, this.selected.length);
        this.selected.push(...selected);
        this.methodServices.selectedTemp = [];
        this.methodServices.selectedTemp.push(...selected);
    }

    onActivate(event) {
        this.activeRow = event.row
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
        this.methodServices.filterTempObject = [...this.temp]
    }

    updateData() {
        this.modelLineManagerCode = this.selected[0].employeeNo
        this.modelLineManagerId = this.selected[0].employmentId
        this.modelLineManagerName = this.selected[0].name
        this.listEmployeeModal.hide()
    }

    clearData() {
        this.modelLineManagerCode = ""
        this.modelLineManagerId = null
        this.modelLineManagerName = ""
    }

    changeType(type,id){
        switch (type) {
            case 'position':
                let employmentPosition = this.arrPosition.find(element => {
                    if (element.id == id) {
                        this.modelOrganization = element.organizationName
                        this.modelJob = element.jobTitleName
                        this.modelPositionRev = id;
                    }
                })
                break;
            case 'grade':
                this.modelGradeRev = id
                break;
            case 'location':
                this.modelLocationRev = id
                break;
            case 'payroll':
                this.modelPayrollRev = id
                break;
            case 'employeeStatus':
                this.modelEmploymentTypeRev = id
                break;
        }

    }
    submitProc(){
            if (typeof(this.modelPosition) == 'undefined'){
                this.showToast('Element Name can\'t be Blank !','error')
            }
            // else
            // if (this.modelPriorityEnd <= this.modelPriorityStart){
            //     this.alert_error_msg = 'Priority End must be greater than Priority Start !'
        // }
        else
        {
            // this.alert_error_msg = ''
            // postData(dataObj,urlapi,callback)
            let dataObj = {
                "assignmentId":this.modelAssignment,
                "positionId":Number(this.modelPositionRev),
                "gradeId":Number(this.modelGradeRev),
                "locationId":Number(this.modelLocationRev),
                "payrollGroupId":Number(this.modelPayrollRev),
                "employeeStatus":this.modelEmploymentTypeRev,
                "employmentManagerId":this.modelLineManagerId == null ? null : Number(this.modelLineManagerId)
            }
            // console.log('Analyze \n')
            // console.log(dataObj)

            this.methodServices.postData(dataObj,
                localStorage.getItem(this.methodServices.seasonKey),
                '/api/admin/employee/assignment/update',
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



    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

}