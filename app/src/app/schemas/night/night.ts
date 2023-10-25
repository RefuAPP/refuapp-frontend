import * as moment from 'moment';

export type Night = {
  day: number;
  month: number;
  year: number;
};

export function isFurtherAway(night1: Night, night2: Night): boolean {
  if (isEqual(night1, night2)) return false;
  return (
    night1.year >= night2.year &&
    night1.month >= night2.month &&
    night1.day >= night2.day
  );
}

export function isEqual(night1: Night, night2: Night): boolean {
  return (
    night1.year === night2.year &&
    night1.month === night2.month &&
    night1.day === night2.day
  );
}

export function nightFromDate(date: Date): Night {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

export function getNightsFrom(date: Date, numberOfNights: number): Night[] {
  if (numberOfNights <= 0) return [];
  return getDaysFromTo(date, numberOfNights).map((date) => nightFromDate(date));
}

function getDaysFromTo(date: Date, numberOfDays: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < numberOfDays; i++)
    dates.push(moment(date).add(i, 'days').toDate());
  return dates;
}
