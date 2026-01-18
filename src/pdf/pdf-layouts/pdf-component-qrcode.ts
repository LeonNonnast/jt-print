import { DocumentInfo } from '../../types/document-info.type';
import { PDFDocumentWrapper } from '../pdf.document';
var QRCode = require('qrcode');

export class PDFComponentQRCode {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected documentInfo: DocumentInfo,
    protected documentTitle: string,
    protected options: {
      x: number;
      y: number;
      align: 'center' | 'right' | undefined;
    } = {
      x: 80,
      y: 10,
      align: undefined,
    },
  ) {}

  public get logo(): string {
    return this.doc.getLogo(this.documentInfo);
  }

  public async draw() {
    if (this.documentInfo.qrCodeData) {
      const url = await QRCode.toDataURL(this.documentInfo.qrCodeData);
      this.doc.image(
        Buffer.from(url.replace('data:image/png;base64,', ''), 'base64'),
        this.options.x,
        this.options.y,
        {
          width: 60,
          align: this.options.align,
        },
      );
    }
  }
}
