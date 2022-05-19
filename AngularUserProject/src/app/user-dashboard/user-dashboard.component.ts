import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as alertify from 'alertifyjs'
import { User } from '../Models/user';
import { UserService } from '../services/user.service';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  POSTS: any;
  page: number = 1;
  count: number = 0;
  tableSize: number =  5;
  tableSizes: any = [5, 10, 15, 20];
  public userList: User[] = [];
  public UserSearch: User[] = [];
  isSearch: boolean = false;
  isData: boolean = false;
  constructor(private userService: UserService, private router: Router, private fb: FormBuilder, private _cdf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getAllUser();
  }

  public searchForm = this.fb.group({
    userName: ['',Validators.required]
  })

  search() {
    this.isSearch = true;
    this.getAllUser();
  }

  get() {
    if(this.isSearch){
      let username  = this.searchForm.controls["userName"].value;
      if(username) {
        this.userService.getUserByUsername(username).subscribe((data: any) => {
          this.UserSearch = data;
          console.log(data);
        })
      }
      else {
        this.isSearch = false;
      }
    }
  }
  // if(this.isSearch) {
  //   let username = this.searchForm.controls["userName"].value;
  //   if(username) {

  //     this.userList = this.userList.filter(item => item.userName == username);
  //   } 
  // }

  getAllUser(){
    this.userService.getAllUsers().subscribe((data: any) => {
      this.userList = data;
      this.POSTS = data;
      if(this.isSearch){
        let username  = this.searchForm.controls["userName"].value;
        if(username) {
          this.userService.getUserByUsername(username).subscribe((data: any) => {
            this.UserSearch = data;
            this.POSTS = this.UserSearch;
            console.log(data);
          })
        }
        else {
          this.isSearch = false;
        }
      }
      console.log(this.POSTS);
      
    });
  }
  deleteUser(userId){
    this.userService.deleteUser(userId).subscribe({next: res => {
      this.userList = this.userList.filter(item => item.id != userId);
      alertify.success("Delete success")
    }, error: error => alertify.error("Delete unsuccess")})
  }

  OnTableDataChange(event: any){
    this.page = event;
    this.getAllUser();
  }

  OnTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllUser();
  }

}
