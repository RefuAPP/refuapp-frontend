import { P } from 'ts-pattern';

export const RefugePattern = {
  id: P.string,
  name: P.string,
  region: P.string,
  image: P.string,
  altitude: P.number,
  coordinates: {
    latitude: P.number,
    longitude: P.number,
  },
  capacity: {
    winter: P.number,
    summer: P.number,
  },
};

export type Refuge = P.infer<typeof RefugePattern>;
