import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseModel } from '../Models/AuthModel/responseModel';
import { UserService } from '../services/user.service';
import * as alertify from 'alertifyjs';


@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit {

  public updateForm = this.fb.group(
    {
      userName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['',[Validators.email, Validators.required]],
    })
  constructor(private fb: FormBuilder, private userService: UserService, private router: ActivatedRoute, private route: Router) { }

  ngOnInit(): void {
    this.getUserById()
  }
  getUserById(){
      this.userService.getUserById(this.router.snapshot.params["id"]).subscribe({next: (res: ResponseModel) => {
      this.updateForm.controls["fullName"].setValue(res.dataSet?.fullName);
      this.updateForm.controls["email"].setValue(res.dataSet?.email);
      this.updateForm.controls["userName"].setValue(res.dataSet?.userName);
    }, error: error => console.log(error)})
  }
  onSubmit(){
    let id = this.router.snapshot.params["id"];
    this.userService.updateUser(id, this.updateForm.value).subscribe({next: res => {
      this.route.navigate(["/userManagement"])
      alertify.success("Update user success")
    }, error: error => alertify.error("Update unsuccess")
  })
  }
  cancel() {
    this.route.navigate(["/userManagement"])
  }

}
