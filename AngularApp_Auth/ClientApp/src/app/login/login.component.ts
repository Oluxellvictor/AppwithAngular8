import { Component, OnInit } from '@angular/core';
import { AccountService} from '../services/account.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  insertForm : FormGroup;
  Username : FormControl;
  Password : FormControl;
  returnUrl : string;
  ErrorMessage : string;
  invalidLogin : boolean;

  constructor(private acct : AccountService,
              private router : Router,
              private route : ActivatedRoute,
              private fb : FormBuilder,
    ) { }

    onSubimt()
    {
      let userlogin = this.insertForm.value;

      this.acct.login(userlogin.Username,userlogin.Password).subscribe(result =>{

        let token = (<any>result).token;
       // console.log(token);
        console.log("User Logged In Successfully");
        this.invalidLogin = false;
        this.router.navigateByUrl(this.returnUrl);

      }, 
      error => {
        this.invalidLogin = true;
        this.ErrorMessage = "Invalid details Supplied - Could not log in";
      })
    }

  ngOnInit() {
  
    this.Username = new FormControl('', [Validators.required]);
    this.Password = new FormControl('', [Validators.required]);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.insertForm = this.fb.group({
      "Username" : this.Username,
      "Password" : this.Password
    });
  }

}