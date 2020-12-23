import { Injectable, OnInit } from "@angular/core"
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment'
import { Router, ActivatedRoute } from '@angular/router';
import { callbackify } from 'util';
import { TimeoutError, Subject } from 'rxjs';
import { map, catchError, share, windowWhen } from 'rxjs/operators';
import { Location, DatePipe } from '@angular/common' 
// import { ResourceLoader } from '@angular/compiler';

import { Workbook, Color }  from 'exceljs'
import * as fs from 'file-saver'

import * as CryptoJS from 'crypto-js'
import { rawListeners } from 'process';
import { R3TargetBinder } from '@angular/compiler';
import { AlternativeComponent } from 'src/app/pages/dashboards/alternative/alternative.component';
import {type} from "os";
// import {ROUTES} from "../app/components/sidebar/sidebar.component";


@Injectable({providedIn:'root'})

export class MethodServices { 
    aktif_table = new Subject<boolean>()
    aktif_table_child = new Subject<boolean>()

    // filterTemp = new Subject<boolean>();
    filterTemp = new Subject<any>();
    filterTempValue:string;
    filterTempObject = [];

    effectiveDateParent:Date;
    arrReligion = [];
    arrGender = [];


    error_page_code:string;
    urlEndParse = new Subject<string>()

    tempRead:any;

    selectedTemp = [];

    encryptTokenLabel:any;
    encryptAuthenticalLabel:any;


    seasonKey:any;
    authenticalKey:any;

    //USER LOGIN INFORMATION
    loginEmployeeId:any;
    loginName:string;
    loginEmployeeNo:string;
    loginEmploymentId:any;
    loginCompanyId:any;
    //---

    //USER AUTHENTICATION MENU
    userAuthorities = [];
    headerMenuShow = {
        dashboard: false,
        employee: true,
        work_structure: false,
        report: false,
        payroll: false,
    };
    ROUTES:any;

    constructor(private location:Location,private http:HttpClient, private router:Router,
                private activatedRoute:ActivatedRoute){
      this.aktif_table.next(true)
      this.aktif_table_child.next(true)
      
      let encryptToken:string;
            
      // const headers = new HttpHeaders()
      // .append('Content-Type', 'application/json')
      // .append('Access-Control-Allow-Headers', 'Content-Type')
      // .append('Access-Control-Allow-Methods', 'GET,POST')
      // .append('Access-Control-Allow-Origin', '*');

      //Religion
      if (localStorage.getItem(this.seasonKey) != null && localStorage.getItem(this.seasonKey) != ''){
        this.getUrlApi('/api/admin/dashboardhr/totalreligion',
            localStorage.getItem(this.seasonKey),
            // '98344e1c-5288-4e73-85bc-6cdcc6d30219',
        (result)=>{
        if (typeof(result) == 'object')
        {
            for(var key in result){
                if(result[key].religion != null && result[key].religion != '')
                {
                    this.arrReligion.push(result[key].religion)
                }
            }
        }
        });
        
        //Gender
        this.getUrlApi('/api/admin/dashboardhr/totalgender',
          localStorage.getItem(this.seasonKey),
        (result)=>{
        if (typeof(result) == 'object')
        {
            for(var key in result){
                if(result[key].gender != null && result[key].gender != '')
                {
                    this.arrGender.push(result[key].gender)
                }
            }
        }
        });
      }
    }
    
    token:any;
    token_status:boolean = false;
    access_token:any;
    error_msg:string;
    error_code:any;
    title:string;
    
    getElementTypes(id,callback){
      this.selectedTemp = []
      //ELEMENT CLASSIFICATION
          // setTimeout(()=>{
              // this.activatedRoute.queryParams.subscribe(hasil=>{
                // if (typeof(hasil.id) != 'undefined'){
                  this.selectedTemp = [];
                  this.getUrlApi('/api/admin/payelementtypes?page=0&size=100',
                        localStorage.getItem(this.seasonKey),
                        (result)=>{
                        if (typeof(result) == 'object')
                        {
                            for(var key in result){
                                if (key == 'content'){
                                    for(var i=0;i<result[key].length;i++){
                                        let effectiveDateConvert = new Date(result[key][i].effectiveDate);
                                        let effectiveDateConvertStr = new DatePipe('en-US').transform(effectiveDateConvert,'dd-MMM-yyyy')
                                        
                                        // let abc = new Date(effectiveDateConvertStr.toString())
                                        // alert(abc)

                                        this.selectedTemp.push({
                                                    id:result[key][i].id,
                                                    elementName:result[key][i].name,
                                                    reportingName:result[key][i].reportingName,
                                                    description:result[key][i].description,
                                                    effectiveDate:effectiveDateConvertStr,
                                                    elementClassification:result[key][i].payElementClassifications.name,
                                                    elementClassificationId:result[key][i].payElementClassifications.id,
                                                    elementClassificationDate:result[key][i].payElementClassifications.effectiveDate,
                                                    elementClassificationPriorityStart:result[key][i].payElementClassifications.priorityStart,
                                                    elementClassificationPriorityEnd:result[key][i].payElementClassifications.priorityEnd,
                                                    elementClassificationCompanyId:result[key][i].payElementClassifications.companyId,
                                                    elementClassificationActive:result[key][i].payElementClassifications.active,
                                                    priority:result[key][i].priority,
                                                    proration:result[key][i].proration,
                                                    recurring:result[key][i].recurring,
                                                    terminationRule:result[key][i].terminationRule,
                                                    active:result[key][i].active
                                                })     
                                    }
                                }
                            }
                            this.selectedTemp = this.selectedTemp.filter(resultChild=>{
                              return id == resultChild.id
                            })
                            // console.log(this.selectedTemp)
                            callback()
                        }
                      });
                // }
            // })
          // },800)  
    }

    getReligion(){
      if (localStorage.getItem(this.seasonKey) != null && localStorage.getItem(this.seasonKey) != ''){
        this.getUrlApi('/api/admin/dashboardhr/totalreligion',
            localStorage.getItem(this.seasonKey),
            // '98344e1c-5288-4e73-85bc-6cdcc6d30219',
        (result)=>{
        if (typeof(result) == 'object')
        {
            for(var key in result){
                if(result[key].religion != null && result[key].religion != '')
                {
                    this.arrReligion.push(result[key].religion)
                }
            }
        }
        });
      }
    }

    getUserLogin(callback){
        //GET USER LOGIN
        let result = {}

        this.getUrlApi('/api/user/profile?mobileversion=102',
        localStorage.getItem(this.seasonKey),
          (result)=>{
            if(typeof(result) == 'string'){
                this.loginEmployeeId = '---'
                this.loginEmploymentId = '---'
                this.loginCompanyId = '---'
                this.loginName = '---'
                this.loginEmployeeNo = '---'
                callback(result)
            }
            else
                if (typeof(result) == 'object')
                {
                  this.loginEmployeeId = result.employee.employeeId
                  this.loginEmploymentId = result.employee.employmentId
                  this.loginCompanyId = result.employee.companyId
                  this.loginName = result.employee.name
                  this.loginEmployeeNo = result.employee.employeeNo
                  for (let i = 0; i < result.authorities.length; i++) {
                      // console.log("Loop id : "+ i)
                      this.userAuthorities.push(result.authorities[i].authority)
                  }

                  result = {
                    loginEmployeeId:result.employee.employeeId,
                    loginEmploymentId:result.employee.employmentId,
                    loginCompanyId: result.employee.companyId,
                    loginName:result.employee.name,
                    loginEmployeeNo:result.employee.employeeNo,
                    userAuthorities:result.authorities
                  }
                  callback(result)
                }
      })
    }

    processToken(remember_status, username, password, callback)
    {
      // this.http.get(environment.baseUrl + "/public/api/login/hrcentral2"
      // )
      // .subscribe((result)=>{
      //   alert(result)
      // })
        var dataBody =
            // "username=" + username + "&password=" + password;
            {
              "username":username,
              "password":password
              }
              
              // let dataBodyRev:string = JSON.stringify(dataBody)
          this.http.post(environment.baseUrl + "/public/api/login/hrcentral",dataBody,{
          // this.http.post(environment.baseUrl + "/oauth/token?grant_type=password",dataBody,{
          headers: {
                // Authorization: environment.basicAuthentication,
                // "Content-Type": "application/x-www-form-urlencoded",
                "Content-Type": "application/json",
                // "Access-Control-Allow-Credentials":"true",
                // "Access-Control-Allow-Origin":"*",
                // "Access-Control-Allow-Headers":"Origin, Content-type, x-Requested-With, true",
                // "Access-Control-Allow-Methods":"POST, PUT, GET, OPTION, DELETE"
                // "Content-Type": "multipart/form-data"
                },
            // "username=" + username + "&password=" + password;
          })
          .subscribe(hasil => {
                        this.encryptTokenLabel = this.encryptOnline("Token");
                        this.encryptAuthenticalLabel = this.encryptOnline("Authentical")
                        this.getToken(remember_status,hasil,username,password);
                        callback(this.error_msg,this.access_token)
                        },
                    err => {
                            this.getError(err,err.status);
                            // console.log(err)
                            callback(this.error_msg,this.access_token)
                          }
                      )
    }            
    

    getToken(remember_status,tok,username,password)
    {
      this.token = tok;
      this.access_token =  tok.access_token;
      // console.log(this.access_token)

      let encryptToken:string;
      encryptToken = this.encryptOnline(this.access_token)
      let encryptUsername:string;
      encryptUsername = CryptoJS.AES.encrypt(username,environment.encryptKey).toString()
      let encryptPassword:string;
      encryptPassword = CryptoJS.AES.encrypt(password,environment.encryptKey).toString()

      this.token_status = true;
      this.title = this.location.prepareExternalUrl(this.location.path())
      var login_exists = this.title.indexOf('/login')

      // this.access_token_sub.next(this.access_token);
      //Keep to Local Storage
      if (typeof(Storage) !== 'undefined')
        localStorage.setItem(this.encryptTokenLabel,encryptToken)


      if (this.seasonKey == "undefined")
          this.readLocalStorageKey()

      if (this.access_token !== null && login_exists !== -1) {
        this.error_msg = null;
        if (localStorage.getItem('ZEU@AL!') !== null) //user
        {
            localStorage.removeItem('ZEU@AL!')
        }
        if (remember_status == true){
          // localStorage.setItem('ZEU@AL!',window.btoa(username))
          localStorage.setItem('ZEU@AL!',encryptUsername)
        }
        
        if (localStorage.getItem('SPS!#WU') !== null) //password
        {
            localStorage.removeItem('SPS!#WU')
        }
        if (remember_status == true){
          // localStorage.setItem('SPS!#WU',window.btoa(password))
          localStorage.setItem('SPS!#WU',encryptPassword)
        }

        this.router.navigate(["dashboards"]);
        // location.reload();
      // console.log(this.access_token)
      // this.getHist();
      }
    }
    
    getError(err_prev:any,err_status:any){
        this.token_status = false;
        // console.log(err_status)
        // console.log(err_prev)
        if (typeof(err_prev.error.error_description) != 'undefined'){
          // console.log(err_prev.error.error_description);
          this.error_msg = err_prev.error.error_description;
        }
        else{
          // console.log(err_prev.error.description);
          this.error_msg = err_prev.error.description;
        }
        
        this.error_code = err_status;
        
        if (this.error_code == 401 || this.error_code == 400) {
            localStorage.removeItem(this.seasonKey)
            localStorage.removeItem(this.authenticalKey)
            this.userAuthorities = [];
            this.router.navigate(["/"]);
          this.error_msg = this.error_msg;
        }
        else 
        if(this.error_code == 500){
          this.error_msg = 'Could not process this operation. Please contact Admin.'
        }
        else{
          this.error_msg = 'Please Check your connection.'
        }
    }

    getUrlApi(urlapi,token,callback,params?){
      let decryptToken = this.decryptOnline(token)

      if (typeof(localStorage.getItem('Token') == 'undefined')){
        decryptToken = this.decryptOnline(localStorage.getItem(this.seasonKey))
      }

      // alert('Method Service : ' + decryptToken)
      if (typeof(params) == 'undefined' || params == '')
      {
        this.http.get(environment.baseUrl + urlapi,{
          headers:{
            // Authorization:'Bearer ' + decryptToken
            Authorization:'Bearer ' + decryptToken
          }
        }).subscribe(hasil=>{
          // console.log(hasil)
          callback(hasil)
        },err=>{
            this.getError(err,err.status)
            this.error_page_code = err.status
            callback('Error')
        })
      }
      else
      {
        this.http.get(environment.baseUrl + urlapi + '?' + params,
          {
          headers:{
            // Authorization:'Bearer ' + decryptToken
            Authorization:'Bearer ' + decryptToken
          }
        }).subscribe(hasil=>{
          // console.log(hasil)
          callback(hasil)
        },err=>{
            this.getError(err,err.status)
            this.error_page_code = err.status
            callback('Error')
        })
      }
    }

    postData(dataObj,token,urlapi,callback){
      let decryptToken = this.decryptOnline(token)

      if (typeof(localStorage.getItem('Token') == 'undefined')){
        decryptToken = this.decryptOnline(localStorage.getItem(this.seasonKey))
      }

      let dataBody =
      // "username=" + username + "&password=" + password;
      dataObj
      // console.log(dataBody)
  
        // this.http.post(environment.baseUrl + "/oauth/token?grant_type=password",dataBody,{
        this.http.post(environment.baseUrl + urlapi,dataBody
          ,{
           headers: {
              Authorization: "Bearer " + decryptToken,
              // Authorization: 'Bearer ' + decryptToken,
              "Content-Type": "application/json"
              // "Content-Type": "application/x-www-form-urlencoded"
              }
          }
        )
        .subscribe(hasil => {
                            // console.log('Berhasil Subscribe')
                            let message:string;
                            let error:boolean;
                            let error_msg:string;
                            for (var key in hasil){
                              if (key == 'message'){
                                  message = hasil[key]
                              }
                              if (key == 'error'){
                                  error = hasil[key]
                                  if (error == false){
                                    error_msg = ''
                                  }
                                  else{
                                    error_msg = message
                                    message = ''; //success
                                  }
                              }
                            }
                            callback(error_msg,message)
                            // callback(this.error_msg,this.access_token)
                            },
                  err => {
                          // console.log(err)
                          callback(err.error.message,'')
                          // callback(this.error_msg,this.access_token)
                        }
                    )
    }

    //upload file percobaan

    // uploadFilePost(urlApi,token,FormData) {
    //     let decryptToken = this.decryptOnline(token)
    //
    //     if (typeof(localStorage.getItem('Token') == 'undefined')){
    //         decryptToken = this.decryptOnline(localStorage.getItem(this.seasonKey))
    //     }
    //
    //     return this.http.post(environment.baseUrl + urlApi, FormData, {
    //         headers: {
    //             Authorization: "Bearer " + decryptToken,
    //             // Authorization: 'Bearer ' + decryptToken,
    //             // "Content-Type": "application/json"
    //             // "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         reportProgress: true,
    //         observe: 'events'
    //     });
    // }


    generate(){
      let wb = new Workbook()
      
      let ws = wb.addWorksheet('Sheet1',{pageSetup:{paperSize:9,orientation:'portrait'},
            properties:{tabColor:{argb:'D9FF00'}}})
      wb.views = [{x:1000,y:0,width:20000,height:20000,firstSheet:0,activeTab:1,visibility:'veryHidden'}]
      
      


      // ws.addRow(['Code','Name','Description'])
      // ws.autoFilter = 'A1:C1'

      let titleTable = []
      titleTable = ['Code','Name','Description']

      let data = []
      // data = [['Good','Change','Better'],
      //         ['BetterBest','Change Dess','Better Most']]
      
      data = [
            {code:'A01 typing master',name:'Andis',desc:'Pointing it'},
            {code:'A02',name:'Aclara',desc:'Shake it trying better'}
            ]

      // ws.columns = [
      //   {header:'Id',key:'id'},
      //   {header:'Code',key:'code'},
      //   {header:'Description',key:'description'}
      // ]
      // ws.columns.forEach(column=>{
      //   column.width = column.header.length
      // })

      let title = ws.addRow(['PT. IDStar Cipta Teknologi'])
      title.font = {size:20,bold:true}

      ws.mergeCells('A1:E1')
      // ws.addRows(data)
      
      //Report Name
      let reportName = ws.addRow(['Laporan Data Karyawan'])
      reportName.font = {size:15}
      
      ws.addRow([])
      ws.addRow([])

      //Column Header Name
      let titleParse = ws.addRow(titleTable)
      titleParse.eachCell((cell,number)=>{
        cell.font = {color:{argb:'000000'},bold:true}
        cell.fill = {type:'pattern',
                            pattern:'solid',
                            fgColor:{argb:'8DB4E2'},
                            bgColor:{argb:'FFFFFF'}
                          }
        cell.border = {top:{style:'thin'},bottom:{style:'thin'},
                      left:{style:'thin'},right:{style:'thin'}}
      })
      
      let idxCol = 1;
      titleTable.forEach((result)=>{
        ws.getColumn(idxCol).width = result.length
        idxCol++;
      })

          
      if (data.length > 0){
        let index = 1;
        data.forEach((hasilTemp)=>{
          if (hasilTemp instanceof Array){
            let tempRes = ws.addRow(hasilTemp)
            tempRes.eachCell((cell,number)=>{
              if (index == data.length){
                cell.border = {left:{style:'thin'},right:{style:'thin'},
                              bottom:{style:'thin'}}
              }
              else{
                cell.border = {left:{style:'thin'},right:{style:'thin'}}
              }
            })

            let idx = 1;
            hasilTemp.forEach(hasilTemp2=>{
              if (hasilTemp2.length > ws.getColumn(idx).width){
                ws.getColumn(idx).width = hasilTemp2.length
              }
              idx++;
            })
          }
          else
          if (hasilTemp instanceof Object){
            let arrTemp = [];
            for (let temp of Object.keys(hasilTemp)){
              arrTemp.push(hasilTemp[temp])
            }
            
            let tempRes = ws.addRow(arrTemp)
            tempRes.eachCell((cell,number)=>{
              if (index == data.length){
                cell.border = {left:{style:'thin'},right:{style:'thin'},
                              bottom:{style:'thin'}}
              }
              else{
                cell.border = {left:{style:'thin'},right:{style:'thin'}}
              }
            })

            let idx = 1;
            arrTemp.forEach((hasilTemp2)=>{
                if (hasilTemp2.length > ws.getColumn(idx).width){
                  ws.getColumn(idx).width = hasilTemp2.length
                }
                idx++;
            })
          }

          index++;
        })
      }
    
      idxCol = 1;
      for (var i = 0;i < titleTable.length;i++){
          ws.getColumn(idxCol).width += 1
          idxCol++;
      }
      
    
            // {pageSetup:{paperSize:5,orientation:"landscape"}
      wb.xlsx.writeBuffer().then((data) => {
        let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(blob,'testing.xlsx')
      });           
    }

    encryptOnline(text){
      let encVal;
      if (typeof(text) == 'number'){
        text = text.toString()
      }
      else
      if (text == null || typeof(text) == 'undefined'){
        text = ''
      }
      
      let keys = CryptoJS.enc.Utf8.parse(environment.encryptKey)
      let options = {mode:CryptoJS.mode.ECB,
                    padding:CryptoJS.pad.Pkcs7}
      encVal = CryptoJS.AES.encrypt(text,keys,options).toString()
      encVal = encVal.replace(/\+/g,'-').replace(/\//g,'_')
      
      return encVal
    }

    // encryptWithIV(text) {
    //     let encVal;
    //     let IVparseKey = CryptoJS.enc.Utf8.parse(environment.secretKey)
    //     let keys = CryptoJS.enc.Utf8.parse(environment.encryptKey)
    //     let options = {mode:CryptoJS.mode.ECB,
    //                     padding:CryptoJS.pad.Pkcs7,
    //                     iv:IVparseKey}
    //     encVal = CryptoJS.AES.encrypt(text,keys,options).toString()
    //
    //     return encVal
    // }
    //
    // decryptWithIV(encText) {
    //     let keys = CryptoJS.enc.Utf8.parse(environment.encryptKey)
    //     let IVparseKey = CryptoJS.enc.Utf8.parse(environment.secretKey)
    //     let options = {mode:CryptoJS.mode.ECB,
    //         padding:CryptoJS.pad.Pkcs7,
    //         iv:IVparseKey}
    //
    //     let encVal = CryptoJS.AES.decrypt(encText,keys,options)
    //     let encValRev = CryptoJS.enc.Utf8.stringify(encVal)
    //
    //     return encValRev
    // }

    decryptOnline(encText){
      let encTextRpl = encText.replace(/\-/g,'+').replace(/_/g,'/')
      let keys = CryptoJS.enc.Utf8.parse(environment.encryptKey)
      let options = {mode:CryptoJS.mode.ECB,
                    padding:CryptoJS.pad.Pkcs7}
      let encVal = CryptoJS.AES.decrypt(encTextRpl,keys,options)
      let encValRev = CryptoJS.enc.Utf8.stringify(encVal)
      return encValRev
    }

    decryptValue(encText){
      // let vals = 'Jnhk7eaBhqqgdOKbB0sO1Q=='
      // let vals = 'Y6h8PZg56Pfm6AxfrqzyRw=='
      let vals = encText.replace(/\-/g,'+').replace(/_/g,'/')
      let options = {mode: CryptoJS.mode.ECB,
                    padding: CryptoJS.pad.Pkcs7}
        
      var key = CryptoJS.enc.Utf8.parse(environment.secretKey)
      var decryptedData = CryptoJS.AES.decrypt(vals,key,options)
      var decryptedStr = CryptoJS.enc.Utf8.stringify(decryptedData)
      return decryptedStr
    }

    readLocalStorageKey() {
        if (typeof (Storage) != "undefined") {
            for (let keyIdx = 0; keyIdx < localStorage.length; keyIdx++) {
                if (keyIdx != null) {
                    let decryptKey = this.decryptOnline(localStorage.key(keyIdx));
                    if (decryptKey == "Token")
                        this.seasonKey = localStorage.key(keyIdx);
                    if (decryptKey == "Authentical")
                        this.authenticalKey = localStorage.key(keyIdx)
                }
            }
        }
    }
    permissionMenu(urlTarget,authorities?:string): boolean {
        if (localStorage.getItem(this.authenticalKey) != null) {
            let decryptAuthorities = JSON.parse(this.decryptOnline(localStorage.getItem(this.authenticalKey)))
            this.userAuthorities = []
            for (let i = 0; i < decryptAuthorities.length; i++) {
                this.userAuthorities.push(decryptAuthorities[i].authority)
            }
        }
        if (this.userAuthorities.length > 0) {
            if (typeof(authorities) != "undefined") {
                //Logic hidden / not hidden meny
                let checkAuthentical = this.userAuthorities.indexOf(authorities)
                if (checkAuthentical != -1) {
                    if (authorities.indexOf(" Dashboard") != -1)
                        this.headerMenuShow.dashboard = true
                    if (authorities.indexOf("Payroll ") != -1)
                        this.headerMenuShow.payroll = true
                    if (authorities.indexOf(" Report") != -1)
                        this.headerMenuShow.report = true
                    if (authorities == "Workforce Structure")
                        this.headerMenuShow.work_structure = true
                    return true
                } else {
                    return false
                }
            } else {
                let accessMenu = false
                //give permission to access menu
                for(let idxMenu in this.ROUTES) {
                    if (typeof(this.ROUTES[idxMenu].children) != "undefined") {
                        for (let idxChild = 0; idxChild < this.ROUTES[idxMenu].children.length; idxChild++) {
                            if (urlTarget == this.ROUTES[idxMenu].children[idxChild].path) {
                                let menuAuthorities = this.ROUTES[idxMenu].children[idxChild].authentical
                                let canAccessMenu = this.userAuthorities.indexOf(menuAuthorities)
                                if (canAccessMenu != -1)
                                    accessMenu = true
                            }
                        }
                    } else {
                        if (urlTarget == this.ROUTES[idxMenu].path) {
                            let menuAuthorities = this.ROUTES[idxMenu].authentical
                            let canAccessMenu = this.userAuthorities.indexOf(menuAuthorities)
                            if (canAccessMenu != -1)
                                accessMenu = true
                        }
                    }
                }
                if (this.userAuthorities.indexOf('Element Entries') != -1) {
                    accessMenu = true
                }
                if (authorities == "Blocked") {
                    accessMenu = false
                }
                if (typeof(this.ROUTES) == "undefined")
                    accessMenu = true
                if (urlTarget == "dashboards")
                    accessMenu = true

                return accessMenu
            }
        }
    }

    redirectDashboard(urlEndParse) {
        let dashboardUrl = urlEndParse[0].toUpperCase() + urlEndParse.substr(1).toLowerCase();
        for (let i = 0; i < this.userAuthorities.length; i++) {
            let checkAuthentical = this.userAuthorities[i].indexOf(" "+dashboardUrl.substring(0, dashboardUrl.length - 1))
            if (checkAuthentical != -1) {
                let urlParseDirect = this.userAuthorities[i].substring(0, this.userAuthorities[i].indexOf(" ")).toLowerCase()
                this.router.navigate(['dashboards', urlParseDirect])
                break;
            }
        }
    }
}

