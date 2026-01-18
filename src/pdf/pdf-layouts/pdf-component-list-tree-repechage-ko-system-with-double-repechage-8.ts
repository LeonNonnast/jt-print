import { Competition } from 'src/types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentListTreeKoSystemWithDoubleRepechage16 } from './pdf-component-list-tree-repechage-ko-system-with-double-repechage-16';

export class PDFComponentListTreeKoSystemWithDoubleRepechage8 extends PDFComponentListTreeKoSystemWithDoubleRepechage16 {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
  ) {
    super(doc, competitions);
    this.yStart = 300;
  }
  async draw() {
    await super.draw();
  }
}
