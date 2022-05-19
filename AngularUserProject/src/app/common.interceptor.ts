import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class CommonInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    req = req.clone({
      setHeaders: {
        'Authorization':`Bearer ${userInfo?.token}`
      }
    });

    return next.handle(req)
      .pipe(
        // Retry on failure
        retry(2),

        // Handle errors
        catchError((error: HttpErrorResponse) => {
          // TODO: Add error handling logic here
          console.error("Some thing wrong");

          return throwError(error);
        }),

        // PROFILING
        finalize(() => {
          const profilingMsg = `${req.method} "${req.urlWithParams}"`;
          console.log(profilingMsg);
        })
        );
  }
}
