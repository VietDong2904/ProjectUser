import { Component } from '@angular/core';
import { User } from './Models/user';
import * as alertify from 'alertifyjs';
import { Router } from '@angular/router';
import { UserService } from './services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public userDetails: User
  formValue !: FormGroup;
  constructor(private router: Router,private fb: FormBuilder, private userService: UserService){}
  ngOnInit(): void {
  }
  onLogout(){
    localStorage.removeItem("userInfo")
    this.router.navigate(["/login"])
    alertify.success("Log out success")
  }



  public addUserForm = this.fb.group(
    {
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['',[Validators.email, Validators.required]],
      password: ['', Validators.required]
    })

  addUser() {
    let fullName = this.addUserForm.controls["fullName"].value;
    let email = this.addUserForm.controls["email"].value;
    let username = this.addUserForm.controls["userName"].value;
    let password = this.addUserForm.controls["password"].value;
    this.userService.register(fullName, email, username, password).subscribe((data) => {
      alertify.success("Add user success");
      this.router.navigate(["/login"])
      let ref = document.getElementById('cancel');
      ref?.click();
      this.addUserForm.reset();
    }, (error) => {
      console.log("error ", error)
    });
  }

  get isUserLogin(){
    const user = localStorage.getItem("userInfo")
    return user && user.length > 0
  }

  get isHome(){
    const user = localStorage.getItem("userInfo")
    return user && user.length > 0
  }
}
