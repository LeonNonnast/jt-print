import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';
import { ListInfo } from '../../types/list-info.type';

export class SystemListDto {
  @ApiProperty({ type: DocumentInfo })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: ListInfo })
  listInfo: ListInfo;

  @ApiProperty({ type: [Array.of(Competition)] })
  competitions: Competition[];

  // constructor(data: any) {
  // this.competitions = (data.competitions || []).map(
  //   (_competition) => new Competition(_competition),
  // );
  // }
}
