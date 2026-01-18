import { getLocaleDate } from 'src/types/document-info.type';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentQRCode } from './pdf-component-qrcode';

export class PDFComponentHeaderFullSize extends PDFComponentHeader {
  public async draw(): Promise<void> {
    this.doc.setFontNormal();
    this.doc
      .image(this.doc.getLogo(this.documentInfo), 50, 15, {
        width: 50,
      })
      .fillColor('#444444')
      .fontSize(18)
      .text(this.documentTitle, 110, 20);

    this.doc
      .fontSize(10)
      .text(this.documentInfo.tournamentName, 0, 20, {
        align: 'right',
        width: this.documentInfo.qrCodeData ? 500 : 560,
      })
      .fontSize(8)
      .text(`Version: ${getLocaleDate(this.documentInfo)}`, 0, 30, {
        align: 'right',
        width: this.documentInfo.qrCodeData ? 500 : 560,
      })
      .moveDown();

    this.doc.addHr(70);

    //await this.drawQRCode();
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
        y: 5,
        x: 505,
        align: 'right',
      },
    ).draw();
  }
}
