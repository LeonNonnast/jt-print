import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';

import { LayoutNotFoundWithSize } from '../../types/layout-not-found-with-size.exception';
import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize8 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-8';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize16 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-16';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize32 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-32';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize64 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-64';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSize128 } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-128';
import { ListInfo } from '../../types/list-info.type';

export abstract class PDFLayoutListTreeKoSystemWithDoubleRepechageSizeFactory {
  public static build(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[] = [],
  ): PDFLayoutListTreeKoSystemWithDoubleRepechage {
    const athleteCount = listInfo.athleteCount;
    // 7 bis 128 ist ok!
    if (athleteCount < 5 || athleteCount > 129) {
      throw new LayoutNotFoundWithSize(athleteCount);
    }

    if (athleteCount <= 7)
      return PDFLayoutListTreeKoSystemWithDoubleRepechageSize8.Construct(
        documentInfo,
        listInfo,
        competitions,
      );
    if (athleteCount <= 16)
      return PDFLayoutListTreeKoSystemWithDoubleRepechageSize16.Construct(
        documentInfo,
        listInfo,
        competitions,
      );
    if (athleteCount <= 32)
      return PDFLayoutListTreeKoSystemWithDoubleRepechageSize32.Construct(
        documentInfo,
        listInfo,
        competitions,
      );
    if (athleteCount <= 64)
      return PDFLayoutListTreeKoSystemWithDoubleRepechageSize64.Construct(
        documentInfo,
        listInfo,
        competitions,
      );
    if (athleteCount <= 128)
      return PDFLayoutListTreeKoSystemWithDoubleRepechageSize128.Construct(
        documentInfo,
        listInfo,
        competitions,
      );
    throw new LayoutNotFoundWithSize(athleteCount);
  }
}
