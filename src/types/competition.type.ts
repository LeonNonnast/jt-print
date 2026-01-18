import { ApiProperty } from '@nestjs/swagger';
import { Athlete } from './athlete.type';
import { Result } from './result.type';

export class Competition {
  @ApiProperty()
  fightNumber: number;

  @ApiProperty()
  athleteA: Athlete | undefined;

  @ApiProperty()
  athleteB: Athlete | undefined;

  @ApiProperty()
  result: Result | null;

  @ApiProperty()
  isRepechage?: boolean;

  @ApiProperty()
  isFinal?: boolean;

  @ApiProperty()
  fightNumberFromA: number | undefined;

  @ApiProperty()
  fightNumberFromB: number | undefined;

  @ApiProperty()
  startNumberA: string | undefined;

  @ApiProperty()
  startNumberB: string | undefined;

  constructor(data: any) {
    this.fightNumber = data.fightNumber;
    this.athleteA = data.athleteA;
    this.athleteB = data.athleteB;

    this.fightNumberFromA = data.fightNumberFromA || undefined;
    this.fightNumberFromB = data.fightNumberFromB || undefined;

    this.startNumberA = data.startNumberA || undefined;
    this.startNumberB = data.startNumberB || undefined;

    this.result = data.result ? new Result(data.result) : null;

    this.isRepechage = data.isRepechage;
    this.isFinal = data.isFinal;
  }
}
