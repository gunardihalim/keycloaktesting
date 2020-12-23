import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import Chart from "chart.js";
import { MethodServices } from 'src/services/method-services';
import { NgForm } from '@angular/forms';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
  chartExampleReligion,
  chartExampleEmpType,
  chartExampleEmpage,
  chartTodayCheckIn
} from "../../../variables/charts";

import { clear } from 'console';
import { exit } from 'process';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertComponent } from 'ngx-bootstrap';
import { AlternativeComponent } from '../alternative/alternative.component';
import { Location } from '@angular/common'


interface topAbsence {
  fullName:string,
  npk?:string,
  totalAbsen?:number,
  employeeProfile?:string
}
interface contractExpInterface {
  name:string,
  employeeNo?:string,
  endPeriod?:any,
  employeeProfile?:string
}

@Component({
  selector: "app-dashboard-time",
  templateUrl: "dashboard-time.component.html"
})
export class DashboardTimeComponent implements OnInit {
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

  showSkeletonLeave:boolean = true;
  showSkeletonPermission:boolean = true;
  showSkeletonSick:boolean = true;
  showSkeletonTodayCheckIn:boolean = true;
  showSkeletonTotalAbsenceThisMonth:boolean = true;
  showSkeletonTop5AbsenceEmployee:boolean = true;

  lastMonth:number = 0;
  thisMonth:number = 0;
  percentage:number = 0;
  icon_arrow:string = '';
  icon_percent:string = '';

  totalLeave:number;
  totalSick:number;
  totalPermission:number;

  topAbsence:topAbsence[] = [];

  totalCheckIn = [];
  type = [];
  
  religion = [];
  totalReligion = [];
  
  employeeStatus = [];
  totalEmployeeStatus = [];

  file1:any;
  file2:any;

  parsing_gambar:any;

  urlEndParse:string;
  
  contractExp:contractExpInterface[] = [];

  constructor(private methodServices:MethodServices,
              private Http:HttpClient,
              private location:Location) {
  }

  ngOnInit() {
    var url = this.location.prepareExternalUrl(this.location.path())
    var urlEnd = url.lastIndexOf("/") + 1
    this.urlEndParse = (url.substr(urlEnd,1).toUpperCase() + url.slice(urlEnd + 1).toLowerCase()).toUpperCase()

      if (this.methodServices.seasonKey == null) {
          this.methodServices.readLocalStorageKey()
      }

    //Pie Chart
    
    // this.datasetsReligion = [
    //   [10,20]
    // ];
    this.datasets = [
      this.totalCheckIn
    ];  

    //Total Absence
    this.methodServices.getUrlApi('/api/admin/dashboardtime/totalabsence',
    localStorage.getItem(this.methodServices.seasonKey),
    (result)=>{
      if (typeof(result) == 'object')
      {
            this.lastMonth = result[0].lastMonth;
            this.thisMonth = result[0].thisMonth;
            this.percentage = result[0].percentage;
        
            var sign = Math.sign(this.percentage)
            if (sign == -1)
            {
                this.icon_arrow = 'fa fa-arrow-down text-danger text-xl mr-2'
                this.icon_percent = 'text-danger'
            }
            else if(sign == 1)
            {
                this.icon_arrow = 'fa fa-arrow-up text-success text-xl mr-2'
                this.icon_percent = 'text-success'
            }
            else{
                this.icon_arrow = '';
                this.icon_percent = 'text-white'
            }
            this.showSkeletonTotalAbsenceThisMonth = false;
      }
    })

    //Leave Sick Permission
    this.methodServices.getUrlApi('/api/admin/dashboardtime/leavesickpermission',
    localStorage.getItem(this.methodServices.seasonKey),
    (result)=>{
      if (typeof(result) == 'object')
      {
            this.totalLeave = result[0].totalLeave;
            this.totalSick = result[0].totalSick;
            this.totalPermission = result[0].totalPermission;
            this.showSkeletonLeave = false;
            this.showSkeletonPermission = false;
            this.showSkeletonSick = false;
      }
    });

    //Top Absence
    var topAbsenseTemp:topAbsence;
    this.methodServices.getUrlApi('/api/admin/dashboardtime/topabsence',
    localStorage.getItem(this.methodServices.seasonKey),
    (result)=>{
      if (typeof(result) == 'object')
      {
            for(var key in result)
            {
                topAbsenseTemp = {fullName:result[key].fullName,
                                    npk:result[key].npk,
                                    totalAbsen:result[key].totalAbsen,
                                    employeeProfile:result[key].employeeProfile}
                this.topAbsence.push(topAbsenseTemp)
            }
            this.showSkeletonTop5AbsenceEmployee = false;
      }
    });


    //Get Total Gender
    this.methodServices.getUrlApi('/api/admin/dashboardtime/todaycheckin',
        localStorage.getItem(this.methodServices.seasonKey),
        (result)=>{
          if (typeof(result) == 'object')
          {
            for(var key in result){
                this.totalCheckIn.push(result[key].totalCheckIn)
                this.type.push(result[key].type)
            }
          }

          setTimeout(() => {
            this.data = this.datasets[0];
            var chartSales = document.getElementById("chart-today-checkin");

            this.salesChart = new Chart(chartSales, {
                type: "pie",
                options: chartTodayCheckIn.options,
                data: chartTodayCheckIn.data,
            });

            this.salesChart.data.datasets[0].data = this.datasets[0];
            this.salesChart.data.labels = this.type;
            this.salesChart.update();
          }, 1000)
          // this.processChart();
          this.showSkeletonTodayCheckIn = false;
    })
  }

   
  //  target_file(events){  
  //    var reader = new FileReader();  
  //    var good;
  //    reader.readAsDataURL(events.target.files[0])
  //     reader.onload = function(e){
  //       console.log(e.target.result)
  //       good = e.target.result
  //     }
  //     setTimeout(()=>{
  //       this.file1 = good
  //     },100)
  //     // alert(events.target.files[0].length)
  //  } 
  //  target_file2(events){  
  //   var reader = new FileReader();  
  //   var good;
  //   reader.readAsDataURL(events.target.files[0])
  //    reader.onload = function(e){
  //      console.log(e.target.result)
  //      good = e.target.result
  //    }
  //    setTimeout(()=>{
  //      this.file2 = good
  //    },100)
  //    // alert(events.target.files[0].length)
  // } 
  //  cobalagi(){
  //    this.parsing_gambar = this.file1
  //   alert(this.file1)
  //   alert(this.file2)
  //  }
}
