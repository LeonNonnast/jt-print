import { createRandomAthlete } from './athlete.type.spec';
import { Competition } from './competition.type';

export function createRandomCompetition(index: number): Competition {
  return {
    fightNumber: index + 1,
    athleteA: createRandomAthlete(),
    athleteB: createRandomAthlete(),
    fightNumberFromA: 1,
    fightNumberFromB: 2,
    result: null,
    isRepechage: false,
  };
}

export function createRandomCompetitions(count: number): Competition[] {
  const competitions = [];
  for (let i = 0; i < count; i++) {
    competitions.push(createRandomCompetition(i));
  }
  return competitions;
}

describe('test competition type', () => {
  it('should create x competitions', () => {
    const x = 100;
    expect(createRandomCompetitions(x).length).toEqual(x);
  });
});
