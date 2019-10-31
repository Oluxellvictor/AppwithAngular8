import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LoginComponent } from '../login/login.component';


@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //head httpClient to communicate over Http with web Api
  constructor(private http : HttpClient) { }

  //Url to access our web Api's
  private baseUrlLogin : string = "/api/account/login";

  //Use related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));


  //Login method
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe(

    );
  }
  checkLoginStatus() : boolean{
    return false;
  }
  // loginstatus: boolean;
}
