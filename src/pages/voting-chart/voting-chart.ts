import { LocationPoint } from './../../models/location-point';
import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';


import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';

declare var google:any;

// TODO: More generic way to generate colors...
export const PRIMARY_SLIDE_COLOR = '#630700';
export const SLIDE_COLORS = [
  '#3366CC',
  '#DC3912',
  '#FF9900',
  '#109618',
  '#990099',
  '#3B3EAC',
  '#0099C6',
  '#DD4477',
  '#66AA00',
  '#B82E2E',
  '#316395',
  '#994499',
  '#22AA99',
  '#AAAA11',
  '#6633CC',
  '#E67300',
  '#329262',
  '#5574A6',
  '#3B3EAC',
];

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
export class VotingChartPage implements OnInit {
  @ViewChild('pieChart') pieChart: ElementRef;
  @Input() locationPoints: LocationPoint[];
  @Input() displayLegend: Boolean;
  @Input() reload: Subject<any>;
  @Output() chartDrawn = new EventEmitter();

  private ready$: Promise<any>; 

  totalPoints: number = 0;
  
  private chart: any;

  private readonly chartOptions = {
    pieHole: 0.4,
    fontSize: 14,
    chartArea:{left:0, right:0, top:20, bottom:20, width:'100%', height:'100%'},
    backgroundColor: 'transparent',
    legend: {position: 'none', textStyle: {color: 'white', fontSize: 15}},
    pieSliceText: 'value',
    pieSliceTextStyle: {color: 'white'}, 
    colors: [PRIMARY_SLIDE_COLOR, ...SLIDE_COLORS]
  };

  constructor() {}

  ngOnInit() {
    if(this.displayLegend) {
      this.chartOptions.legend.position = 'right';
      this.chartOptions.chartArea.right = 10;
      this.chartOptions.chartArea.width = '100%';
    }
    this.ready$ = new Promise((resolve, reject) => {
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(() => {
        this.chart = new google.visualization.PieChart(this.pieChart.nativeElement);
        resolve();
      });
    });

    if(!this.reload) {
      this.reload = new Subject();
    }
    this.reload.debounceTime(200).subscribe(_ => this.drawChart());
  }

  ngAfterContentInit() {
    this.reload.next(true);
  }

  private async drawChart() {
    await this.ready$;
    
    if(!this.locationPoints) {
      return;
    }

    this.totalPoints = this.locationPoints.reduce((sum, l) => sum + l.points, 0);
    const unassignedPoints = this.totalPoints < 100 ? (100 - this.totalPoints) : 0;

    let data = [['Location', 'Voting points'],
                ['Unassigned points', unassignedPoints]];
    data.push(...this.locationPoints.map(lp => [lp.location.name, lp.points]));
    
    data = google.visualization.arrayToDataTable(data);
    this.chart.draw(data, this.chartOptions);

    this.chartDrawn.emit();
  }
}
