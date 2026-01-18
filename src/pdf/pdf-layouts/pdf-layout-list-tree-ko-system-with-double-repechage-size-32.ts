import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { Athlete } from '../../types/athlete.type';
import { Competition } from '../../types/competition.type';
import {
  ContainerOptions,
  buildContainerOptions,
} from '../../types/list-tree-container-options.type';
import { PDFComponentListTreeMainTable32 } from './pdf-component-list-tree-main-table-32';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFComponentListTreeKoSystemWithDoubleRepechage32 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-32';

export class PDFLayoutListTreeKoSystemWithDoubleRepechageSize32 extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected get totalPages(): number {
    return 2;
  }

  protected getListSize(): number {
    return 32;
  }

  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(100, 20);
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return new PDFComponentListTreeMainTable32(
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechage {
    return new PDFComponentListTreeKoSystemWithDoubleRepechage32(
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
  ): PDFLayoutListTreeKoSystemWithDoubleRepechageSize32 {
    return new PDFLayoutListTreeKoSystemWithDoubleRepechageSize32(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
