import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../Models/AuthModel/responseModel';
import { ResponseCode } from '../Models/Enums/responseCode';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseURL = "https://localhost:7170/api/users/"

  constructor(private httpClient: HttpClient) { }
  public login(username: string, password: string) {
    var body = {
      UserName: username,
      Password: password
    }
    return this.httpClient.post<ResponseModel>(this.baseURL+"login", body)
  }

  public register(fullname: string, email: string, username: string, password: string) {
    var body = {
      UserName: username,
      Password: password,
      FullName: fullname,
      Email: email 
    }
    return this.httpClient.post<ResponseModel>(this.baseURL + "RegisterUser",body)
  }

  public getAllUsers() {
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // var header = new HttpHeaders({
    //   'Authorization':`Bearer ${userInfo?.token}`
    // });
    return this.httpClient.get<ResponseModel>(this.baseURL + "GetAllUsers").pipe(map(res => {
      let userList = new Array<User>();
      if(res.responseCode == ResponseCode.Ok) {
        if(res.dataSet) {
          res.dataSet.map((user: User) => {
            userList.push(new User(user.id, user.fullName, user.userName, user.email));
          })
        }
      }
      return userList;
    }));
  }
  public getUserById(id): Observable<ResponseModel> {
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    // let headers = new HttpHeaders({
    //   'Authorization': `Bearer ${userInfo?.token}`
    // })
    return this.httpClient.get<ResponseModel>(this.baseURL + "GetUserById/" + `${id}`)
  }

  public getUserByUsername(userName): Observable<ResponseModel> {
     let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    // let headers = new HttpHeaders({
    //   'Authorization': `Bearer ${userInfo?.token}`
    // })
    return this.httpClient.get<ResponseModel>(this.baseURL + "GetUserByUsername/" + `${userName}`)
  }

  public updateUser(id, data): Observable<ResponseModel> {
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    // let headers = new HttpHeaders({
    //   'Authorization': `Bearer ${userInfo?.token}`
    // })
    return this.httpClient.put<ResponseModel>(this.baseURL + "UpdateUser/" + `${id}` , data,)
  }

  public deleteUser(id): Observable<ResponseModel> {
    // let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    // let headers = new HttpHeaders({
    //   'Authorization': `Bearer ${userInfo?.token}`
    // })
    return this.httpClient.delete<ResponseModel>(this.baseURL + "DeleteUser/" + `${id}`)
  }
}
