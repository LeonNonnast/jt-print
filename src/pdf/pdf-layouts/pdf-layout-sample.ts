import { DocumentInfo } from '../../types/document-info.type';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentHeaderFullSize } from './pdf-component-header-full-size';
import { PDFLayoutBase } from './pdf-layout-base';

export class PDFLayoutSample extends PDFLayoutBase {
  constructor(documentInfo: DocumentInfo) {
    super(documentInfo);
  }

  public async generate() {
    await this.doc.addPageAsync();
  }

  protected getDocumentTitle(): string {
    return 'Sample Document';
  }

  /**
   * get component for header
   *
   * @public
   * @return {*}  {string}
   * @memberof PDFLayoutBase
   */
  public getHeaderComponent(): PDFComponentHeader {
    return new PDFComponentHeaderFullSize(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
    );
  }
}
