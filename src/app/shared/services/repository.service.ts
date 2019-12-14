import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

    // Async

    public async getDataAsync<T>(route: string) {
        return await this.http.get<T>(this.createCompleteRoute(route, this.envUrl.urlAddress)).toPromise();
    }
    
    public async createAsync<T>(route: string, body) {
        return await this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders()).toPromise();
    }
     
    public async updateAsync<T>(route: string, body){
        return await this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders()).toPromise();
    }
     
    public async deleteAsync<T>(route: string){
        return await this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress)).toPromise();
    }

    // Regular 

    public getData(route: string) {
        return this.http.get(this.createCompleteRoute(route, this.envUrl.urlAddress));
    }

    public create(route: string, body) {
        return this.http.post(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
    }
     
    public update(route: string, body){
        return this.http.put(this.createCompleteRoute(route, this.envUrl.urlAddress), body, this.generateHeaders());
    }
     
    public delete(route: string){
        return this.http.delete(this.createCompleteRoute(route, this.envUrl.urlAddress));
    }

    private createCompleteRoute(route: string, envAddress: string) {
        return `${envAddress}/${route}`;
    }

    private generateHeaders() {
        return {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }
    }
}