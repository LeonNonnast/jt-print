import { ApiProperty } from '@nestjs/swagger';

export class Result {
  @ApiProperty()
  time: string;

  @ApiProperty()
  isWinnerA: boolean;

  @ApiProperty()
  athleteAPoints: string;

  @ApiProperty()
  athleteBPoints: string;

  @ApiProperty()
  isDisqualified: string;

  constructor(data: any) {
    this.time = data.time;
    this.isWinnerA = data.isWinnerA;
    this.athleteAPoints = data.athleteAPoints;
    this.athleteBPoints = data.athleteBPoints;
    this.isDisqualified = data.isDisqualified;
  }
}
