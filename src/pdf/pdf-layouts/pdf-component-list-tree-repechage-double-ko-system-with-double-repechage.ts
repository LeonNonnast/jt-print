import { Competition } from 'src/types/competition.type';
import { buildContainerOptions } from 'src/types/list-tree-container-options.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';

export abstract class PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage extends PDFComponentListTreeRepechage {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
  ) {
    super(doc, competitions);
    this.options = buildContainerOptions(75, 20);
    this.yStart = 70;
  }
}
