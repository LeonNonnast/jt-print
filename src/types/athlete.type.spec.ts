import { faker } from '@faker-js/faker';
import { Athlete } from './athlete.type';

export function createRandomAthlete(
  rank: number = null,
  shouldSetWeighed = false,
): Athlete {
  const nationCode = faker.address.countryCode('alpha-3');
  const result = new Athlete({
    id: faker.fake('test'),
    startNumber: 1,
    associationCode:
      nationCode == 'GER'
        ? faker.helpers.arrayElement(['HB', 'NS', 'BY'])
        : null,

    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    nationCode: nationCode,
    yearOfBirth: faker.date
      .birthdate({ mode: 'year' })
      .getFullYear()
      .toString(),
    clubName: 'Kader Team',
    category: faker.helpers.arrayElement([
      'M | U18 | -55',
      'M | U18 | -60',
      'M | U18 | -66',
      'M | U18 | -73',
      'M | U18 | -81',
      'M | U18 | -90',
      'M | U18 | +90',
    ]),
    rank: rank,
    weighed: shouldSetWeighed
      ? faker.helpers.arrayElement([true, false])
      : null,
  });

  return result;
}

export function createRandomAthletes(count: number) {
  const athletes = [];
  for (let i = 0; i < count; i++) {
    athletes.push(createRandomAthlete(i, true));
  }
  return athletes;
}

describe('test athlete type', () => {
  it('should create x athletes', () => {
    const x = 100;
    expect(createRandomAthletes(x).length).toEqual(x);
  });
});
