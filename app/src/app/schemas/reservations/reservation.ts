import { P } from 'ts-pattern/dist';
import { Night } from '../night/night';

export type Reservation = {
  user_id: string;
  refuge_id: string;
  night: Night;
};

export type ReservationWithId = Reservation & { id: string };

export type Reservations = ReservationWithId[];

export const ReservationWithIdPattern: P.Pattern<ReservationWithId> = {};
export const ReservationPattern: P.Pattern<Reservation> = {};
