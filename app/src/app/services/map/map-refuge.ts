import { Refuge } from '../../schemas/refuge/refuge';
import { GoogleMap } from '@capacitor/google-maps';

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
        return { coordinate: coordinates };
      })
      .map((coordinates) => {
        return map.addMarker(coordinates);
      });
  }

  getRefugeFor(id: string): Refuge | undefined {
    const element = this.refugesWithMarkers.find((e) => e.id === id);
    if (!element) return undefined;
    return element.refuge;
  }
}
