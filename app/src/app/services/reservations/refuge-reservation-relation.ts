import { Reservations } from '../../schemas/reservations/reservation';
import { forkJoin, map, Observable } from 'rxjs';
import { Refuge } from '../../schemas/refuge/refuge';
import { RefugeService } from '../refuge/refuge.service';

export type ReservationsRelatedWithRefuge = {
  refugeId: string;
  reservations: Reservations;
};

export type ReservationsSortedByRefugeId = ReservationsRelatedWithRefuge[];

export type RefugeReservationsRelation = {
  refuge: Refuge;
  reservations: Reservations;
};
export type RefugeReservationsRelations = RefugeReservationsRelation[];

export function orderByRefugeId(
  reservations: Reservations,
): ReservationsSortedByRefugeId {
  const map = new Map<string, ReservationsRelatedWithRefuge>();
  reservations.forEach((reservation) => {
    const refugeId = reservation.refuge_id;
    if (!map.has(refugeId))
      map.set(refugeId, { refugeId: refugeId, reservations: [] });
    map.get(refugeId)?.reservations.push(reservation);
  });
  return Array.from(map.values());
}

export function getRelationFromSortedReservations(
  refugeService: RefugeService,
  sorted: ReservationsSortedByRefugeId,
): Observable<RefugeReservationsRelations> {
  const refuges = sorted.map((relation) => {
    return refugeService.getRefugeIgnoringErrorsFrom(relation.refugeId).pipe(
      map((refuge) => ({
        refuge,
        reservations: relation.reservations,
      })),
    );
  });
  return forkJoin(refuges);
}
