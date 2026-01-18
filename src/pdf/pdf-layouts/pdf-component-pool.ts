import { ListInfo } from 'src/types/list-info.type';
import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';

export abstract class PDFComponentPool {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
    protected listInfo: ListInfo,
  ) {}

  abstract draw(): Promise<void>;
}
