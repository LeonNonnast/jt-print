import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';
import { CertificateConfig } from 'src/types/certificate-config.type';

export class CertificatePreviewDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;

  @ApiProperty()
  certificateConfig: CertificateConfig;
}
