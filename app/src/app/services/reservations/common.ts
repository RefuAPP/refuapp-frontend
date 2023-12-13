import { map, Observable } from 'rxjs';
import {
  CorrectGetReservations,
  CorrectGetReservationsPattern,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import {Reservations, WeekReservations} from '../../schemas/reservations/reservation';
import { isMatching } from 'ts-pattern';
import {
  CorrectGetWeekReservations,
  CorrectGetWeekReservationsPattern, GetWeekReservations
} from "../../schemas/reservations/get-week-reservations-refuge";

export function toReservations(
  getReservations: Observable<GetReservations>,
): Observable<Reservations> {
  return getReservations.pipe(
    map((reservations) => {
      // TODO: Search about pattern matching with arrays!
      if (isMatching(CorrectGetReservationsPattern, reservations))
        return (reservations as CorrectGetReservations).reservations;
      return [];
    }),
  );
}

export function toReservationsWeek(
  getWeekReservations: Observable<GetWeekReservations>,
): Observable<WeekReservations> {
  return getWeekReservations.pipe(
    map((reservations) => {
      if (isMatching(CorrectGetWeekReservationsPattern, reservations))
        return (reservations as CorrectGetWeekReservations).week;
      return [];
    }),
  );
}
