import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';

export class SampleDto {
  @ApiProperty({ type: [DocumentInfo] })
  documentInfo: DocumentInfo;
}
