import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  //head httpClient to communicate over Http with web Api
  constructor(private http : HttpClient, private router : Router) { }

  //Url to access our web Api's
  private baseUrlLogin : string = "/api/account/login";

  private baseUrlRegister : string = "/api/account/register";

  //Use related properties
  private loginStatus = new BehaviorSubject<boolean>(this.checkLoginStatus());
  private UserName = new BehaviorSubject<string>(localStorage.getItem('username'));
  private UserRole = new BehaviorSubject<string>(localStorage.getItem('userRole'));


  //register
  register(username: string, password: string, email: string )
  {
    return this.http.post<any>(this.baseUrlRegister, {username, password, email}).pipe(

      map(result => {
        //registration was successful
        return result;
      },error =>
      {
        return error;
      }
      ));
    
  }



  //Login method
  login(username: string, password: string)
  {
    return this.http.post<any>(this.baseUrlLogin, {username, password}).pipe(

      map(result => {

        //login successful if there is a jwt token in the  response
        if(result && result.token)
        {
          //store user details and jwt token in local storage to keep user logged in between page refreshes

          this.loginStatus.next(true);
          localStorage.setItem('loginStatus', '1');
          localStorage.setItem('jwt', result.token);
          localStorage.setItem('username', result.username);
          localStorage.setItem('expiration', result.expiration);
          localStorage.setItem('userRole', result.expiration);
        }

        return result;
      })

    );
  }

  logout()
  {
    //set loginstatus to false and delete saved jwt cookie
    this.loginStatus.next(false);
          localStorage.setItem('loginStatus', '0');
          localStorage.removeItem('jwt');
          localStorage.removeItem('username');
          localStorage.removeItem('expiration');
          localStorage.removeItem('userRole');
          this.router.navigate(['/login']);
          console.log("Logged Out Succesfully");
  }
  checkLoginStatus() : boolean
  {
    return false;
  }
  
  // loginstatus: boolean;


  get isLoggesIn()
  {
    return this.loginStatus.asObservable();
  }
  get currentUserName()
  {
    return this.UserName.asObservable();
  }
  get currentUserRole()
  {
    return this.UserRole.asObservable();
  }
}
