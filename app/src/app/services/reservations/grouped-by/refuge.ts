import { forkJoin, map, Observable } from 'rxjs';
import {
  Reservations,
  ReservationWithId,
} from '../../../schemas/reservations/reservation';
import { Refuge } from '../../../schemas/refuge/refuge';

export type RefugeReservationsRelations = {
  refuge: Refuge;
  reservations: Reservations;
}[];

export function orderByRefuge(
  reservations: Reservations,
  refugeFactory: (refugeId: string) => Observable<Refuge>,
): Observable<RefugeReservationsRelations> {
  const reservationsGroupedById = orderByRefugeId(reservations);
  return fetchRefugesFromGroupedReservations(
    refugeFactory,
    reservationsGroupedById,
  ).pipe();
}

function fetchRefugesFromGroupedReservations(
  refugeFactory: (refugeId: string) => Observable<Refuge>,
  sorted: ReservationsRelatedWithRefugeId[],
): Observable<RefugeReservationsRelations> {
  const refuges = sorted.map((relation) => {
    return refugeFactory(relation.refugeId).pipe(
      map((refuge) => ({
        refuge,
        reservations: relation.reservations,
      })),
    );
  });
  return forkJoin(refuges);
}

type ReservationsRelatedWithRefugeId = {
  refugeId: string;
  reservations: Reservations;
};

class ReservationsManager {
  private readonly map: Map<string, ReservationsRelatedWithRefugeId>;

  constructor() {
    this.map = new Map<string, ReservationsRelatedWithRefugeId>();
  }

  add(reservation: ReservationWithId) {
    const refugeId = reservation.refuge_id;
    if (!this.map.has(refugeId))
      this.map.set(refugeId, { refugeId: refugeId, reservations: [] });
    this.map.get(refugeId)?.reservations.push(reservation);
  }

  get(): ReservationsRelatedWithRefugeId[] {
    return Array.from(this.map.values());
  }
}

function orderByRefugeId(
  reservations: Reservations,
): ReservationsRelatedWithRefugeId[] {
  const acc = new ReservationsManager();
  reservations.forEach((reservation) => acc.add(reservation));
  return acc.get();
}
