import { DocumentInfo } from 'src/types/document-info.type';
import { PDFDocumentWrapper } from '../pdf.document';

export abstract class PDFComponentFooter {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected documentInfo: DocumentInfo,
    protected documentTitle: string,
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
