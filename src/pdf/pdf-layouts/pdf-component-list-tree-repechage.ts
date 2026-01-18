import { buildContainerOptions } from 'src/types/list-tree-container-options.type';
import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';

export abstract class PDFComponentListTreeRepechage {
  protected options = buildContainerOptions(100, 20);

  protected yStart = 90;

  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
  ) {}

  abstract draw(): Promise<void>;
}
