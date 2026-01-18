import { ApiProperty } from '@nestjs/swagger';
import { Systems } from './systems.enum';

export class ListInfo {
  /**
   * system of tournament
   *
   * @type {Systems}
   */
  @ApiProperty({ required: true })
  system: Systems | undefined;

  /**
   * category of list
   *
   * @type {string}
   */
  @ApiProperty({ required: true })
  category: string;

  /**
   * status of list
   *
   * @type {(string | undefined)}
   * @memberof ListInfo
   */
  @ApiProperty()
  status: string | undefined;

  /**
   * size of list
   *
   * @type {string}
   */
  size: number;

  /**
   * count of athletes in list
   *
   * @type {string}
   */
  athleteCount: number;
}

export const getSystemName = (systemName: Systems): string => {
  switch (systemName) {
    case Systems.BestOfThree:
      return 'Best of three';
    case Systems.JederGegenJeden:
      return 'Death Match';
    case Systems.KoSystem:
      return 'Ko System';
    case Systems.KoSystemWithDoubleRepechage:
      return 'Ko System with double Repechage';
    case Systems.DoubleKoSystemWithDoubleRepechage:
      return 'Double Ko System';
  }
  return 'no system translation found';
};
