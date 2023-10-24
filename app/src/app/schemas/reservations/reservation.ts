import { P } from 'ts-pattern/dist';

export type ReservationId = string;

export type Reservations = ReservationId[];

export type Reservation = {
  user_id: string;
  refuge_id: string;
  night: Night;
};

export type Night = {
  day: number;
  month: number;
  year: number;
};

export const ReservationsPattern: P.Pattern<Reservations> = [];
export const ReservationPattern: P.Pattern<Reservation> = {};
