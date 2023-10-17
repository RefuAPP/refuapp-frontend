import { P } from 'ts-pattern';

export type Refuge = {
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
};

export const RefugePattern: P.Pattern<Refuge> = {};
