import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { Competition } from '../../types/competition.type';
import {
  ContainerOptions,
  buildContainerOptions,
} from '../../types/list-tree-container-options.type';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { LayoutNotFoundWithSize } from 'src/types/layout-not-found-with-size.exception';
import { PDFComponentListTreeMainTableFactory } from './pdf-component-list-tree-main-table-factory';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechageFactory } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage-factory';

export class PDFLayoutListTreeDoubleKoSystemWithDoubleRepechage extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected getListSize(): number {
    const athleteCount = this.listInfo.athleteCount;
    if (athleteCount < 7 || athleteCount > 129) {
      throw new LayoutNotFoundWithSize(athleteCount);
    }

    if (athleteCount <= 8) return 8;
    if (athleteCount <= 16) return 16;
    if (athleteCount <= 32) return 32;
    if (athleteCount <= 64) return 64;
    if (athleteCount <= 128) return 128;
  }

  protected get totalPages(): number {
    switch (this.getListSize()) {
      case 8:
        return 1;
      case 16:
        return 2;
      case 32:
        return 4;
      case 64:
        return 6;
      case 128:
        return 8;
    }
  }

  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(100, 20);
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return PDFComponentListTreeMainTableFactory.build(
      this.getListSize(),
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage {
    return PDFComponentListTreeRepechageDoubleKoWithDoubleRepechageFactory.Factory(
      this.getListSize(),
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == true,
      ),
    );
  }

  static Construct(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ): PDFLayoutListTreeDoubleKoSystemWithDoubleRepechage {
    return new PDFLayoutListTreeDoubleKoSystemWithDoubleRepechage(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
