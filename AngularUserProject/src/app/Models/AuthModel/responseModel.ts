import { ResponseCode } from "../Enums/responseCode";

export class ResponseModel {
  public responseCode: ResponseCode = ResponseCode.NoSet;
  public responseMessage: string = "";
  public dataSet: any
}
