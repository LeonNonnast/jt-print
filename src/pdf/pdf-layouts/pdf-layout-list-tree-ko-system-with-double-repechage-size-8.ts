import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { Athlete } from '../../types/athlete.type';
import { Competition } from '../../types/competition.type';
import {
  ContainerOptions,
  buildContainerOptions,
} from '../../types/list-tree-container-options.type';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentListTreeMainTable8 } from './pdf-component-list-tree-main-table-8';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFComponentListTreeKoSystemWithDoubleRepechage8 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-8';

export class PDFLayoutListTreeKoSystemWithDoubleRepechageSize8 extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected get totalPages(): number {
    return 1;
  }

  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(100, 20);
  }
  protected getListSize(): number {
    return 8;
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return new PDFComponentListTreeMainTable8(
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechage {
    return new PDFComponentListTreeKoSystemWithDoubleRepechage8(
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
  ): PDFLayoutListTreeKoSystemWithDoubleRepechageSize8 {
    return new PDFLayoutListTreeKoSystemWithDoubleRepechageSize8(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
