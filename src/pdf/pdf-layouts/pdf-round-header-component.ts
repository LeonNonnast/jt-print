import { RoundHeaders } from 'src/types/round-headers.enum';
import { PDFDocumentWrapper } from '../pdf.document';

export class PDFRoundHeaderComponent {
  public constructor(
    protected doc: PDFDocumentWrapper,
    protected roundHeader: RoundHeaders,
    protected isPoolFinal: boolean = false,
  ) {
    this.setDefaultFont();
  }

  protected setDefaultFont() {
    this.doc.lineWidth(1);
    this.doc.fillColor('#000');
    this.doc.strokeColor('#444');
    this.doc.fontSize(9);
  }

  public async draw(x, y, w): Promise<void> {
    this.doc.text(this.roundHeader, x, y, {
      width: w,
      align: 'center',
    });

    if (this.isPoolFinal) {
      this.doc.fontSize(7);
      this.doc.text('(Pool Final)', x, y + 10, {
        width: w,
        align: 'center',
      });
    }
  }
}
