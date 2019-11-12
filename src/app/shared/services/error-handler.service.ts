import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  public errorMessage: string = '';

  constructor(private router: Router) { }

  public handleError(error: HttpErrorResponse) {
    if(error.status === 500){
      this.handle500Error(error);
    }
  }

  private handle500Error(error: HttpErrorResponse){
    this.createErrorMessage(error);
    this.router.navigate(['/500']);
  }

  private createErrorMessage(error: HttpErrorResponse){
    this.errorMessage = error.error ? error.error : error.statusText;
  }
}
