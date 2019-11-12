import { Component, OnInit, ViewChild, TemplateRef, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
//import { type } from 'os';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb : FormBuilder,
    private acct: AccountService,
    private router: Router,
    private modalService : BsModalService
  ) { }

        //Properties
        insertForm : FormGroup;
        username : FormControl;
        password : FormControl;
        cpassword : FormControl;
        email : FormControl;
        modalRef : BsModalRef;
        errorList: string[];
    @ViewChildren('template') modal : TemplateRef<any>;

    onSubmit()
    {
      let userDetails = this.insertForm.value;

      this.acct.register(userDetails.username, userDetails.password, userDetails.email).subscribe(result =>
        {
          
          this.router.navigate(['/login']);
        }), error =>
        {
          console.log(error);
        }

      this.modalRef = this.modalService.show(this.modal)
    }

    //Custom Validator

    Mustmatch(passwordControl : AbstractControl) : ValidatorFn
    {
       return (cpasswordControl : AbstractControl) : {[key : string] : Boolean} | null =>
       {
         //return null if controls haven't initialised yet
         if(!passwordControl.hasError && !cpasswordControl.hasError)
         {
           return null;
         }
         //return null if another validator has found an error on the matching control
         if(cpasswordControl.hasError && !passwordControl.hasError)
         {
            return null;
         }
         //set error on matchingControl if validation fails
         if(passwordControl.value != cpasswordControl.value)
         {
          return {'mustMatch' : true};
         }
         else
         {
           return null;
         }
       }
    }


  ngOnInit() {

    this.username = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]);
    this.password = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(5)]);
    this.cpassword = new FormControl('', [Validators.required, this.Mustmatch(this.password)]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.errorList = [];

    this.insertForm = this.fb.group({
      'username' : this.username,
      'password' : this.password,
      'cpassword' : this.cpassword,
      'email' : this.email
    });
  }
  
}
