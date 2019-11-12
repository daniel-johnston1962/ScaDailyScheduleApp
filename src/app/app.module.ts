import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InternalServerComponent } from './core/error-pages/internal-server/internal-server.component';
import { FooterComponent } from './core/footer/footer.component';
import { HeaderComponent } from './core/header/header.component';
import { NotfoundComponent } from './core/notfound/notfound.component';
import { HomeComponent } from './home/home.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';
import { EnvironmentUrlService } from './shared/services/environment-url.service';
import { RepositoryService } from './shared/services/repository.service';
import { ErrorHandlerService } from './shared/services/error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    InternalServerComponent,
    FooterComponent,
    HeaderComponent,
    NotfoundComponent,
    HomeComponent,
    DailyScheduleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    EnvironmentUrlService,
    RepositoryService,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
