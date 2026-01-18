import { PDFDocumentWrapper } from '../pdf.document';

export abstract class PDFComponentPageTitle {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected pageTitle: string,
  ) {}
  public abstract draw();
}
