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
import { PDFComponentListTreeMainTable64 } from './pdf-component-list-tree-main-table-64';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFComponentListTreeKoSystemWithDoubleRepechage64 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-64';

export class PDFLayoutListTreeKoSystemWithDoubleRepechageSize64 extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected get totalPages(): number {
    return 4;
  }

  protected getListSize(): number {
    return 64;
  }
  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(200, 10);
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return new PDFComponentListTreeMainTable64(
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechage {
    return new PDFComponentListTreeKoSystemWithDoubleRepechage64(
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
  ): PDFLayoutListTreeKoSystemWithDoubleRepechageSize64 {
    return new PDFLayoutListTreeKoSystemWithDoubleRepechageSize64(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
