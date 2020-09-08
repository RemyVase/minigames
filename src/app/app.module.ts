import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './service/auth.service';
import { AuthGuardService } from './service/authGuard.service';
import { TicTacService } from './service/tictac.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './auth/signin/signin.component';
import { SignupComponent } from './auth/signup/signup.component';
import { HeaderComponent } from './header/header.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { RouterModule } from '@angular/router';
import { ListePartiesTictacComponent } from './liste-parties-tictac/liste-parties-tictac.component';
import { PenduComponent } from './pendu/pendu.component';
import { ListePartiesPenduComponent } from './liste-parties-pendu/liste-parties-pendu.component';
import { AjoutPartieTictacComponent } from './ajout-partie-tictac/ajout-partie-tictac.component';
import { TicTacPartyComponent } from './tic-tac-party/tic-tac-party.component';
import { PagePersoComponent } from './page-perso/page-perso.component';


const appRoutes = [
  { path: 'auth/signup', component: SignupComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'mainmenu', component: MainmenuComponent },
  { path: 'liste-parties-tictac', canActivate: [AuthGuardService], component: ListePartiesTictacComponent },
  { path: 'liste-parties-pendu', canActivate: [AuthGuardService], component: ListePartiesPenduComponent },
  { path: 'ajout-partie-tictac', canActivate: [AuthGuardService], component: AjoutPartieTictacComponent },
  { path: 'tic-tac-party/:id', canActivate: [AuthGuardService], component: TicTacPartyComponent},
  { path: 'page-perso', canActivate: [AuthGuardService], component: PagePersoComponent},
  { path: '', redirectTo: 'mainmenu', pathMatch: 'full' },
  { path: '**', redirectTo: 'mainmenu' }
]
@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HeaderComponent,
    MainmenuComponent,
    ListePartiesTictacComponent,
    PenduComponent,
    ListePartiesPenduComponent,
    AjoutPartieTictacComponent,
    TicTacPartyComponent,
    PagePersoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AuthService,
    AuthGuardService,
    TicTacService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
