import { ApiProperty } from '@nestjs/swagger';
import { Athlete } from '../../types/athlete.type';
import { DocumentInfo } from '../../types/document-info.type';

export class AthleteTableDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: [Array.of(Athlete)] })
  athletes: Athlete[];
}
