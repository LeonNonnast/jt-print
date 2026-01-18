import { ApiProperty } from '@nestjs/swagger';

export class DocumentInfo {
  /**
   * name of tournament
   *
   * @type {string}
   */
  @ApiProperty()
  tournamentName: string;

  /**
   * language
   *
   * @type {string}
   */
  @ApiProperty()
  language: string;

  /**
   * logo
   *
   * @type {string}
   */
  @ApiProperty()
  logo: string;

  /**
   * data for qrcode
   *
   * @type {string | any | string}
   */
  @ApiProperty()
  qrCodeData: string | any | undefined;
}

/**
 * version
 *
 * @type {string}
 */
export const getLocaleDate = (documentInfo: DocumentInfo) => {
  return new Date().toLocaleDateString(documentInfo.language);
};
