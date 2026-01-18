import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';
import { AthleteRegistration } from '../../types/athlete-registration.type';
import { Athlete } from 'src/types/athlete.type';

export class AthleteRegistrationCertificationDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: [Array.of(AthleteRegistration)] })
  athletes: Athlete[];
}
