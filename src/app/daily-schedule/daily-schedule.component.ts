import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export class LocationResult {
  data: Location[];
}

export class Location {
  facilityId: string;
  facilityName: string;
}

export class ScheduleResult {
  data: Schedule[];
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

  
  public async getLocations(){
    try {
      let apiAddress: string = 'api/Locations';
      const res = await this.repository.getDataAsync<LocationResult>(apiAddress);
      this.locations = res.data;
    } catch (err) {
      this.errorHandler.handleError(err);
      this.errorMessage = this.errorHandler.errorMessage;
    }
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

  private async getSchedule() {
    try {
      let apiAddress: string = `api/Schedules/${this.facilityID}/${this.weekdayNum}`;
      const res = await this.repository.getDataAsync<ScheduleResult>(apiAddress);
      this.schedules = res.data;
    } catch (err) {
      this.errorHandler.handleError(err);
      this.errorMessage = this.errorHandler.errorMessage;
    }
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

    for(var d of dow) {
      let k: KVAnesthesiaOff = {key: this.capitalize(d), value: this.countOccurance(anesthesiaList, d, cond)};
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
    for (var d of data) {
      if (d[day].toLowerCase() !== cond.toLowerCase()) {
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
