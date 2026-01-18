import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';
import { AthleteRegistration } from '../../types/athlete-registration.type';

export class AthleteRegistrationTableDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: [Array.of(AthleteRegistration)] })
  athleteRegistrations: AthleteRegistration[];
}
