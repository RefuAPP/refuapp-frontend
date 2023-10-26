import { map, Observable } from 'rxjs';
import {
  CorrectGetReservations,
  CorrectGetReservationsPattern,
  GetReservations,
} from '../../schemas/reservations/get-reservations-refuge-user';
import { Reservations } from '../../schemas/reservations/reservation';
import { isMatching } from 'ts-pattern';

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
