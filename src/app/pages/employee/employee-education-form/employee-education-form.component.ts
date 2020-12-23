import { Component, OnInit, Input, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute, NavigationStart } from '@angular/router'
import { Location, DatePipe } from '@angular/common'
import { SelectionType, ColumnMode } from '@swimlane/ngx-datatable';
import { MethodServices } from 'src/services/method-services';
import {style, state, animate, transition, trigger, animateChild, query} from '@angular/animations';
import { NgForm } from '@angular/forms';
import { format } from 'path';
import Selectr from 'mobius1-selectr'
import { FormControl } from '@angular/forms'
import * as CryptoJS from 'crypto-js'
import {environment} from "../../../../environments/environment";

@Component({
    selector:"employee-education-form",
    templateUrl:"employee-education-form.component.html",
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

export class EmployeeEducationFormComponent implements OnInit {

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
modelGender:string
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
modelFamilyName:string;
modelProfession:string;
modelRelationship:string;
modelDeceaseDate:any;
modelMedical:boolean;
modelBloodType:string;
modelLastEducation:string;
modelMaritalStatus:string;
modelMarriedDate:any;
modelDivorceDate:any;
modelPhoneNumber:any;
modelEmergencyContact:boolean;
modelCityOfEducation:string;
modelLevelOfEducation:string;
modelEducationName:string;
modelFaculty:string;
modelMajor:string;
modelGraduationDate:any;

arrBloodType = ['A','B','AB','O']
arrLevelEducation = ['SD','SMP','SMA','S1','S2']
arrMaritalStatus = ['Single','Married'];

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
    modelEffectiveDate:string;
    readOnlyInput:boolean = false;
    readOnlyInputSelect = false;

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
            this.employeeId = CryptoJS.AES.decrypt(result.employeeid,environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.modelEducationName = CryptoJS.AES.decrypt(result.educationName,environment.encryptKey).toString(CryptoJS.enc.Utf8)
            this.modelLevelOfEducation = CryptoJS.AES.decrypt(result.levelOfEducation,environment.encryptKey).toString(CryptoJS.enc.Utf8)

        })
        
        // Religion
        // this.params = "page=0&size=3000"
        if (this.religionFinal.length >= 0){
            this.religionFinal.splice(0,this.religionFinal.length)
        }

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
            this.employeeId = CryptoJS.AES.decrypt(result.employeeid,environment.encryptKey).toString(CryptoJS.enc.Utf8);
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
            //Date Of Birth
            // this.modelDateOfBirth = result.birthDate;
            // var dateParse = new Date(this.modelDateOfBirth)
            // var dateParseFormat = new DatePipe('en-US').transform(dateParse,'yyyy-MM-dd')
            // this.modelDateOfBirth = dateParseFormat
            //----
            //Age
            // let today = new Date()
            // let ageDiffer = Math.floor(((Date.UTC(today.getFullYear(),today.getMonth(),today.getDate())
            //                 -
            //                 Date.UTC(dateParse.getFullYear(),dateParse.getMonth(),dateParse.getDate())
            //                 ) / (1000 * 60 * 60 * 24 * 365)))
            // this.modelAge = ageDiffer
            //----
            
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


        //Family Information
        // this.methodServices.getUrlApi('/api/family?employeeid=' + this.employeeId,
        // localStorage.getItem('Token'),
        // (result)=>{
        //     if (typeof(result) == 'object')
        //     {
        //         for (var key in result){
        //             this.modelFamilyName = result[key].name;
        //             this.modelGender = result[key].gender;
        //             this.modelProfession = result[key].occupation;
        //             this.modelRelationship = result[key].relationship;
        //             this.modelPlaceOfBirth = result[key].birthPlace;
        //             this.modelMedical = result[key].isCovered;
        //             this.modelBloodType = result[key].bloodType;
        //             this.modelMaritalStatus = result[key].maritalStatus;
        //             this.modelPhoneNumber = result[key].phone;

        //             this.modelDateOfBirth = result[key].birthDate;
        //             var dateParse = new Date(this.modelDateOfBirth)
        //             var dateParseFormat = new DatePipe('en-US').transform(dateParse,'yyyy-MM-dd')
        //             this.modelDateOfBirth = dateParseFormat

        //             if(result[key].deceaseDate != null){
        //                 var deceaseDate = new Date(result[key].deceaseDate)
        //                 var deceaseDateFormat = new DatePipe('en-US').transform(deceaseDate,'yyyy-MM-dd')
        //                 this.modelDeceaseDate = deceaseDateFormat
        //             }
        //             if(result[key].marriedDate != null){
        //                 var marriedDate = new Date(result[key].marriedDate)
        //                 var marriedDateFormat = new DatePipe('en-US').transform(marriedDate,'yyyy-MM-dd')
        //                 this.modelMarriedDate = marriedDateFormat
        //             }
        //         }
        //     }   
        // });

        setTimeout(()=>{
            var selectrLevelOfEducation:any = document.getElementById('selectrLevelOfEducation')
            var options = {searchable:true}
            var selectrLevelOfEducationDefault = new Selectr(selectrLevelOfEducation,options)
        },800)
        
    }
    // ngOnDestroy(){
    //     this.aktifTableTemp.emit(true)
    //     this.methodServices.aktif_table.next(true)
    // }

}