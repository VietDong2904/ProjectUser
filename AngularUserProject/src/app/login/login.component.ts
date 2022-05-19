import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseModel } from '../Models/AuthModel/responseModel';
import { UserService } from '../services/user.service';
import * as alertify from 'alertifyjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor( private fb: FormBuilder,private userService: UserService, private router: Router){}

  public loginForm = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  })
  ngOnInit(): void {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if(userInfo?.token!=null) {
      this.router.navigateByUrl("/userManagement")
    }
  }

  onSubmit() {
    let username = this.loginForm.controls["userName"].value;
    let password = this.loginForm.controls["password"].value;
    this.userService.login(username,password).subscribe({
      next: (data: ResponseModel)=> {
        if(data.responseCode ==1) {
          localStorage.setItem("userInfo", JSON.stringify(data.dataSet));
          this.router.navigate(["/userManagement"]);
          alertify.success("Login Success");
        }
      },error: error => {
        alertify.error("Username or password is incorrected");
      }
    })
  }

}
