import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm = this.fb.group(
    {
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['',[Validators.email, Validators.required]],
      password: ['', Validators.required]
    })
  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    let fullName = this.registerForm.controls["fullName"].value;
    let email = this.registerForm.controls["email"].value;
    let username = this.registerForm.controls["userName"].value;
    let password = this.registerForm.controls["password"].value;
    this.userService.register(fullName, email, username, password).subscribe((data) => {
      this.router.navigate(["/login"])
      alertify.success("Register success, you can log in now!")
    }, (error) => {
      console.log("error ", error)
      alertify.error("Have something wrong");
      this.registerForm.reset();
    });
  }

}
