import * as PDFDocument from 'pdfkit';
import { PDFLayoutBase } from './pdf-layouts/pdf-layout-base';
import { DocumentInfo } from 'src/types/document-info.type';

export class PDFDocumentWrapper extends PDFDocument {
  public readonly DOCUMENT_CONTENT_START = 90;
  public readonly DOCUMENT_CONTENT_END = 750;

  private readonly FORMAT_OPTIONS_POINTS: string = '#';

  static readonly DEFAULT_PDF_DOCUMENT_OPTIONS: PDFKit.PDFDocumentOptions = {
    autoFirstPage: false,
    margins: { top: 10, left: 50, bottom: 10, right: 50 },
  };

  constructor(
    protected pdfLayout: PDFLayoutBase,
    options: PDFKit.PDFDocumentOptions,
  ) {
    super(options);
    this.setFontNormal();
  }

  public static create(
    pdfLayout: PDFLayoutBase,
    options: PDFKit.PDFDocumentOptions = PDFDocumentWrapper.DEFAULT_PDF_DOCUMENT_OPTIONS,
  ) {
    const doc = new PDFDocumentWrapper(pdfLayout, options);
    pdfLayout.setDocument(doc);
    return doc;
  }

  public currentPage = 0;

  public async generate(): Promise<PDFDocumentWrapper> {
    await this.pdfLayout.generate();
    return this;
  }

  public setFontNormal() {
    this.font('./assets/fonts/Montserrat-Light.ttf');
  }

  public setFontBold() {
    this.font('./assets/fonts/Montserrat-SemiBold.ttf');
    this.fontSize(9);
  }

  public setScriptFont() {
    this.font('./assets/fonts/Merienda-Bold.ttf');
    this.fontSize(9);
  }

  public setCode128() {
    this.font('./assets/fonts/code128.ttf');
    this.fontSize(40);
  }

  public getLogo(documentInfo: DocumentInfo) {
    return documentInfo.logo ||
      documentInfo.tournamentName.indexOf('Masters') > 0
      ? './assets/img/logo_masters.png'
      : './assets/img/logo.png';
  }

  public addPage(options?: PDFKit.PDFDocumentOptions): PDFKit.PDFDocument {
    super.addPage(options);
    this.currentPage++;
    return this;
  }

  /**
   * adds page with header and footer
   * @protected
   * @memberof PDFLayoutBase
   */
  public async addPageAsync(
    options?: PDFKit.PDFDocumentOptions,
  ): Promise<PDFDocumentWrapper> {
    this.addPage(options);

    await this.addHeader();
    await this.addFooter();

    return this;
  }
  public override rect(x: number, y: number, w: number, h: number): this {
    this.lineJoin('round');
    return super.rect(x, y, w, h);
  }

  public override lineTo(x: number, y: number): this {
    this.lineJoin('round');
    return super.lineTo(x, y);
  }

  /**
   * adds header of document
   *
   * @protected
   * @memberof PDFLayoutBase
   */
  protected async addHeader(): Promise<void> {
    await this.pdfLayout.getHeaderComponent()?.draw();
  }

  /**
   * adds a horizontal line
   *
   * @protected
   * @param {number} y
   * @param {string} [color]
   * @memberof PDFLayoutBase
   */
  public addHr(y: number, color?: string, lineWidth = 1.5) {
    this.moveTo(50, y).lineTo(560, y).lineWidth(lineWidth).stroke(color);
  }

  /**
   * adds footer
   *
   * @protected
   * @memberof PDFLayoutBase
   */
  protected async addFooter(): Promise<void> {
    await this.pdfLayout.getFooterComponent()?.draw();
  }

  /**
   * ends document and returns created document
   *
   * @return {*}  {PDFDocumentWrapper}
   * @memberof PDFLayoutBase
   */
  public result(): PDFDocumentWrapper {
    this.end();
    return this;
  }

  public formatPoints(_result: {
    athleteAPoints: string;
    athleteBPoints: string;
    isWinnerA: boolean;
  }) {
    switch (this.FORMAT_OPTIONS_POINTS) {
      case '#':
        return _result.isWinnerA
          ? _result.athleteAPoints
          : _result.athleteBPoints;
      case '##:##':
        return (
          (_result.athleteAPoints || '00') +
          ':' +
          (_result.athleteBPoints || '00')
        );
    }
    return '';
    // 01/07/10 instead of 00:10
    //
  }
}
