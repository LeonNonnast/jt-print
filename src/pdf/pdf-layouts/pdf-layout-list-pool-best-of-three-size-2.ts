import { DocumentInfo } from 'src/types/document-info.type';
import { ListInfo } from 'src/types/list-info.type';
import { PDFLayoutListPoolBestOfThree } from './pdf-layout-list-pool-best-of-three';
import { Competition } from '../../types/competition.type';

export class PDFLayoutListPoolBestOfThreeSize2 extends PDFLayoutListPoolBestOfThree {
  protected getListSize(): number {
    return 2;
  }

  static Construct(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListPoolBestOfThree {
    return new PDFLayoutListPoolBestOfThreeSize2(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
