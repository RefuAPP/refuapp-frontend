import { GoogleMapConfig } from '@capacitor/google-maps/dist/typings/definitions';

type MapStyle = google.maps.MapTypeStyle;

/**
 * Style to hide business points (restaurants, hotels, etc.)
 */
export const NoBusinessPoints: MapStyle = {
  featureType: 'poi.business',
  stylers: [{ visibility: 'off' }],
};

/**
 * Style to hide transit icons (bus, train, etc.)
 */
export const NoTransitIcon: MapStyle = {
  featureType: 'transit',
  elementType: 'labels.icon',
  stylers: [{ visibility: 'off' }],
};

const initialCenter = {
  lat: 42.696824,
  lng: 0.453187,
};

export const MapConfiguration: GoogleMapConfig = {
  styles: [NoBusinessPoints, NoTransitIcon],
  disableDefaultUI: true,
  clickableIcons: false,
  mapTypeId: 'hybrid',
  center: initialCenter,
  zoom: 8,
};
