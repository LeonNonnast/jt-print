import { PDFLayoutListTreeKoSystemWithDoubleRepechage } from './pdf-layout-list-tree-ko-system-with-double-repechage';
import { DocumentInfo } from '../../types/document-info.type';
import { ListInfo } from '../../types/list-info.type';
import { Athlete } from '../../types/athlete.type';
import { Competition } from '../../types/competition.type';
import {
  ContainerOptions,
  buildContainerOptions,
} from 'src/types/list-tree-container-options.type';
import { PDFComponentListTreeMainTable16 } from './pdf-component-list-tree-main-table-16';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';
import { PDFComponentListTreeKoSystemWithDoubleRepechage16 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-16';

export class PDFLayoutListTreeKoSystemWithDoubleRepechageSize16 extends PDFLayoutListTreeKoSystemWithDoubleRepechage {
  protected get totalPages(): number {
    return 1;
  }

  protected get containerOptions(): ContainerOptions {
    return buildContainerOptions(100, 20);
  }
  protected getListSize(): number {
    return 16;
  }

  protected get mainTableComponent(): PDFComponentListTreeMainTable {
    return new PDFComponentListTreeMainTable16(
      this.doc,
      this.competitions.filter(
        (_competition) => _competition.isRepechage == false,
      ),
    );
  }

  protected get repechageTableComponent(): PDFComponentListTreeRepechage {
    return new PDFComponentListTreeKoSystemWithDoubleRepechage16(
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
  ): PDFLayoutListTreeKoSystemWithDoubleRepechageSize16 {
    return new PDFLayoutListTreeKoSystemWithDoubleRepechageSize16(
      documentInfo,
      listInfo,
      competitions,
    );
  }
}
