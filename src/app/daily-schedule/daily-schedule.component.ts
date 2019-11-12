import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../shared/services/repository.service';
import { ErrorHandlerService } from '../shared/services/error-handler.service';

export class Location {
  facilityId: string;
  facilityName: string;
}

// export class data {
//   location: Location[];
// }

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})

export class DailyScheduleComponent implements OnInit {

  public locations: Location[];
  public errorMessage: string = '';
  public currentLocation: string = '';
  public isHidden: boolean = false;
  public removeSelect: boolean = false; 

  constructor(private repository: RepositoryService, private errorHandler: ErrorHandlerService) { }

  ngOnInit() {
    this.getLocations();
  }

  
  public getLocations(){
    let apiAddress: string = "api/Locations";
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

    if (this.removeSelect === false) {
      this.removeSelectElement();
    }

    let fID = $event.target.value;
    this.isHidden = true;
    this.currentLocation = this.locations.find(x => x.facilityId == fID).facilityName;

  }

  private removeSelectElement() {
    var ls = document.getElementById("locSelect");
    var s = ls.firstChild;
    s.remove();
    this.removeSelect = true;
  }
}
