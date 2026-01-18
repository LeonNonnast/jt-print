import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';
import { PDFLayoutListPoolBestOfThree } from './pdf-layout-list-pool-best-of-three';
import { PDFLayoutListPoolBestOfThreeSize2 } from './pdf-layout-list-pool-best-of-three-size-2';
import { LayoutNotFoundWithSize } from '../../types/layout-not-found-with-size.exception';
import { ListInfo } from 'src/types/list-info.type';

export abstract class PDFLayoutListPoolBestOfThreeSizeFactory {
  public static build(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListPoolBestOfThree {
    switch (listInfo.athleteCount) {
      case 2:
        return PDFLayoutListPoolBestOfThreeSize2.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      default:
        throw new LayoutNotFoundWithSize(listInfo.athleteCount);
    }
  }
}
