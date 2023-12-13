import { P } from 'ts-pattern/dist';
import { Night } from '../night/night';

export type Reservation = {
  user_id: string;
  refuge_id: string;
  night: Night;
};

export type ReservationWithoutUserId = Omit<Reservation, 'user_id'>;

export type ReservationWithId = Reservation & { id: string };

export type Reservations = ReservationWithId[];

export type ReservationsWeek = WeekReservation[];

export type WeekReservation = {
  night: Night;
  count: number;
}

export const ReservationsWeekPattern: P.Pattern<WeekReservation> = {};

export const ReservationPattern: P.Pattern<Reservation> = {};
