import {
  getNightsFrom,
  isEqual,
  isFurtherAway,
  Night,
  nightFromDate,
} from './night';
describe('Further away test', () => {
  it('Further away with date smaller', () => {
    const elevenDecember2023: Night = { day: 11, month: 12, year: 2023 };
    const twelveDecember2023: Night = { day: 12, month: 12, year: 2023 };
    expect(isFurtherAway(elevenDecember2023, twelveDecember2023)).toBe(false);
  });

  it('Further away with date equal', () => {
    const elevenDecember2023: Night = { day: 11, month: 12, year: 2023 };
    expect(isFurtherAway(elevenDecember2023, elevenDecember2023)).toBe(false);
  });

  it('Further away with date bigger', () => {
    const elevenDecember2023: Night = { day: 11, month: 12, year: 2023 };
    const twelveDecember2023: Night = { day: 12, month: 12, year: 2023 };
    expect(isFurtherAway(twelveDecember2023, elevenDecember2023)).toBe(true);
  });
});

describe('Get night from a date', () => {
  it('Get Night From a Date', () => {
    const date = new Date(2023, 10, 11);
    const night = nightFromDate(date);
    expect(isEqual(night, { day: 11, month: 11, year: 2023 }));
  });
});

describe('Get nights from a date and days', () => {
  it('Get night from days negative', () => {
    const date = new Date(2023, 11, 11);
    const nights = getNightsFrom(date, -1);
    expect(nights.length).toBe(0);
  });

  it('Get night from days 0', () => {
    const date = new Date(2023, 11, 11);
    const nights = getNightsFrom(date, 0);
    expect(nights.length).toBe(0);
  });

  it('Get night from one day', () => {
    const date = new Date(2023, 10, 11);
    const nights = getNightsFrom(date, 1);
    expect(JSON.stringify(nights)).toBe(
      JSON.stringify([
        {
          day: 11,
          month: 11,
          year: 2023,
        },
      ]),
    );
  });

  it('Get night from two days', () => {
    const date = new Date(2023, 10, 11);
    const nights = getNightsFrom(date, 2);
    expect(JSON.stringify(nights)).toBe(
      JSON.stringify([
        {
          day: 11,
          month: 11,
          year: 2023,
        },
        {
          day: 12,
          month: 11,
          year: 2023,
        },
      ]),
    );
  });

  it('Get night from one day after finishing month', () => {
    const lastDayOfJanuary2023 = new Date(2023, 0, 31);
    const nights = getNightsFrom(lastDayOfJanuary2023, 2);
    expect(JSON.stringify(nights)).toBe(
      JSON.stringify([
        {
          day: 31,
          month: 1,
          year: 2023,
        },
        {
          day: 1,
          month: 2,
          year: 2023,
        },
      ]),
    );
  });
});
