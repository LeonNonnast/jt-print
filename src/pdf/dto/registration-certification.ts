import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';
import { AthleteRegistration } from '../../types/athlete-registration.type';
import { Athlete } from 'src/types/athlete.type';
import { CertificateConfig } from 'src/types/certificate-config.type';

export class AthleteRegistrationCertificationDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: [Array.of(AthleteRegistration)] })
  athletes: Athlete[];

  @ApiPropertyOptional()
  certificateConfig?: CertificateConfig;
}
