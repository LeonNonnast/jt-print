import { ApiProperty } from '@nestjs/swagger';

export class AthleteRegistration {
  /**
   * id of athlete
   *
   * @type {string}
   */
  @ApiProperty()
  id: string;

  /**
   * first name of athlete
   *
   * @type {string}
   */
  @ApiProperty()
  firstName: string;

  /**
   * sur name of athlete
   *
   * @type {string}
   */
  @ApiProperty()
  lastName: string;

  /**
   * nation code e.g. IOC
   *
   * @type {string}
   */
  @ApiProperty()
  nationCode: string;

  /**
   * year of birth of athlete
   *
   * @type {string}
   */
  @ApiProperty()
  yearOfBirth: string;

  /**
   * association code e.g. BY
   *
   * @type {string | undefined}
   */
  @ApiProperty()
  associationCode: string | undefined;

  /**
   * club name e.g. BY
   *
   * @type {string}
   */
  @ApiProperty()
  clubName: string;

  /**
   * category
   *
   * @type {string | undefined}
   */
  @ApiProperty()
  category: string | undefined;

  /**
   * order for sorting categories
   *
   * @type {number | undefined}
   */
  @ApiProperty()
  weightedOrder: number | undefined;

  constructor(data: any) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.nationCode = data.countryCodeIOC;
    this.yearOfBirth = data.yearOfBirth;
    this.associationCode = data.associationCode;
    this.clubName = data.clubName;
    this.category = data.category;
    this.weightedOrder = data.weightedOrder;
  }
}

/**
 * get Fullname
 *
 * @param {AthleteRegistration}
 * @param {number} [size=200]
 * @param {boolean} [reverse=false]
 * @return {*}  {string}
 * @memberof AthleteRegistration
 */
export function getFullName(
  athlete: AthleteRegistration,
  size = 200,
  reverse = false,
): string {
  const firstName =
    size <= 200 && athlete.firstName.length + athlete.lastName.length < 30
      ? athlete.firstName
      : athlete.firstName.substring(0, 1);

  const lastName = athlete.lastName;

  if (reverse) return lastName + ', ' + firstName;
  return firstName + ' ' + lastName;
}
