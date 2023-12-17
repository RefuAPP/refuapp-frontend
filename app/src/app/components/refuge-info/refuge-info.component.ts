import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Refuge } from '../../schemas/refuge/refuge';
import { environment } from 'src/environments/environment';
 

const sensorsApiUrl = environment.SENSORS_API;
@Component({
  selector: 'app-refuge-info',
  templateUrl: './refuge-info.component.html',
  styleUrls: ['./refuge-info.component.scss'],
})
export class RefugeInfoComponent implements OnInit {
  @Input() refuge!: Refuge;
  lastActivity: string | null = null;
  sensorStatus: 'active' | 'inactive' | 'error' = 'inactive';
 
  constructor(private http: HttpClient) {}
 
  ngOnInit() {
    if (!this.refuge || !this.refuge.id) {
      console.error('Refuge or refuge.id is undefined');
      this.sensorStatus = 'error';
      return;
    }
  
    this.http.get<any>(`${sensorsApiUrl}/refugio/${this.refuge.id}`)
      .subscribe({
        next: (data) => {
          this.lastActivity = data.last_activity;
          this.sensorStatus = 'active';
        },
        error: (error: HttpErrorResponse) => {
          this.sensorStatus = error.status === 404 ? 'inactive' : 'error';
        }
      });
  }
  
 
  isActivityRecent(lastActivity: string): boolean {
    const activityDate = new Date(lastActivity);
    const now = new Date();
    const differenceInHours = (now.getTime() - activityDate.getTime()) / 1000 / 3600;
    return differenceInHours <= 1;
  }
}