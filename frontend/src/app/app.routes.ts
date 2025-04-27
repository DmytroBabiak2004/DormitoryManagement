import { Routes } from '@angular/router';
import { StudentsComponent } from './Components/student-components/student-page/students-page.component';
import { ChairsComponent } from './Components/chair-components/chair-page/chair-page.component';
import { TablesComponent } from './Components/table-components/table-page/table-page.component';
import { MattressesComponent } from './Components/mattress-components/mattress-page/mattress-page.component';
import { RegistrationsComponent } from './Components/registration-components/registration-page/registration-page.component';
import { RoomsComponent } from './Components/room-components/room-page/room-page.component';
import { ReportsComponent } from './Components/reports-page/reports-page.component';
import { ProfileComponent } from './Components/profile-components/profile-page/profile-page.component';
import { HomeComponent } from './Components/home-page/home-page.component';
import { AuthorizationComponent } from './Components/authorization/authorization.component';
import { FurnitureComponent } from './Components/FurnitureInRoom-components/furniture-in-room-page/furniture-in-room-page.component';
import {StudentsInRoomComponent} from './Components/StudentsInRoom-components/students-in-room-page/students-in-room-page.component';
import {RoomWithFreePlacesComponent} from './Components/RoomWithFreePlaces-components/room-with-free-places-page/room-with-free-places-page.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: AuthorizationComponent },  // додаємо маршрут для входу
  { path: 'students', component: StudentsComponent, canActivate: [AuthGuard] },
  { path: 'chairs', component: ChairsComponent, canActivate: [AuthGuard] },
  { path: 'tables', component: TablesComponent, canActivate: [AuthGuard] },
  { path: 'mattresses', component: MattressesComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'registrations', component: RegistrationsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'furniture-in-room', component: FurnitureComponent, canActivate: [AuthGuard] },
  { path: 'student-in-room', component: StudentsInRoomComponent, canActivate: [AuthGuard] },
  { path: 'room-with-free-places', component: RoomWithFreePlacesComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' }
];
