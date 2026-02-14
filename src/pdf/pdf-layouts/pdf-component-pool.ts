import { ListInfo } from 'src/types/list-info.type';
import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';

export interface PoolDrawOptions {
  /** X offset for the pool table. Default: 25 */
  xStart?: number;
  /** Y offset for the pool table. Default: 90 */
  yStart?: number;
  /** If true, skip calling addPageAsync() before drawing. Default: false */
  skipAddPage?: boolean;
}

export abstract class PDFComponentPool {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected competitions: Competition[],
    protected listInfo: ListInfo,
  ) {}

  abstract draw(options?: PoolDrawOptions): Promise<number>;
}
