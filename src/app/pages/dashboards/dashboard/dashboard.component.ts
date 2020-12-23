import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { MethodServices } from 'src/services/method-services';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../../variables/charts";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html"
})
export class DashboardComponent implements OnInit {
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  checked_status:boolean = false;

  constructor(private methodServices:MethodServices) {}

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];

    var chartOrders = document.getElementById("chart-bars");

    parseOptions(Chart, chartOptions());

    var ordersChart = new Chart(chartOrders, {
      type: "bar",
      options: chartExample2.options,
      data: chartExample2.data
    });

    var chartSales = document.getElementById("chart-sales-dark");

    this.salesChart = new Chart(chartSales, {
      type: "line",
      options: chartExample1.options,
      data: chartExample1.data
    });
    this.updateOptions();
  }

  public updateOptions() {
    // this.salesChart.data.labels = ['AAA','BBB','CCC','DDD','EEE','FFF','GGG']
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }
}
