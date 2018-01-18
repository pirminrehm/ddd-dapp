import { LocationPoint } from './../../models/location-point';
import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges } from '@angular/core';

declare var google:any;

// TODO: More generic way to generate colors...
export const SLIDE_COLORS = ['#488aff', '#7babff', '#005afa', '#aecbff'];

/**
 * Generated class for the VotingChartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-voting-chart',
  templateUrl: 'voting-chart.html',
})
export class VotingChartPage implements OnInit, OnChanges {
  @ViewChild('pieChart') pieChart: ElementRef;
  @Input() locationPoints: LocationPoint[];
  @Input() displayLegend: Boolean;

  totalPoints: number = 0;
  ready = false;
  
  private chart: any;

  private readonly chartOptions = {
    pieHole: 0.4,
    fontSize: 14,
    chartArea:{left:0, right:0, top:20, bottom:20, width:'100%', height:'100%'},
    backgroundColor: 'transparent',
    legend: {position: 'none', textStyle: {color: 'white', fontSize: 15}},
    pieSliceText: 'value',
    pieSliceTextStyle: {color: 'white'}, 
    colors: ['#f53d3d', ...SLIDE_COLORS]
  };

  constructor() {}

  ngOnInit() {
    if(this.displayLegend) {
      this.chartOptions.legend.position = 'right';
      this.chartOptions.chartArea.right = 40;
      this.chartOptions.chartArea.width = '80%';
    }
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(() => {
      this.chart = new google.visualization.PieChart(this.pieChart.nativeElement);
      this.drawChart();
      this.ready = true;
    });
  }

  ngOnChanges() {
    this.drawChart();
  }

  drawChart() {
    if(!this.locationPoints || this.locationPoints.length <= 0 || !this.ready) {
      return;
    }

    this.totalPoints = this.locationPoints.reduce((sum, l) => sum + l.points, 0);

    let data = [
      ['Location', 'Voting points'], 
      ['Unassigned points', 100 - this.totalPoints], 
      ...this.locationPoints.map(lp => [lp.location.name, lp.points])
    ];
    data = google.visualization.arrayToDataTable(data);
    this.chart.draw(data, this.chartOptions);
    
    console.count('Google Chart drawn');
  }
}
