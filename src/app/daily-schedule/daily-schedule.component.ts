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

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})

export class DailyScheduleComponent implements OnInit {

  public locations: Location[];
  public schedules: Schedule[];
  public errorMessage: string = '';
  public currentLocation: string = '';
  public facilityID: string = '';
  public weekdayNum: string = ''; 
  public isHidden: boolean = false; 

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
    let apiAddress: string = `api/Schedules/{this.facilityID}/{weekdayNum}`;
    this.repository.getData(apiAddress)
      .subscribe((res: any) => {
        this.schedules = res.data as Schedule[];
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }

  private firstTimeSelecting() {
    // remove first select element
    var ls = document.getElementById("locSelect");
    var s = ls.firstChild;
    s.remove();

    this.isHidden = true;
  }
}
