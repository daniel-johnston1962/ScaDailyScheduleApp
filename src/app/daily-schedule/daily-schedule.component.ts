import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export class Location {
  facilityId: string;
  facilityName: string;
}

export class Schedule {
  teammateName: string;
  teammateType: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export class KVAnesthesiaOff {
  key: string = '';
  value: number = 0;
}


@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})

export class DailyScheduleComponent implements OnInit {

  public locations: Location[];
  public schedules: Schedule[];
  public kvAnesthesiaOff: KVAnesthesiaOff[];
  public anesthesiaMessage: string = '';
  public errorMessage: string = '';
  public currentLocation: string = '';
  public facilityID: string = '';
  public weekdayNum: string = ''; 
  public isHidden: boolean = false; 
  public isWarningHidden: boolean = false;

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getLocations();
  }

  
  public getLocations(){
    let apiAddress: string = 'api/Locations';
    this.repository.getData(apiAddress)
      .subscribe((res: any) => {
        this.locations = res.data as Location[];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }


  public changeLocation($event) {

    if (this.isHidden === false) {
      this.firstTimeSelecting();
    }

    this.facilityID = $event.target.value;
    this.currentLocation = this.locations.find(x => x.facilityId === this.facilityID).facilityName;
    if (this.weekdayNum !== '') {
      this.getSchedule();
    }
  }

  public selectDate($event) {
    let d = new Date($event.target.value);
    this.weekdayNum = d.getUTCDay().toString();
    this.getSchedule();
  }

  private getSchedule() {
    let apiAddress: string = `api/Schedules/{this.facilityID}/{this.weekdayNum}`;
    this.repository.getData(apiAddress)
      .subscribe((res: any) => {
        this.schedules = res.data as Schedule[];
        this.isWarningHidden = false;
        this.createKVAList();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }

  private createKVAList() {
    let anesthesiaList = this.schedules.filter(x => x.teammateType.trim().toLowerCase() === 'anesthesia');

    var dow = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ];

    let kv: KVAnesthesiaOff[] = [];
    let cond: string = 'off'

    for(var i = 0; i < dow.length - 1; i++) {
      let k: KVAnesthesiaOff = {key: this.capitalize(dow[i]), value: this.countOccurance(anesthesiaList, dow[i], cond)};
      kv.push(k);
    }

    let kvf = kv.filter(x => x.value < 2);

    if (kvf.length > 0) {
      this.isWarningHidden = true;
    }

   this.kvAnesthesiaOff = kvf;
  }

  private capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  private countOccurance(data: Schedule[], day: string, cond: string) {
    var count = 0;
    for (var d in data) {
      if (data[d][day].toLowerCase() !== cond.toLowerCase()) {
        count++;
      }
    }
    return count;
  }

  private firstTimeSelecting() {
    // remove first select element
    var ls = document.getElementById("locSelect");
    var s = ls.firstChild;
    s.remove();

    this.isHidden = true;
  }
}
