import Chart from "chart.js";
import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { renderDateCell, FillRenderer } from '@fullcalendar/core';
import { AlternativeComponent } from '../pages/dashboards/alternative/alternative.component';
import { DxiCenterComponent } from 'devextreme-angular/ui/nested';
import { preserveWhitespacesDefault } from '@angular/compiler';
import chart from "devextreme/viz/chart";
// import { renderDateCell } from '@fullcalendar/core';
//
// Chart extension for making the bars rounded
// Code from: https://codepen.io/jedtrow/full/ygRYgo
//

Chart.elements.Rectangle.prototype.draw = function() {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  // Set Radius Here
  // If radius is large enough to cause drawing errors a max radius is imposed
  var cornerRadius = 6;

  if (!vm.horizontal) {
    // bar
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || "bottom";
  } else {
    // horizontal bar
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || "left";
  }

  // Canvas doesn't allow us to stroke inside the width so we can
  // adjust the sizes to fit if we're setting a stroke on the line
  if (borderWidth) {
    // borderWidth shold be less than bar width and bar height.
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    // Adjust borderWidth when bar top position is near vm.base(zero).
    var borderLeft = left + (borderSkipped !== "left" ? halfStroke * signX : 0);
    var borderRight =
      right + (borderSkipped !== "right" ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== "top" ? halfStroke * signY : 0);
    var borderBottom =
      bottom + (borderSkipped !== "bottom" ? -halfStroke * signY : 0);
    // not become a vertical line?
    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    // not become a horizontal line?
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Corner points, from bottom-left to bottom-right clockwise
  // | 1 2 |
  // | 0 3 |
  var corners = [[left, bottom], [left, top], [right, top], [right, bottom]];

  // Find first (starting) corner with fallback to 'bottom'
  var borders = ["bottom", "left", "top", "right"];
  var startCorner = borders.indexOf(borderSkipped, 0);
  if (startCorner === -1) {
    startCorner = 0;
  }

  function cornerAt(index) {
    return corners[(startCorner + index) % 4];
  }

  // Draw rectangle from 'startCorner'
  var corner = cornerAt(0);
  ctx.moveTo(corner[0], corner[1]);

  for (var i = 1; i < 4; i++) {
    corner = cornerAt(i);
    let nextCornerId = i + 1;
    if (nextCornerId === 4) {
      nextCornerId = 0;
    }

    // let nextCorner = cornerAt(nextCornerId);

    let width = corners[2][0] - corners[1][0];
    let height = corners[0][1] - corners[1][1];
    let x = corners[1][0];
    let y = corners[1][1];
    // eslint-disable-next-line
    var radius: any = cornerRadius;

    // Fix radius being too large
    if (radius > height / 2) {
      radius = height / 2;
    }
    if (radius > width / 2) {
      radius = width / 2;
    }

    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  }

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

var mode = "light"; //(themeMode) ? themeMode : 'light';
var fonts = {
  base: "Open Sans"
};

// Colors
var colors = {
  gray: {
    100: "#f6f9fc",
    200: "#e9ecef",
    300: "#dee2e6",
    400: "#ced4da",
    500: "#adb5bd",
    600: "#8898aa",
    700: "#525f7f",
    800: "#32325d",
    900: "#212529"
  },
  theme: {
    default: "#172b4d",
    primary: "#5e72e4",
    secondary: "#f4f5f7",
    info: "#11cdef",
    success: "#2dce89",
    danger: "#f5365c",
    warning: "#fb6340"
  },
  black: "#12263F",
  white: "#FFFFFF",
  transparent: "transparent"
};

export function chartOptions() {
  // Options
  var options = {
    defaults: {
      global: {
        responsive: true,
        maintainAspectRatio: false,
        defaultColor: mode == "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontColor: mode == "dark" ? colors.gray[700] : colors.gray[600],
        defaultFontFamily: fonts.base,
        defaultFontSize: 13,
        layout: {
          padding: 0
        },
        legend: {
          display: false,
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 16
          }
        },
        elements: {
          point: {
            radius: 0,
            backgroundColor: colors.theme["primary"]
          },
          line: {
            tension: 0.4,
            borderWidth: 4,
            borderColor: colors.theme["primary"],
            backgroundColor: colors.transparent,
            borderCapStyle: "rounded"
          },
          rectangle: {
            backgroundColor: colors.theme["warning"]
          },
          arc: {
            backgroundColor: colors.theme["primary"],
            borderColor: mode == "dark" ? colors.gray[800] : colors.white,
            borderWidth: 4
          }
        },
        tooltips: {
          enabled: true,
          mode: "index",
          intersect: false
        }
      },
      doughnut: {
        cutoutPercentage: 83,
        legendCallback: function(chart) {
          var data = chart.data;
          var content = "";

          data.labels.forEach(function(label, index) {
            var bgColor = data.datasets[0].backgroundColor[index];

            content += '<span class="chart-legend-item">';
            content +=
              '<i class="chart-legend-indicator" style="background-color: ' +
              bgColor +
              '"></i>';
            content += label;
            content += "</span>";
          });

          return content;
        }
      }
    }
  };

  // yAxes
  Chart.scaleService.updateScaleDefaults("linear", {
    gridLines: {
      borderDash: [2],
      borderDashOffset: [2],
      color: mode == "dark" ? colors.gray[900] : colors.gray[300],
      drawBorder: false,
      drawTicks: false,
      lineWidth: 0,
      zeroLineWidth: 0,
      zeroLineColor: mode == "dark" ? colors.gray[900] : colors.gray[300],
      zeroLineBorderDash: [2],
      zeroLineBorderDashOffset: [2]
    },
    ticks: {
      beginAtZero: true,
      padding: 10,
      callback: function(value) {
        if (!(value % 10)) {
          return value;
        }
      }
    }
  });

  // xAxes
  Chart.scaleService.updateScaleDefaults("category", {
    gridLines: {
      drawBorder: false,
      drawOnChartArea: false,
      drawTicks: false
    },
    ticks: {
      padding: 20
    },
    maxBarThickness: 10
  });

  return options;
}

export const parseOptions = (parent, options) => {
  for (var item in options) {
    if (typeof options[item] !== "object") {
      parent[item] = options[item];
    } else {
      parseOptions(parent[item], options[item]);
    }
  }
};


export const chartExample1 = {    //Gender
  options: {
    
  //   legendCallback: function(chart) {
  //     var ul = document.createElement('ul');
  //     var borderColor = chart.data.datasets[0].borderColor;
  //     chart.data.labels.forEach(function(label, index) {
  //        ul.innerHTML += `
  //          <li>
  //              <span style="background-color: ${borderColor[index]}"></span>
  //              ${label}
  //           </li>
  //        `; // ^ ES6 Template String
  //     });
  //     return ul.outerHTML;
  //  },
    maintainAspectRatio: false,
    hover:{animationDuration:0},
    tooltips: {
        // mode:'dataset',
        enabled:false,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfec',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        // mode:'point' //point,index,x,y,dataset,nearest
    },
    legend: {
        display: false,
        labels:{
          fontColor:'#FFFFFF',
        },
        position:'bottom'
    },
    legendCallback : (chart) => {
      const renderLabels = (chart) => {
        const {data} = chart;
        return data.datasets[0].data
            .map(
                (_, i) =>
                    `<div class="col-6">
                  <div id="legend-${i}-item" class="legend-item" style="cursor: pointer; display: flex; align-items: center;">
                    <span style="display: inline-block;background-color:
                      ${data.datasets[0].backgroundColor[i]}; border-radius: 1.25rem;width: 15px; height: 15px;">
                    </span>
                    ${
                        data.labels[i] &&
                        `<span class="label text-white" style="padding-left: 5px; font-size: 12.8px;">${data.labels[i]}</span>`
                    }
                  </div>
              </div>
            `
            )
            .join("");
      };
      return `
        <div class="row chartjs-legend">
          ${renderLabels(chart)}
        </div>`;
    },
    cutoutPercentage: 0,
    // events: false, 
    animation: {
      // animateScale:false,
      duration: 500,
      // easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var labelss=[];
        this.data.labels.forEach(function(label){
            labelss.push(label)
        })

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = 'black';
            ctx.font = "bold 15px Verdana";
            // ctx.fill();
            // ctx.lineWidth = 5;
            // ctx.strokeStyle = 'blue';
            // ctx.stroke();
            // ctx.fillStyle = 'blue';
            // ctx.fillText("Text", x , y );


            if (i == 3){ // Darker text color for lighter background
              ctx.fillStyle = '#444';
            }
            // ctx.globalAlpha = 0.2;
            // ctx.fillStyle = "blue"; 
            // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
            // ctx.globalAlpha = 1;
            // ctx.fillStyle = "darkslategrey";
            var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
            //Don't Display If Legend is hide or value is 0
            // if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              // ctx.fillText(labelss[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
            if (dataset._meta[Object.keys(dataset._meta)[0]].data[i].hidden != true)
            {  
              ctx.fillText(percent, model.x + x, model.y + y + 25);
            }
            // }
          }
        });               
      }
    }
    // scales: {
    //   yAxes: [
    //     {
    //       gridLines: {
    //         color: colors.gray[900],
    //         zeroLineColor: colors.gray[900]
    //       },
    //       ticks: {
    //         callback: function(value) {
    //           if (!(value % 10)) {
    //             // return "$" + value + "k";
    //           }
    //         }
    //       }
    //     }
    //   ]
    // }
  },
  data: {
    labels: ["May", "Jun"],
    datasets: [
      {
        // borderWidth: 1,
        label: "Performance",
        // data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        data: [0, 20],
        borderWidth:0,
        backgroundColor:['gold','dodgerblue']
      }
    ]
  },
}

  export const chartExampleReligion = {
    options: {
      maintainAspectRatio: false,
      hover:{animationDuration:0},
      tooltips: {
          // callbacks: {
          //   label: (tooltipItem, data) => {
          //     const label = data.labels[tooltipItem.index];
          //     const val =
          //       data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          //     return label + ": " + val + "%";
          //   }
          // },
          mode:'dataset',
          enabled:false,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfec',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
      },
      legend: {
          display: false,
          labels:{
            fontColor:'#FFFFFF'
          },
          position:'bottom'
      },
      legendCallback : (chart) => {
        const renderLabels = (chart) => {
          const {data} = chart;
          return data.datasets[0].data
              .map(
                  (_, i) =>
                      `<div class="col-6">
                  <div id="legend-${i}-item" class="legend-item" style="cursor: pointer; display: flex; align-items: center;">
                    <span style="display: inline-block;background-color:
                      ${data.datasets[0].backgroundColor[i]}; border-radius: 1.25rem;width: 15px; height: 15px;">
                    </span>
                    ${
                          data.labels[i] &&
                          `<span class="label text-white" style="padding-left: 5px; font-size: 12.8px;">${data.labels[i]}</span>`
                      }
                  </div>
              </div>
            `
              )
              .join("");
        };
        return `
        <div class="row chartjs-legend">
          ${renderLabels(chart)}
        </div>`;
      },
      cutoutPercentage: 0,
      animation: {
        duration: 500,
        easing: "easeOutQuart",
        onComplete: function () {
          var ctx = this.chart.ctx;
          ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
  
          var labels=[];
          this.data.labels.forEach(function(label){
              labels.push(label)
          })

          this.data.datasets.forEach(function (dataset) {
            for (var i = 0; i < dataset.data.length; i++) {
              var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                  total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                  mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                  start_angle = model.startAngle,
                  end_angle = model.endAngle,
                  mid_angle = start_angle + (end_angle - start_angle)/2;
  
              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);
  
              ctx.fillStyle = 'black';
              ctx.font = "bold 13px Arial";
              // ctx.fill();
              // ctx.lineWidth = 5;
              // ctx.strokeStyle = 'blue';
              // ctx.stroke();
              // ctx.fillStyle = 'blue';
              // ctx.fillText("Text", x , y );
  
  
              if (i == 3){ // Darker text color for lighter background
                ctx.fillStyle = '#444';
              }
              // ctx.globalAlpha = 0.2;
              // ctx.fillStyle = "blue"; 
              // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
              // ctx.globalAlpha = 1;
              // ctx.fillStyle = "darkslategrey";
              var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
              //Don't Display If Legend is hide or value is 0
              
              // if(dataset.data[i] !== 0 && dataset._meta[0].data[i].hidden !== true) { //prev

              // if(dataset._meta[0].data[i].hidden !== true) {
                // ctx.fillText(labels[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
                // Display percent in another line, line break doesn't work for fillText

              if(dataset._meta[Object.keys(dataset._meta)[0]].data[i].hidden != true)
              {  
                ctx.fillText(percent, model.x + x + 5, model.y + y);
              }
              // }
            }
          });               
        }
      }
      // scales: {
      //   yAxes: [
      //     {
      //       gridLines: {
      //         color: colors.gray[900],
      //         zeroLineColor: colors.gray[900]
      //       },
      //       ticks: {
      //         callback: function(value) {
      //           if (!(value % 10)) {
      //             // return "$" + value + "k";
      //           }
      //         }
      //       }
      //     }
      //   ]
      // }
    },
    data: {
      labels: ["May", "Jun"],
      datasets: [
        {
          label: "Performance",
          data: [30, 20],
          borderWidth:0,
          backgroundColor:['burlywood','brown','darkcyan','tomato']
        }
      ]
    },
  }
  
  export const chartExampleEmpType = {
    options: {
      maintainAspectRatio: false,
      hover:{animationDuration:0},
      tooltips: {
          enabled:false,
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "  #858796",
          borderColor: '#dddfec',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          mode:null
      },
      legend: {
          display: false,
          labels:{
            fontColor:'#FFFFFF',           
          },
          position:'bottom',
          // onClick: (e)=> e.stopPropagation()
          // onClick: function(e, legendItem) {
          //   let arc = this.chart.getDatasetMeta(0).data[legendItem.index];
          //   arc.hidden = !arc.hidden ? true : false;
          //   this.chartExampleEmpType.update();
          // },
      },
      legendCallback : (chart) => {
        const renderLabels = (chart) => {
          const {data} = chart;
          return data.datasets[0].data
              .map(
                  (_, i) =>
                      `<div class="col-6">
                  <div id="legend-${i}-item" class="legend-item" style="cursor: pointer; display: flex; align-items: center;">
                    <span style="display: inline-block;background-color:
                      ${data.datasets[0].backgroundColor[i]}; border-radius: 1.25rem;width: 15px; height: 15px;">
                    </span>
                    ${
                          data.labels[i] &&
                          `<span class="label text-white" style="padding-left: 5px; font-size: 12.8px;">${data.labels[i]}</span>`
                      }
                  </div>
              </div>
            `
              )
              .join("");
        };
        return `
        <div class="row chartjs-legend">
          ${renderLabels(chart)}
        </div>`;
      },
      cutoutPercentage: 0,
      animation: {
        duration: 500,
        easing: "easeOutQuart",
        animationEnabled:true,
        onComplete:function(){
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
    
            var labels=[];
            this.data.labels.forEach(function(label){
                labels.push(label)
            })

            this.data.datasets.forEach(function(dataset) {
              for (var i = 0; i < dataset.data.length; i++) {
                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                    total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                    mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                    start_angle = model.startAngle,
                    end_angle = model.endAngle,
                    mid_angle = start_angle + (end_angle - start_angle)/2;
                
              
                var x = mid_radius * Math.cos(mid_angle);
                var y = mid_radius * Math.sin(mid_angle);

                ctx.fillStyle = 'black';
                ctx.font = "bold 15px Verdana";
                // ctx.fill();
                // ctx.lineWidth = 0;
                // ctx.strokeStyle = 'blue';
                // ctx.stroke();
                // ctx.fillStyle = 'blue';
                // ctx.fillText("Text", x , y );
    
    
                if (i == 3){ // Darker text color for lighter background
                  ctx.fillStyle = '#444';
                }
                // ctx.globalAlpha = 0.2;
                // ctx.fillStyle = "blue"; 
                // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
                // ctx.globalAlpha = 1;
                // ctx.fillStyle = "darkslategrey";
                var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
                
                //Don't Display If Legend is hide or value is 0
                // var angka = dataset.data[i]
                // if (angka >= 0.1 && angka !== null)
                // {
                //   alert('Dataset')
                // }
                // else
                // {
                //   alert('Dataset Others')
                // }

                  // if(dataset._meta[0].data[i].hidden !== true) {
                    // ctx.fillText(labels[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
                    // Display percent in another line, line break doesn't work for fillText
                   if(dataset._meta[Object.keys(dataset._meta)[0]].data[i].hidden != true)
                   {
                    ctx.fillText(percent, model.x + x, model.y + y + 25);
                   }
                  // }
              }
            });         
          },
      }
      // scales: {
      //   yAxes: [
      //     {
      //       gridLines: {
      //         color: colors.gray[900],
      //         zeroLineColor: colors.gray[900]
      //       },
      //       ticks: {
      //         callback: function(value) {
      //           if (!(value % 10)) {
      //             // return "$" + value + "k";
      //           }
      //         }
      //       }
      //     }
      //   ]
      // }
    },
    data: {
      labels: ["May", "Jun"],
      datasets: [
        {
          label: "Performance",
          borderWidth:0,
          data: [10, 20, 10, 30, 15, 40, 20, 60, 60],
          backgroundColor:['seagreen','lightsalmon','khaki','darkviolet','deeppink','firebrick']
        }
      ],
    },
  }

export const chartExample2 = {
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function(value) {
              if (!(value % 10)) {
                //return '$' + value + 'k'
                return value;
              }
            }
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: function(item, data) {
          var label = data.datasets[item.datasetIndex].label || "";
          var yLabel = item.yLabel;
          var content = "";
          if (data.datasets.length > 1) {
            content += label;
          }
          content += yLabel;
          return content;
        }
      }
    }
  },
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29]
      }
    ]
  }
}

export const chartExample3 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900]
          },
          ticks: {
            callback: function(value) {
              if (!(value % 10)) {
                return value;
              }
            }
          }
        }
      ]
    }
  },
  data: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60]
      }
    ]
  }
};

export const chartExampleEmpage = {
  options: {
    maintainAspectRatio: false,
    hover:{animationDuration:0},
    tooltips: {
        mode:'dataset',
        enabled:false,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfec',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
    },
    scales: {
      yAxes:[{
        ticks: {
          fontColor:'white',
          fontSize:12,
          // stepSize:3,
          beginAtZero:true,
        },
        gridLines:{
          display:true,
          drawBorder:true,
          lineWidth:0.5,
          color:'lightslategrey'
        }
      }],
      xAxes:[{
        ticks:{
          fontColor:'white'
        },
        gridLines:{
          display:true,
          drawBorder:true,
          lineWidth:0.5,
          color:'lightslategrey'
        }
      }],
    },
    legend: {
        display: false,
        labels:{
          fontColor:'#FFFFFF'
        },
        position:'bottom'
    },
    cutoutPercentage: 0,
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var labels=[];
        this.data.labels.forEach(function(label){
            labels.push(label)
        })

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            ctx.fillStyle = '#fff';
            ctx.font = "15px Verdana";
            var y_pos = model.y - 5;
            // Make sure data value does not get overflown and hidden
            // when the bar's value is too close to max value of scale
            // Note: The y value is reverse, it counts from top down
            if ((total - model.y) / total >= 0.93)
                y_pos = model.y + 20; 
            ctx.fillText(dataset.data[i], model.x, y_pos);
            
            // ctx.fill();
            // ctx.lineWidth = 0;
            // ctx.strokeStyle = 'blue';
            // ctx.stroke();
            // ctx.fillStyle = 'blue';
            // ctx.fillText("Text", x , y );


            // if (i == 3){ // Darker text color for lighter background
            //   ctx.fillStyle = '#444';
            // }
            // ctx.globalAlpha = 0.2;
            // ctx.fillStyle = "blue"; 
            // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
            // ctx.globalAlpha = 1;
            // ctx.fillStyle = "darkslategrey";
            // var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
            //Don't Display If Legend is hide or value is 0
            // if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              // ctx.fillText(labels[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
              // ctx.fillText(percent, model.x + x, model.y + y + 25);
            // } 
          }
        });               
      }
    }
  },
  data: {
    labels: ["<20", "21-30","31-40","41-50",">51"],
    datasets: [
      {
        label: "Employee Age",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        backgroundColor:['steelblue','indianred','palegreen','mediumpurple','cornflowerblue','darksalmon']
      }
    ]
  },
}


function randomScalingFactor() {
  return Math.round(Math.random() * 100);
}

// Charts page

export const chartBarStackedData = {
  options: {
    tooltips: {
      mode: "index",
      intersect: false
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  },
  data: {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Dataset 1",
        backgroundColor: colors.theme["danger"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      },
      {
        label: "Dataset 2",
        backgroundColor: colors.theme["primary"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      },
      {
        label: "Dataset 3",
        backgroundColor: colors.theme["success"],
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ]
      }
    ]
  }
};

export const chartDoughnutData = {
  data: {
    labels: ["Danger", "Warning", "Success", "Primary", "Info"],
    datasets: [
      {
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ],
        backgroundColor: [
          colors.theme["danger"],
          colors.theme["warning"],
          colors.theme["success"],
          colors.theme["primary"],
          colors.theme["info"]
        ],
        label: "Dataset 1"
      }
    ]
  },
  options: {
    responsive: true,
    legend: {
      position: "top"
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
};

export const chartPieData = {
  data: {
    labels: ["Danger", "Warning", "Success", "Primary", "Info"],
    datasets: [
      {
        data: [
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor(),
          randomScalingFactor()
        ],
        backgroundColor: [
          colors.theme["danger"],
          colors.theme["warning"],
          colors.theme["success"],
          colors.theme["primary"],
          colors.theme["info"]
        ],
        label: "Dataset 1"
      }
    ]
  },
  options: {
    responsive: true,
    legend: {
      position: "top"
    },
    animation: {
      animateScale: true,
      animateRotate: true
    }
  }
};

export const chartPointsData = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200]
          },
          ticks: {
          }
        }
      ]
    }
  },
  data: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [10, 18, 28, 23, 28, 40, 36, 46, 52],
        pointRadius: 10,
        pointHoverRadius: 15,
        showLine: false
      }
    ]
  }
};

export const chartSalesData = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[200],
            zeroLineColor: colors.gray[200]
          },
          ticks: {}
        }
      ]
    }
  },
  data: {
    labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Performance",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60]
      }
    ]
  }
};

export const chartBarsData = {
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [25, 20, 30, 22, 17, 29]
      }
    ]
  }
};


export const chartTodayCheckIn = {    //Today Check In
  options: {
    
  //   legendCallback: function(chart) {
  //     var ul = document.createElement('ul');
  //     var borderColor = chart.data.datasets[0].borderColor;
  //     chart.data.labels.forEach(function(label, index) {
  //        ul.innerHTML += `
  //          <li>
  //              <span style="background-color: ${borderColor[index]}"></span>
  //              ${label}
  //           </li>
  //        `; // ^ ES6 Template String
  //     });
  //     return ul.outerHTML;
  //  },
    maintainAspectRatio: false,
    hover:{animationDuration:0},
    tooltips: {
        enabled:false,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfec',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        // mode:'point' //point,index,x,y,dataset,nearest
    },
    legend: {
        display: true,
        labels:{
          fontColor:'#FFFFFF',
        },
        position:'bottom'
    },
    cutoutPercentage: 0,
    // events: false, 
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var labelss=[];
        this.data.labels.forEach(function(label){
            labelss.push(label)
        })

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            var x = mid_radius * Math.cos(mid_angle);
            var y = mid_radius * Math.sin(mid_angle);

            ctx.fillStyle = 'black';
            ctx.font = "bold 15px Verdana";
            // ctx.fill();
            // ctx.lineWidth = 5;
            // ctx.strokeStyle = 'blue';
            // ctx.stroke();
            // ctx.fillStyle = 'blue';
            // ctx.fillText("Text", x , y );


            if (i == 3){ // Darker text color for lighter background
              ctx.fillStyle = '#444';
            }
            // ctx.globalAlpha = 0.2;
            // ctx.fillStyle = "blue"; 
            // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
            // ctx.globalAlpha = 1;
            // ctx.fillStyle = "darkslategrey";
            var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
            //Don't Display If Legend is hide or value is 0
            // if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              // ctx.fillText(labelss[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
            if (dataset._meta[Object.keys(dataset._meta)[0]].data[i].hidden != true)
            {  
              ctx.fillText(percent, model.x + x, model.y + y + 25);
            }
            // }
          }
        });               
      }
    }
    // scales: {
    //   yAxes: [
    //     {
    //       gridLines: {
    //         color: colors.gray[900],
    //         zeroLineColor: colors.gray[900]
    //       },
    //       ticks: {
    //         callback: function(value) {
    //           if (!(value % 10)) {
    //             // return "$" + value + "k";
    //           }
    //         }
    //       }
    //     }
    //   ]
    // }
  },
  data: {
    labels: ["May", "Jun"],
    datasets: [
      {
        // borderWidth: 1,
        label: "Performance",
        // data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        data: [0, 20],
        borderWidth:0,
        backgroundColor:['gold','dodgerblue']
      }
    ]
  },
}

//Payroll
export const chartPayroll = {
  options: {
    responsive:true,
    maintainAspectRatio:false,
    elements: {
      point: {
        radius: 0.4,
        // backgroundColor: colors.theme["primary"]
        backgroundColor:'orange'
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
        // borderColor: colors.theme["primary"],
        borderColor:'orange',
        backgroundColor: colors.transparent,
        borderCapStyle: "rounded"
      },
      rectangle: {
        backgroundColor: colors.theme["warning"]
      },
      arc: {
        backgroundColor: colors.theme["primary"],
        // borderColor: mode == "dark" ? colors.gray[800] : colors.white,
        borderColor:'white',
        borderWidth: 4
      }
    },
    tooltips: {
        enabled:true,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfec',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: true,
        caretPadding: 10,
    },
    scales: {
      yAxes:[{
        ticks: {
          fontColor:'white',
          fontSize:12,
          // stepSize:3,
          beginAtZero:false,
        },
        gridLines:{
          display:true,
          color: colors.gray[700],
          zeroLineColor: colors.gray[200]
        }
      }],
      xAxes:[{
        ticks: {
          fontColor:'white',
          fontSize:12,
          // stepSize:3,
          beginAtZero:false,
        },
        gridLines:{
          display:true,
          color: colors.gray[700],
          zeroLineColor: colors.gray[200]
        }
      }
    ]
    },
    legend: {
        display: false,
        labels:{
          fontColor:'#FFFFFF',
        },
        position:'bottom',
    },
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var labels=[];
        this.data.labels.forEach(function(label){
            labels.push(label)
        })

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            ctx.fillStyle = '#fff';
            ctx.font = "15px Verdana";
            var y_pos = model.y - 5;
            // Make sure data value does not get overflown and hidden
            // when the bar's value is too close to max value of scale
            // Note: The y value is reverse, it counts from top down
            if ((total - model.y) / total >= 0.93)
                y_pos = model.y + 20; 
            // ctx.fillText(dataset.data[i], model.x, y_pos);
            

            // ctx.fill();
            // ctx.lineWidth = 0;
            // ctx.strokeStyle = 'blue';
            // ctx.stroke();
            // ctx.fillStyle = 'blue';
            // ctx.fillText("Text", x , y );


            // if (i == 3){ // Darker text color for lighter background
            //   ctx.fillStyle = '#444';
            // }
            // ctx.globalAlpha = 0.2;
            // ctx.fillStyle = "blue"; 
            // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
            // ctx.globalAlpha = 1;
            // ctx.fillStyle = "darkslategrey";
            // var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
            //Don't Display If Legend is hide or value is 0
            // if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              // ctx.fillText(labels[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
              // ctx.fillText(percent, model.x + x, model.y + y + 25);
            // } 
          }
        });               
      }
    }
  },
  data: {
    labels: ["Jan", "Feb","Mar","Apr","May"],
    datasets: [
      {
        label: "Payroll",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: true
      }
    ]
  },
}

//Tax
export const chartTax = {
  options: {
    responsive:true,
    maintainAspectRatio:false,
    elements: {
      point: {
        radius: 0.4,
        // backgroundColor: colors.theme["primary"]
        backgroundColor:'orange'
      },
      line: {
        tension: 0.4,
        borderWidth: 2,
        // borderColor: colors.theme["primary"],
        borderColor:'orange',
        backgroundColor: colors.transparent,
        borderCapStyle: "rounded"
      },
      rectangle: {
        backgroundColor: colors.theme["warning"]
      },
      arc: {
        backgroundColor: colors.theme["primary"],
        // borderColor: mode == "dark" ? colors.gray[800] : colors.white,
        borderColor:'white',
        borderWidth: 4
      }
    },
    tooltips: {
        enabled:true,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfec',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: true,
        caretPadding: 10,
    },
    scales: {
      yAxes:[{
        ticks: {
          fontColor:'white',
          fontSize:12,
          // stepSize:3,
          beginAtZero:false,
        },
        gridLines:{
          display:true,
          color: colors.gray[700],
          zeroLineColor: colors.gray[200]
        }
      }],
      xAxes:[{
        ticks: {
          fontColor:'white',
          fontSize:12,
          // stepSize:3,
          beginAtZero:false,
        },
        gridLines:{
          display:true,
          color: colors.gray[700],
          zeroLineColor: colors.gray[200]
        }
      }
    ]
    },
    legend: {
        display: false,
        labels:{
          fontColor:'#FFFFFF',
        },
        position:'bottom',
    },
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        var labels=[];
        this.data.labels.forEach(function(label){
            labels.push(label)
        })

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius)/2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle)/2;

            ctx.fillStyle = '#fff';
            ctx.font = "15px Verdana";
            var y_pos = model.y - 5;
            // Make sure data value does not get overflown and hidden
            // when the bar's value is too close to max value of scale
            // Note: The y value is reverse, it counts from top down
            if ((total - model.y) / total >= 0.93)
                y_pos = model.y + 20; 
            // ctx.fillText(dataset.data[i], model.x, y_pos);
            

            // ctx.fill();
            // ctx.lineWidth = 0;
            // ctx.strokeStyle = 'blue';
            // ctx.stroke();
            // ctx.fillStyle = 'blue';
            // ctx.fillText("Text", x , y );


            // if (i == 3){ // Darker text color for lighter background
            //   ctx.fillStyle = '#444';
            // }
            // ctx.globalAlpha = 0.2;
            // ctx.fillStyle = "blue"; 
            // ctx.fillRect(model.x + x - 40, model.y + y - 20, 100, 50); 
            // ctx.globalAlpha = 1;
            // ctx.fillStyle = "darkslategrey";
            // var percent = String(Math.round(dataset.data[i]/total*100)) + "%";      
            //Don't Display If Legend is hide or value is 0
            // if(dataset.data[i] != 0 && dataset._meta[0].data[i].hidden != true) {
              // ctx.fillText(labels[i] + ': ' + dataset.data[i], model.x + x, model.y + y);
              // Display percent in another line, line break doesn't work for fillText
              // ctx.fillText(percent, model.x + x, model.y + y + 25);
            // } 
          }
        });               
      }
    }
  },
  data: {
    labels: ["Jan", "Feb","Mar","Apr","May"],
    datasets: [
      {
        label: "Payroll",
        data: [0, 20, 10, 30, 15, 40, 20, 60, 60],
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: true
      }
    ]
  },
}

export const bindChartEvents = (myChart, containerElement) => {
  const legendItemSelector = ".legend-item";
  const labelSeletor = ".label";

  const legendItems = [
    ...containerElement.querySelectorAll(legendItemSelector)
  ];
  legendItems.forEach((item, i) => {
    item.addEventListener("click", (e) =>
        updateDataset(e.target.parentNode, i)
    );
  });

  const updateDataset = (currentEl, index) => {
    const meta = myChart.getDatasetMeta(0);
    const labelEl = currentEl.querySelector(labelSeletor);
    const result = meta.data[index].hidden === true ? false : true;
    if (result === true) {
      meta.data[index].hidden = true;
      labelEl.style.textDecoration = "line-through";
    } else {
      labelEl.style.textDecoration = "none";
      meta.data[index].hidden = false;
    }
    myChart.update();
  };
};


