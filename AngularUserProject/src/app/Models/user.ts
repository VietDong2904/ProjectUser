export class User {
    public id?: string = ""
    public fullName: string = ""
    public userName: string = ""
    public email: string = ""
    constructor(id: string, fullName: string, userName: string, email: string){
      this.id = id
      this.fullName = fullName
      this.userName = userName
      this.email = email
    }
  }
  