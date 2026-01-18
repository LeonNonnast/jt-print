import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutList } from './pdf-layout-list';
import { Competition } from '../../types/competition.type';
import { Systems } from '../../types/systems.enum';
import { LayoutNotFoundWithSystem } from '../../types/layout-not-found-with-system.exception';
import { PDFLayoutListPoolBestOfThreeSizeFactory } from './pdf-layout-list-pool-best-of-three-size-factory';
import { PDFLayoutListPoolDeathMatchSizeFactory } from './pdf-layout-list-pool-death-match-size-factory';
import { PDFLayoutListTreeKoSystemWithDoubleRepechageSizeFactory } from './pdf-layout-list-tree-ko-system-with-double-repechage-size-factory';
import { ListInfo } from '../../types/list-info.type';
import { PDFLayoutListTreeDoubleKoSystemWithDoubleRepechageSizeFactory } from './pdf-layout-list-tree-double-ko-system-with-double-repechage-size-factory';

export abstract class PDFLayoutListFactory {
  public static build(
    listInfo: ListInfo,
    documentInfo: DocumentInfo,
    competitions: Competition[],
  ): PDFLayoutList {
    switch (listInfo.system) {
      case Systems.BestOfThree:
        return PDFLayoutListPoolBestOfThreeSizeFactory.build(
          documentInfo,
          listInfo,
          competitions,
        );
      case Systems.JederGegenJeden:
        return PDFLayoutListPoolDeathMatchSizeFactory.build(
          documentInfo,
          listInfo,
          competitions,
        );
      case Systems.IJF:
      case Systems.KoSystem:
      case Systems.KoSystemWithDoubleRepechage:
        return PDFLayoutListTreeKoSystemWithDoubleRepechageSizeFactory.build(
          documentInfo,
          listInfo,
          competitions,
        );
      case Systems.DoubleKoSystemWithDoubleRepechage:
        return PDFLayoutListTreeDoubleKoSystemWithDoubleRepechageSizeFactory.build(
          documentInfo,
          listInfo,
          competitions,
        );
      default:
        throw new LayoutNotFoundWithSystem(listInfo.system);
    }
  }
}
