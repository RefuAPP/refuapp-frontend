import { P } from 'ts-pattern/dist';

export type Reservations = ReservationWithId[];

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

export function isBigger(night1: Night, night2: Night): boolean {
  return (
    night1.year >= night2.year &&
    night1.month >= night2.month &&
    night1.day >= night2.day
  );
}

export function nightFromDate(date: Date): Night {
  return {
    day: date.getDate(),
    month: date.getMonth(),
    year: date.getFullYear(),
  };
}

export function getNightsFrom(date: Date, numberOfNights: number): Night[] {
  return getDatesFrom(date, numberOfNights).map((date) => nightFromDate(date));
}

function getDatesFrom(date: Date, numberOfDates: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < numberOfDates; i++) {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + i);
    dates.push(newDate);
  }
  return dates;
}

export type ReservationWithId = Reservation & { id: string };

export const ReservationsPattern: P.Pattern<Reservations> = [];
export const ReservationPattern: P.Pattern<Reservation> = {};
