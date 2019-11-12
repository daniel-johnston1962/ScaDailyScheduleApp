import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from './core/notfound/notfound.component';
import { InternalServerComponent  } from './core/error-pages/internal-server/internal-server.component';
import { HomeComponent } from './home/home.component';
import { DailyScheduleComponent } from './daily-schedule/daily-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'daily-schedule',
    component: DailyScheduleComponent
  },
  {
    path: '404', 
    component: NotfoundComponent
  },
  {
    path: '**',
    redirectTo: '/404'
  },
  {
    path: '500',
    component: InternalServerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
