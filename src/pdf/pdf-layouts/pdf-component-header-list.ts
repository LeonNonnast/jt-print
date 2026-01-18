import { getSystemName, ListInfo } from '../../types/list-info.type';
import { DocumentInfo, getLocaleDate } from '../../types/document-info.type';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentQRCode } from './pdf-component-qrcode';
import { PDFDocumentWrapper } from '../pdf.document';
import { PDFComponentPageTitle } from './pdf-component-header-page-title';

export class PDFComponentHeaderList extends PDFComponentHeader {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected documentInfo: DocumentInfo,
    protected documentTitle: string,
    protected listInfo?: ListInfo,
    protected pageTitleComponent?: PDFComponentPageTitle,
    protected totalPages: Number = 1,
  ) {
    super(doc, documentInfo, documentTitle, listInfo, pageTitleComponent);
  }

  public async draw() {
    this.doc.image(
      this.documentInfo.logo ||
        this.documentInfo.tournamentName.indexOf('Masters') > 0
        ? './assets/img/logo_masters.png'
        : './assets/img/logo.png',
      25,
      15,
      { width: 50 },
    );

    this.doc.rect(300, 15, 270, 60).stroke();

    this.drawDocumentInfo();
    this.drawListInfo();

    this.drawPageTitle();

    //await this.drawQRCode();
  }

  private drawListInfo() {
    const positionRight = { align: 'right', width: 250 };
    const positionLeft = { align: 'left' };
    const size = `${this.listInfo.athleteCount} / ${this.listInfo.size}`;
    const page = `${this.doc.currentPage} / ${this.totalPages}`;

    const positionX = 310;
    this.doc.setFontBold();
    this.doc.fontSize(8);
    this.doc.text(
      `System: ${getSystemName(this.listInfo.system)}`,
      positionX,
      50,
      positionLeft,
    );

    this.doc.text(
      `Category: ${this.listInfo.category}`,
      positionX,
      60,
      positionLeft,
    );
    this.doc.fontSize(8);
    this.doc.setFontNormal();

    if (this.listInfo.status)
      this.doc.text(`Status: ${this.listInfo.status}`, 200, 44, {
        align: 'right',
      });

    this.doc
      .text(`Size: ${size} | Page: ${page}`, positionX, 60, positionRight)
      .moveDown();
  }

  private drawDocumentInfo() {
    this.doc.setFontBold();
    this.doc.fontSize(8).text(this.documentInfo.tournamentName, 200, 25, {
      align: 'right',
    });

    this.doc.setFontNormal();
    this.doc
      .fontSize(8)
      .text(`Version: ${getLocaleDate(this.documentInfo)}`, 200, 35, {
        align: 'right',
      })
      .moveDown();
  }

  private drawPageTitle() {
    this.pageTitleComponent?.draw();
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
    ).draw();
  }
}
