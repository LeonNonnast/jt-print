import { ListInfo } from 'src/types/list-info.type';
import { DocumentInfo } from '../../types/document-info.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentPageTitle } from './pdf-component-header-page-title';

export abstract class PDFComponentHeader {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected documentInfo: DocumentInfo,
    protected documentTitle: string,
    protected listInfo?: ListInfo,
    protected pageTitleComponent?: PDFComponentPageTitle,
  ) {}
  public abstract draw();

  /**
   * get component for header
   *
   * @public
   * @abstract
   * @return {*}  {PDFComponentHeader}
   * @memberof PDFLayoutBase
   */
  public abstract drawQRCode(): Promise<void>;
}
