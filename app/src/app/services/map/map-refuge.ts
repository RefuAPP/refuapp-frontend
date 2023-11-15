import { Refuge } from '../../schemas/refuge/refuge';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { LatLng } from '@capacitor/google-maps/dist/typings/ts_old/definitions';

export type MarkerWithRefuge = {
  id: string;
  refuge: Refuge;
};

function zip(markersId: string[], refuges: Refuge[]): MarkerWithRefuge[] {
  return markersId.map((elementFirst, index) => {
    return {
      id: elementFirst,
      refuge: refuges[index],
    };
  });
}

/**
 * Encapsulates the logic of mapping a refuge to a marker
 */
export class MapRefuge {
  private refugesWithMarkers: MarkerWithRefuge[] = [];

  constructor() {}

  async addMarkers(refuges: Refuge[], map: GoogleMap) {
    const markers = await Promise.all(this.getMarkersForRefuges(refuges, map));
    this.refugesWithMarkers = zip(markers, refuges);
  }

  private getMarkersForRefuges(
    refuges: Refuge[],
    map: GoogleMap,
  ): Promise<string>[] {
    return refuges
      .map((refuge) => refuge.coordinates)
      .map((coordinates) => {
        return { lat: coordinates.latitude, lng: coordinates.longitude };
      })
      .map((coordinates) => {
        return this.getMarkerForCoordinates(coordinates);
      })
      .map((marker) => {
        return map.addMarker(marker);
      });
  }

  private getMarkerForCoordinates(coordinates: LatLng): Marker {
    return {
      coordinate: coordinates,
      iconSize: {
        width: 40,
        height: 58,
      },
      iconAnchor: {
        x: 20,
        y: 58,
      },
      iconUrl: 'assets/icon/marker.png',
    };
  }

  getRefugeFor(id: string): Refuge | undefined {
    const element = this.refugesWithMarkers.find((e) => e.id === id);
    if (!element) return undefined;
    return element.refuge;
  }

  private getMarkers() {
    return this.refugesWithMarkers.map((element) => element.id);
  }

  hasMarkers() {
    return this.refugesWithMarkers.length > 0;
  }

  async deleteMarkers(map: GoogleMap) {
    const markers = this.getMarkers();
    if (markers.length === 0) return;
    await map.removeMarkers(markers);
    this.refugesWithMarkers = [];
  }
}
