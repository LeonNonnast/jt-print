import { PDFComponentFooter } from './pdf-component-footer';
import { PDFComponentQRCode } from './pdf-component-qrcode';

export class PDFComponentFooterDefault extends PDFComponentFooter {
  public async draw(): Promise<void> {
    this.doc.setFontNormal();
    this.doc.addHr(this.doc.DOCUMENT_CONTENT_END + 15);
    this.doc.fontSize(8).text('Developed by Leon Nonnast', 50, 770, {
      align: 'center',
      width: 500,
    });

    await this.drawQRCode();
  }

  /**
   * get component for header
   *
   * @public
   * @abstract
   * @return {*}  {PDFComponentHeader}
   * @memberof PDFLayoutBase
   */
  public async drawQRCode(): Promise<void> {
    await new PDFComponentQRCode(
      this.doc,
      this.documentInfo,
      this.documentTitle,
      {
        y: 700,
        x: 505,
        align: 'right',
      },
    ).draw();
  }
}
