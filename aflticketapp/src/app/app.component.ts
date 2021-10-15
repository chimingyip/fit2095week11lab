import { Component } from '@angular/core';
import { io } from 'socket.io-client';
import { ChartType, ChartOptions } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip
} from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'aflticketapp';
  teamsObj: any = [];
  teamNames: any = [];
  teamCounts: any = [];
  socket: any;
  name: string = "";
  count: number = 0;
  total: number = 0;

  senderAlert: string = "";
  othersAlert: string = "";
  isSenderAlertDisplayed: boolean = false;
  isOthersAlertDisplayed: boolean = false;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  }
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['#F94144', '#F3722C', '#335c67', '#F9844A', '#90BE6D', '#43AA8B', '#577590', '#277DA1'],
    },
  ];
  public pieChartPlugins = [];

  constructor() {
    this.socket = io();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    //this.getChartData();

    this.socket.on("updatedTeams", (teams: any) => {
      console.log(teams)
      this.teamsObj = teams;
      this.extractData();
      this.getChartData();
    });

    this.socket.on("alert-sender", (data: string) => {
      console.log(data);
      this.senderAlert = data;
      this.isSenderAlertDisplayed = true;
    });
    
    this.socket.on("alert-others", (data: string) => {
      console.log(data);
      this.othersAlert = data;
      this.isOthersAlertDisplayed = true;
    });
  }
  
  extractData() {
    this.total = 0;
    for (let i = 0; i < this.teamsObj.teams.length; i++) {
      this.teamNames[i] = this.teamsObj.teams[i].name;
      this.teamCounts[i] = this.teamsObj.teams[i].count;
      this.total += this.teamsObj.teams[i].count;
    }
  }

  getChartData() {
    this.pieChartLabels = [];
    this.pieChartData  = [];

    for (let i = 0; i < this.teamsObj.teams.length; i++) {
      this.pieChartLabels.push(this.teamsObj.teams[i].name);
      this.pieChartData.push(this.teamsObj.teams[i].count)

    }
  }

  purchaseTickets() {
    let teamData = {
      name: this.name,
      count: this.count
    }
    this.socket.emit('purchase', teamData);
    this.resetValues();
  }

  resetValues() {
    this.name = "";
    this.count = 0;
    this.isSenderAlertDisplayed = false;
    this.isSenderAlertDisplayed = false;
  }
}
