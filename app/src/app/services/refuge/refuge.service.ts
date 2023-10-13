import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Refuge} from "../../schemas/refuge";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RefugeService {

  constructor(private http: HttpClient) {
  }

  getRefugeFrom(id: string): Observable<Refuge | any> {
    console.log(environment.API + '/refuges/' + id);
    return this.http.get(environment.API + '/refuges/' + id);
  }

}
