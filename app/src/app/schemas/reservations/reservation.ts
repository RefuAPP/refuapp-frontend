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

export type WeekReservations = ChartReservation[];

export type ChartReservation = {
  night: Night;
  count: number;
}

export const ReservationsWeekPattern: P.Pattern<ChartReservation> = {};

export const ReservationPattern: P.Pattern<Reservation> = {};
