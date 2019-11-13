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

class AnesthesiaOff {
  monday: number = 0;
  tuesday: number = 0;
  wednesday: number = 0;
  thursday: number = 0;
  friday: number = 0;
  saturday: number = 0;
  sunday: number = 0;
}

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})

export class DailyScheduleComponent implements OnInit {

  public locations: Location[];
  public schedules: Schedule[];
  public anesthesiaMessage: string = '';
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
    let apiAddress: string = `api/Schedules/{this.facilityID}/{this.weekdayNum}`;
    this.repository.getData(apiAddress)
      .subscribe((res: any) => {
        this.schedules = res.data as Schedule[];
        this.createMessage();
      },
      (error) => {
        this.errorHandler.handleError(error);
        this.errorMessage = this.errorHandler.errorMessage;
      })
  }

  private createMessage() {
    let anesthesiaList = this.schedules.filter(x => x.teammateType.trim().toLowerCase() === 'anesthesia');

    let anesthesiaOffList = new AnesthesiaOff();
    anesthesiaOffList.monday = anesthesiaList.filter(x => x.monday !== 'OFF').length;
    anesthesiaOffList.tuesday = anesthesiaList.filter(x => x.tuesday !== 'OFF').length;
    anesthesiaOffList.wednesday = anesthesiaList.filter(x => x.wednesday !== 'OFF').length;
    anesthesiaOffList.thursday = anesthesiaList.filter(x => x.thursday !== 'OFF').length;
    anesthesiaOffList.friday = anesthesiaList.filter(x => x.friday !== 'OFF').length;
    anesthesiaOffList.saturday = anesthesiaList.filter(x => x.saturday !== 'OFF').length;
    anesthesiaOffList.sunday = anesthesiaList.filter(x => x.sunday !== 'OFF').length;

    var message = '';
			
    message += this.showmessage('Monday', anesthesiaOffList.monday);
    message += this.showmessage('Tuesday', anesthesiaOffList.tuesday);
    message += this.showmessage('Wednesday', anesthesiaOffList.wednesday);
    message += this.showmessage('Thursday', anesthesiaOffList.thursday);
    message += this.showmessage('Friday', anesthesiaOffList.friday);
    message += this.showmessage('Saturday', anesthesiaOffList.saturday);

    this.anesthesiaMessage = message;
  }

  private showmessage(day: string, count: number) {
		if (count < 2)
		{
			return '<div>Not enough Anesthesiologists scheduled for ' + day + '</div>';
		}
		else
		{
			return '';
		}
	};

  private firstTimeSelecting() {
    // remove first select element
    var ls = document.getElementById("locSelect");
    var s = ls.firstChild;
    s.remove();

    this.isHidden = true;
  }
}
