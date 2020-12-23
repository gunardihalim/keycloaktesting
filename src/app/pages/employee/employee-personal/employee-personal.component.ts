import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'
import {Location} from '@angular/common'
import {ColumnMode, SelectionType} from '@swimlane/ngx-datatable';
import {MethodServices} from 'src/services/method-services';
import {animate, animateChild, query, state, style, transition, trigger} from '@angular/animations';
import {NgForm} from '@angular/forms';
import {environment} from 'src/environments/environment';
import {catchError, map} from 'rxjs/operators';
import {HttpErrorResponse, HttpEventType} from "@angular/common/http";
import {of} from "rxjs";

@Component({
    selector:"employee-personal",
    templateUrl:"employee-personal.component.html",
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

export class EmployeePersonalComponent implements OnInit {

@ViewChild('f') f:NgForm;
@ViewChild("fileUpload", {static: false}) fileUpload: ElementRef;files  = [];
@Output() aktifTableTemp = new EventEmitter<boolean>();
url:string;
urlEnd:string;
urlEndParse:string;

showSkeletonText:boolean = true;

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
modelPlaceOfBirth:Date;
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
modelNationalId:string;
modelEmployeeTaxNo:string;

aktif_error:boolean = false;

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
    modelEffectiveDate:Date;
    readOnlyInput:boolean = true;
    readOnlyInputSelect:boolean = true;
    
    ngOnInit(){
        // let formatedDate = new DatePipe('en-US').transform(this.as_of_date, 'dd-MM-yyyy')
        // this.modelEffectiveDate = this.as_of_date;

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
        
        // Religion
        // this.params = "page=0&size=3000"
        if (this.religionFinal.length >= 0){
            this.religionFinal.splice(0,this.religionFinal.length)
        }
        setTimeout(()=>{   
            this.religionFinal = [...this.methodServices.arrReligion]
            this.genderFinal = [...this.methodServices.arrGender]
        },1000)

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
        
        this.methodServices.getUrlApi('/api/employee/' + this.employeeId,
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
        if (result == 'Error'){
            this.aktif_error = true
            this.router.navigate(['/employee/personal/error'],{queryParamsHandling:'merge'})
            return
        }

        if (typeof(result) == 'object')
        {
            this.aktif_error = false
            let effectiveDate = new Date(result.employment[0].effectiveDate)
            // this.modelEffectiveDate = new DatePipe('en-us').transform(effectiveDate,'dd-MM-yyyy')
            this.modelEffectiveDate = effectiveDate
            this.modelFirstName = result.firstName;
            this.modelMiddleName = result.middleName;
            this.modelLastName = result.lastName;
            this.modelPlaceOfBirth = result.birthPlace;
            //Date Of Birth
            this.modelDateOfBirth = new Date(result.birthDate) ;
            var dateParse = new Date(this.modelDateOfBirth)
            //----
            //Age
            let today = new Date()
            let ageDiffer = Math.floor(((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
                            -
                            Date.UTC(this.modelDateOfBirth.getFullYear(),this.modelDateOfBirth.getMonth(),this.modelDateOfBirth.getDate())
                            ) / (1000 * 60 * 60 * 24 * 365)))
            this.modelAge = ageDiffer
            this.modelReligion = result.religion;
            this.modelGender = result.gender;
            this.modelMarital = result.maritalStatus;
            this.modelNationality = result.nationality;
            this.modelEmployeeTaxNo = result.npwpNo;
            this.modelFamilyCardNo = result.familyCardNo;
            this.modelNationalId = result.nircNo;
            this.modelNoBpjsTk = result.bpjsTkNo;
            this.modelNoBpjsKesehatan = result.bpjsKesehatanNo;
            this.modelMobilePhone = result.mobilePhone;
            this.modelOtherPhone1 = result.mobilePhone1;
            this.modelOtherPhone2 = result.mobilePhone2;
            this.modelOfficeEmail = result.officeMail;
            this.modelPersonalEmail = result.email;            
            if(result.user.photoProfile != null){
                this.photoProfile = environment.baseUrlImage + result.user.photoProfile;
            }
            this.showSkeletonText = false;
        }
        });
        
        // setTimeout(()=>{
        //     if (this.aktif_error == false){
        //         var selectr:any = document.getElementById('selectr1');
        //         var options = {searchable:true,multiple:false,placeholder:'Pilih..'};
        //         var selectorDefault = new Selectr(selectr,options);
        //
        //         var selectr_gender:any = document.getElementById('gender')
        //         var selectorGender = new Selectr(selectr_gender,options)
        //
        //         var selectr_marital:any = document.getElementById('marital')
        //         var selectorMarital = new Selectr(selectr_marital,options)
        //
        //         if (this.readOnlyInputSelect) {
        //             selectorDefault.disable()
        //             selectorMarital.disable()
        //             selectorGender.disable()
        //         }
        //     }
        // },1000)
    }

    // test submit file / upload file

    // submitProc() {
    //     //get file input and put to variable files
    //     const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
    //         this.files = []
    //         for (let idx = 0; idx < fileUpload.files.length; idx++) {
    //             const file = fileUpload.files[idx]
    //             this.files.push({
    //                 data: file,
    //                 inProgress: false,
    //                 progress: 0
    //             })
    //         }
    //     }
    //
    //     let payloadEmployee = {
    //         'firstName': this.modelFirstName,
    //         'lastName' : this.modelLastName
    //     }
    //
    //     for (let idxFile = 0 ; idxFile < this.files.length; idxFile++) {
    //         const formData = new FormData();
    //         const file = this.files[idxFile]
    //         alert(file.data.name)
    //         formData.append('user', JSON.stringify(payloadEmployee));
    //         formData.append('file', file.data);
    //         file.inProgress = true;
    //         this.methodServices.uploadFilePost("/api/testing/profileupload",
    //             localStorage.getItem(this.methodServices.seasonKey),
    //             formData
    //         ).pipe(map(event => {
    //             switch (event.type) {
    //                 case HttpEventType.UploadProgress:
    //                     file.progress = Math.round(event.loaded * 100 / event.total);
    //                     console.log("file Upload Progress : "+file.progress+"%" )
    //                     break;
    //                 case HttpEventType.Response:
    //                     return event;
    //             }
    //         }),
    //             catchError((error: HttpErrorResponse) => {
    //                 file.inProgress = false;
    //                 return of(`${file.data.name} upload failed.`);
    //             })).subscribe((event: any) => {
    //                 if (typeof(event) === 'object') {
    //                     console.log(event.body)
    //                 }
    //         });
    //     }
    //
    //
    // }


    // callDate(){
    //     alert(this.methodServices.effectiveDateParent)
    // }
    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

}