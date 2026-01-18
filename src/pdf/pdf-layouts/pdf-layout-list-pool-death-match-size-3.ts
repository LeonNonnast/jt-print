import { PDFLayoutListPoolDeathMatch } from './pdf-layout-list-pool-death-match';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { Competition } from '../../types/competition.type';

export class PDFLayoutListPoolDeathMatchSize3 extends PDFLayoutListPoolDeathMatch {
  protected getListSize(): number {
    return 3;
  }

  static Construct(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListPoolDeathMatch {
    return new PDFLayoutListPoolDeathMatchSize3(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
