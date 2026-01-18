import { PDFComponentPageTitle } from './pdf-component-header-page-title';

export class PDFComponentPageTitleList extends PDFComponentPageTitle {
  public async draw(): Promise<void> {
    this.doc.setFontNormal();
    this.doc.fontSize(14).text(this.pageTitle, 310, 20, { align: 'left' });
  }
}
