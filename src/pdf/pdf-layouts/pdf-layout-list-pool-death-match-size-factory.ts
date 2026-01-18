import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';
import { LayoutNotFoundWithSize } from '../../types/layout-not-found-with-size.exception';
import { PDFLayoutListPoolDeathMatch } from './pdf-layout-list-pool-death-match';
import { PDFLayoutListPoolDeathMatchSize2 } from './pdf-layout-list-pool-death-match-size-2';
import { PDFLayoutListPoolDeathMatchSize3 } from './pdf-layout-list-pool-death-match-size-3';
import { PDFLayoutListPoolDeathMatchSize4 } from './pdf-layout-list-pool-death-match-size-4';
import { PDFLayoutListPoolDeathMatchSize5 } from './pdf-layout-list-pool-death-match-size-5';
import { PDFLayoutListPoolDeathMatchSize6 } from './pdf-layout-list-pool-death-match-size-6';
import { PDFLayoutListPoolDeathMatchSize7 } from './pdf-layout-list-pool-death-match-size-7';
import { ListInfo } from 'src/types/list-info.type';

export abstract class PDFLayoutListPoolDeathMatchSizeFactory {
  public static build(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListPoolDeathMatch {
    switch (listInfo.athleteCount) {
      case 2:
        return PDFLayoutListPoolDeathMatchSize2.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      case 3:
        return PDFLayoutListPoolDeathMatchSize3.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      case 4:
        return PDFLayoutListPoolDeathMatchSize4.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      case 5:
        return PDFLayoutListPoolDeathMatchSize5.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      case 6:
        return PDFLayoutListPoolDeathMatchSize6.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      case 7:
        return PDFLayoutListPoolDeathMatchSize7.Construct(
          documentInfo,
          listInfo,
          competitions,
        );
      default:
        throw new LayoutNotFoundWithSize(listInfo.athleteCount);
    }
  }
}
