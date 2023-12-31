import { ElementRef, Injectable } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { secretEnvironment } from '../../../environments/environment.secret';
import { environment } from '../../../environments/environment';
import { CameraConfig } from '@capacitor/google-maps/dist/typings/ts_old/definitions';
import { Refuge } from '../../schemas/refuge/refuge';
import { Coordinates } from '../search/search.service';
import { MapRefuge } from './map-refuge';
import { GoogleMapConfig } from '@capacitor/google-maps/dist/typings/definitions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: GoogleMap;
  private mapRefuge: MapRefuge = new MapRefuge();

  constructor() {}

  async destroyMap() {
    this.map?.destroy();
  }

  async addRefuges(refuges: Refuge[], onRefugeClick: (refuge: Refuge) => void) {
    if (!this.map) return;
    if (this.mapRefuge.hasMarkers())
      await this.mapRefuge.deleteMarkers(this.map);
    await this.mapRefuge.addMarkers(refuges, this.map);
    await this.map.setOnMarkerClickListener((marker) => {
      const refuge = this.mapRefuge.getRefugeFor(marker.markerId);
      if (refuge !== undefined) onRefugeClick(refuge);
      else
        throw new Error(
          `Google Map: Refuge for marker: ${marker.markerId} not found`,
        );
    });
    await this.enableClustering();
  }

  async move(location: Coordinates) {
    if (!this.map) return;
    await this.moveMapCameraTo({
      coordinate: {
        lat: location.latitude,
        lng: location.longitude,
      },
      zoom: 15,
      animate: true,
    });
  }

  async createMap(mapRef: ElementRef, config: GoogleMapConfig) {
    this.map = await GoogleMap.create({
      id: 'my-map',
      apiKey: secretEnvironment.mapsKey,
      element: mapRef.nativeElement,
      forceCreate: environment.MAPS_FORCE_CREATE,
      config,
    });
    this.mapRefuge = new MapRefuge();
  }

  private async enableClustering() {
    if (!this.map) return;
    await this.map.enableClustering(2);
  }

  private async moveMapCameraTo(cameraConfig: CameraConfig) {
    await this.map!.setCamera(cameraConfig);
  }
}
