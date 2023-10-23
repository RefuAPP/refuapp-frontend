import { Refuge } from '../../schemas/refuge/refuge';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Coordinates } from '../search/search.service';
import { LatLng } from '@capacitor/google-maps/dist/typings/ts_old/definitions';

export type MarkerWithRefuge = {
  id: String;
  refuge: Refuge;
};

function zip(markersId: String[], refuges: Refuge[]): MarkerWithRefuge[] {
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
  ): Promise<String>[] {
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
        width: 73,
        height: 91,
      },
      iconAnchor: {
        x: 36,
        y: 91,
      },
      iconUrl: 'assets/icon/marker2.png',
    };
  }

  getRefugeFor(id: string): Refuge | undefined {
    const element = this.refugesWithMarkers.find((e) => e.id === id);
    if (!element) return undefined;
    return element.refuge;
  }
}
