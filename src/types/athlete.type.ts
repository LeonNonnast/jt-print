import { ApiProperty } from '@nestjs/swagger';
import { AthleteRegistration } from './athlete-registration.type';

export class Athlete extends AthleteRegistration {
  /**
   * start number
   *
   * @type {number}
   */
  @ApiProperty()
  startNumber: number;

  /**
   * rank
   *
   * @type {string | null}
   */
  @ApiProperty()
  rank?: number;

  /**
   * rank
   *
   * @type {string | null}
   */
  @ApiProperty()
  weighed?: boolean;

  constructor(data: Athlete) {
    super(data);
    this.startNumber = data.startNumber;
    this.rank = data.rank;
    this.weighed = data.weighed;
  }
}
