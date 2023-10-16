export interface Refuge {
  id: string;
  name: string;
  region: string;
  image: string;
  altitude: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  capacity: {
    winter: number;
    summer: number;
  };
}
