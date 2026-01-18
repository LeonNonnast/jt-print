import { DocumentInfo } from 'src/types/document-info.type';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentFooter } from './pdf-component-footer';
import { PDFComponentFooterDefault } from './pdf-component-footer-default';

export abstract class PDFLayoutBase {
  protected doc: PDFDocumentWrapper;

  readonly ROW_HEIGHT = 11;
  readonly ROW_GROUP_PADDING = 4;

  /**
   * Creates an instance of PDFLayoutBase.
   * @param {PDFKit.PDFDocumentOptions} [config={
   *       margins: { top: 10, left: 50, bottom: 10, right: 50 },
   *     }]
   * @memberof PDFLayoutBase
   */
  constructor(protected documentInfo: DocumentInfo) {}

  /**
   * get document title
   *
   * @public
   * @abstract
   * @return {*}  {string}
   * @memberof PDFLayoutBase
   */
  protected abstract getDocumentTitle(): string | null;

  /**
   * get component for header
   *
   * @public
   * @abstract
   * @return {*}  {PDFComponentHeader}
   * @memberof PDFLayoutBase
   */
  public abstract getHeaderComponent(): PDFComponentHeader | null;

  /**
   * generate document based on layout
   *
   * @protected
   * @abstract
   * @memberof PDFLayoutBase
   */
  public abstract generate(): Promise<void>;

  /**
   * get default component for footer
   *
   * @public
   * @return {*}  {PDFComponentFooter}
   * @memberof PDFLayoutBase
   */
  public getFooterComponent(): PDFComponentFooter | null {
    return new PDFComponentFooterDefault(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
    );
  }

  setDocument(_doc: PDFDocumentWrapper) {
    this.doc = _doc;
  }
}
