import { DocumentInfo } from '../../types/document-info.type';
import { Competition } from '../../types/competition.type';

import { LayoutNotFoundWithSize } from '../../types/layout-not-found-with-size.exception';
import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { ListInfo } from '../../types/list-info.type';
import { PDFLayoutListTreeDoubleKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-double-ko-system-with-double-repechage';

export abstract class PDFLayoutListTreeDoubleKoSystemWithDoubleRepechageSizeFactory {
  public static build(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[] = [],
  ): PDFLayoutListTreeKoSystemWithDoubleRepechage {
    const athleteCount = listInfo.athleteCount;
    // 7 bis 128 ist ok!
    if (athleteCount < 7 || athleteCount > 65) {
      throw new LayoutNotFoundWithSize(athleteCount);
    }
    const layout = PDFLayoutListTreeDoubleKoSystemWithDoubleRepechage.Construct(
      documentInfo,
      listInfo,
      competitions,
    );

    return layout;
  }
}
