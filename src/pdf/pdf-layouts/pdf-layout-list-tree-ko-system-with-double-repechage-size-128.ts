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
import { PDFComponentListTreeMainTable128 } from './pdf-component-list-tree-main-table-128';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFComponentListTreeKoSystemWithDoubleRepechage32 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-32';
import { PDFComponentListTreeKoSystemWithDoubleRepechage128 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-128';

export class PDFLayoutListTreeKoSystemWithDoubleRepechageSize128 extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected get totalPages(): number {
    return 6;
  }

  protected getListSize(): number {
    return 128;
  }
  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(200, 10);
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return new PDFComponentListTreeMainTable128(
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechage {
    return new PDFComponentListTreeKoSystemWithDoubleRepechage128(
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
  ): PDFLayoutListTreeKoSystemWithDoubleRepechageSize128 {
    return new PDFLayoutListTreeKoSystemWithDoubleRepechageSize128(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
