import { map, Observable } from 'rxjs';
import {
  CorrectGetReservations,
  ErrorGetReservationsPattern,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import { Reservations } from '../../schemas/reservations/reservation';
import { isMatching } from 'ts-pattern/dist';

export function toReservations(
  getReservations: Observable<GetReservations>,
): Observable<Reservations> {
  return getReservations.pipe(
    map((reservations) => {
      if (isMatching(ErrorGetReservationsPattern, reservations)) return [];
      return (reservations as CorrectGetReservations).reservations;
    }),
  );
}
