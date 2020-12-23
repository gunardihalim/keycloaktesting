import { Component, OnInit, ViewChild } from "@angular/core";
import Chart from "chart.js";
import { MethodServices } from 'src/services/method-services';
import { NgForm } from '@angular/forms';
import * as CryptoJS from 'crypto-js'

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  chartExampleReligion,
  chartExampleEmpType,
  chartExampleEmpage,
  bindChartEvents
} from "../../../variables/charts";
import { clear } from 'console';
import { exit } from 'process';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertComponent } from 'ngx-bootstrap';
import { AlternativeComponent } from '../alternative/alternative.component';
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router';
import { $ } from 'protractor';


interface termination {
  name:string,
  employeeNo?:string,
  terminationDate?:any,
  employeeProfile?:string
}
interface contractExpInterface {
  name:string,
  employeeNo?:string,
  endPeriod?:any,
  employeeProfile?:string
}


@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard-hr.component.html"
})
export class DashboardHrComponent implements OnInit {
  public datasets: any;
  public datasetsReligion:any[] = [];
  public labelGender:any;
  public data: any;
  public data_emp_religion:any;
  public data_emp_type:any;
  public data_emp_age:any;
  public salesChart;
  public salesChart2;
  public salesChart3; 
  public salesChart4; 
  public clicked: boolean = true;
  public clicked1: boolean = false;

  showSkeletonNewHire:boolean = true;
  showSkeletonTermination:boolean = true;
  showSkeletonTerminationList:boolean = true;
  showSkeletonTotal:boolean = true;
  showSkeletonGender:boolean = true;
  showSkeletonReligion:boolean = true;
  showSkeletonType:boolean = true;
  showSkeletonAge:boolean = true;
  showSkeletonContractExpiredList:boolean = true;

  totalEmp:number = 0;
  newEmpLastYear:number = 0;
  newEmpCurYear:number = 0;
  empResignLastYear:number = 0;
  empResignCurYear:number = 0;

  gender = [];
  totalGender = [];
  
  religion = [];
  totalReligion = [];
  
  employeeStatus = [];
  totalEmployeeStatus = [];

  bgColorReligion = [];

  checked_status:boolean = false;
  urlEndParse:string;
  
  terminateFinal:termination[] = [];
  contractExp:contractExpInterface[] = [];

  constructor(private methodServices:MethodServices,
              private Http:HttpClient,
              private location:Location,
              private router:Router) {
  }

  ngOnInit() {
    var url = this.location.prepareExternalUrl(this.location.path())
    var urlEnd = url.lastIndexOf("/") + 1
    this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()

    if (this.methodServices.seasonKey == null) {
      this.methodServices.readLocalStorageKey()
    }

    //Total Employee (3 Card Informations)
    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/totalemployee',
            localStorage.getItem(this.methodServices.seasonKey),
            (result)=>{
              if (typeof(result) == 'object')
              {
                this.totalEmp = result[0].totalEmployees
                this.newEmpLastYear = result[0].totalNewEmployeesLastYear
                this.newEmpCurYear = result[0].totalNewEmployeesCurrentYear
                this.empResignLastYear = result[0].totalResignEmployeeLastYear
                this.empResignCurYear = result[0].totalResignEmployeeCurrentYear
              }
              this.showSkeletonTermination = false
              this.showSkeletonNewHire = false
              this.showSkeletonTotal = false
            })
    // }
    

    //Pie Chart
    
    // this.datasetsReligion = [
    //   [10,20]
    // ];
    this.datasets = [
      this.totalGender,
      this.totalReligion,
      this.totalEmployeeStatus,
      [10,20,30,50,70]
    ];  

    //Get Total Gender
    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/totalgender',
      localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
          if (typeof(result) == 'object')
          {
            for(var key in result){
              if(result[key].gender == 'Male' || 
                  result[key].gender == 'Female'){
                this.gender.push(result[key].gender)
                this.totalGender.push(result[key].total)
                this.methodServices.arrGender.push(result[key].gender)
              }
            }
          }
          
          this.data = this.datasets[0];
          var chartContainerGender = document.getElementById("containerGender")
          var chartSales = document.getElementById("chart-sales-dark");
          var chartLegendGender = document.getElementById("legendChartGender");

          this.salesChart = new Chart(chartSales, {
            type: "pie",
            options: chartExample1.options,
            data: chartExample1.data,
          });

          this.salesChart.data.datasets[0].data = this.datasets[0];
          this.salesChart.data.labels = this.gender;
          this.salesChart.update();
          chartLegendGender.innerHTML = this.salesChart.generateLegend()
          bindChartEvents(this.salesChart, chartContainerGender)
          this.showSkeletonGender = false
          // this.processChart();
      })
      
    // }

    //Get Religion
    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
        this.methodServices.getUrlApi('/api/admin/dashboardhr/totalreligion',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
          if (typeof(result) == 'object')
          {
            for(var key in result){
              if(result[key].religion != ''){
                this.religion.push(result[key].religion)
                this.totalReligion.push(result[key].total)
                this.methodServices.arrReligion.push(result[key].religion)
              }
            }
          }
          this.data_emp_religion = this.datasets[1];
          var chartContainerReligion = document.getElementById("containerReligion")
          var chartEmpReligion = document.getElementById("chart-emp-religion");
          var chartLegendEmpReligion = document.getElementById("legendChartReligion");

          this.salesChart2 = new Chart(chartEmpReligion, {
            type: "pie",
            options: chartExampleReligion.options,
            data: chartExampleReligion.data,
          });
          this.salesChart2.data.datasets[0].data = this.data_emp_religion;
          this.salesChart2.data.labels = this.religion
          this.salesChart2.update();
          chartLegendEmpReligion.innerHTML = this.salesChart2.generateLegend()
          bindChartEvents(this.salesChart2, chartContainerReligion)
          this.showSkeletonReligion = false
        })
    // }
    

    //Get Type
    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/totaltype',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
        if (typeof(result) == 'object')
        {
          for(var key in result){
            if(result[key].employeeStatus != ''){
              this.employeeStatus.push(result[key].employeeStatus)
              this.totalEmployeeStatus.push(result[key].total)
            }
          }
          this.showSkeletonType = false
        }
        this.data_emp_type = this.datasets[2];
        var chartContainerType = document.getElementById("containerType")
        var chartExampleEmptype = document.getElementById("chart-emp-type");
        var chartLegendEmptype = document.getElementById("legendChartType");

        this.salesChart3 = new Chart(chartExampleEmptype, {
          type: "pie",
          options: chartExampleEmpType.options,
          data: chartExampleEmpType.data,
        });
        
        this.salesChart3.data.datasets[0].data = this.data_emp_type;
        this.salesChart3.data.labels = this.employeeStatus
        this.salesChart3.update();
        chartLegendEmptype.innerHTML = this.salesChart3.generateLegend()
        bindChartEvents(this.salesChart3, chartContainerType)
        this.showSkeletonType = false
      

      // function handleClick(e, slice) {
      //   setTimeout(() => {
      //     const legend = this.salesChart3.legend.legendItems;
      //     if (slice && slice[0]) {
      //       const sliceIndex = slice[0]._index;
      
      //       this.salesChart3.getDatasetMeta(0).data[sliceIndex].hidden = true
      
      //       this.salesChart3.update();
      //     }
      //   });
      // }

      this.salesChart3.update(1000,this.salesChart3.GRAPH_CHANGE_ANIMATION_LAZY);
    })
    // }

    //Employee Age
    var ageKey = [];
    var ageValue = [];
    
    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/listage',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
        if (typeof(result) == 'object')
        {
          for(var key in result){
              ageValue.push(result[key].ageUnder_20)
              ageValue.push(result[key].age21_30)
              ageValue.push(result[key].age31_30)
              ageValue.push(result[key].age41_50)
              ageValue.push(result[key].ageMore_50)
            }
            ageKey.push('<20','21-30','31-40','41-50','>51')
        }

        this.data_emp_age = ageValue;
        var chartExampleEmpAge = document.getElementById("chart-emp-age");
        
        this.salesChart4 = new Chart(chartExampleEmpAge, {
          type: "bar",
          options: chartExampleEmpage.options,
          data: chartExampleEmpage.data,
        });
        
        this.salesChart4.data.datasets[0].data = this.data_emp_age;
        this.salesChart4.data.labels = ageKey
        this.salesChart4.update();
        this.showSkeletonAge = false 
      })

      
      
    // }
    

    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/empfutureterminate',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
        if (typeof(result) == 'object')
        {
          for (var key in result)
          {
            if (result[key].name != null && result[key].name != 0 && result[key] != '')
            {
              var terminateTemp:termination = {name:result[key].name,
                            employeeNo:result[key].employeeNo,
                            terminationDate:result[key].terminationDate,
                            employeeProfile:result[key].employeeProfile}
              this.terminateFinal.push(terminateTemp)          
            }
          }
          this.showSkeletonTerminationList = false
        }
      })
    // }

    //Contract Expired List

    // if (localStorage.getItem('Token') != null && localStorage.getItem('Token') != ''){
      this.methodServices.getUrlApi('/api/admin/dashboardhr/empexpcontract',
      localStorage.getItem(this.methodServices.seasonKey),
      (result)=>{
        if (typeof(result) == 'object')
        {
          for (var key in result)
          {
            if (result[key].name != null && result[key].name != 0 && result[key] != '')
            {
              var contractExpTemp:contractExpInterface = {name:result[key].name,
                            employeeNo:result[key].employeeNo,
                            endPeriod:result[key].endPeriod,
                            employeeProfile:result[key].employeeProfile}
              this.contractExp.push(contractExpTemp);
            }
          }
          this.showSkeletonContractExpiredList = false
        }
      })
    // }
  }
}
