import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';

@Injectable({
  providedIn: 'root',
})
export class FcmService {
  constructor() {}

  init() {
    if (Capacitor.getPlatform() != 'web') {
      this.initPush();
    }
  }

  private initPush() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive == 'granted') {
        PushNotifications.register().then(() => {
          FCM.subscribeTo({ topic: 'create_refuge' })
            .then((r) => console.log(`subscribed to topic`))
            .catch((err) => console.log(err));
        });
      } else {
        console.log('No permission for push granted');
      }
    });

    PushNotifications.addListener('registration', (token) => {
      console.log('My token: ' + JSON.stringify(token));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Received Notification' + JSON.stringify(notification));
      },
    );
  }
}
