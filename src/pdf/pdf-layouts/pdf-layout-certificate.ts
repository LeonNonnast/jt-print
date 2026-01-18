import { Athlete } from 'src/types/athlete.type';
import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutBase } from './pdf-layout-base';

export abstract class PdfLayoutCertificate extends PDFLayoutBase {
  protected constructor(
    documentInfo: DocumentInfo,
    protected athletes: Athlete[] = [],
  ) {
    super(documentInfo);
  }

  public async generate(): Promise<void> {
    for (let i = 0; i < this.athletes.length; i++) {
      await this.doc.addPageAsync();

      const _athleteRegistration = this.athletes[i];

      this.printAthlete(_athleteRegistration, i);
    }
  }

  protected abstract printAthlete(
    _athleteRegistration: Athlete,
    _index: number,
  ): void;

  protected drawText(
    value: string,
    y: number,
    options: PDFKit.Mixins.TextOptions,
  ) {
    this.doc.text(value, 50, y, options);
  }

  protected drawPointedLine(xFrom, yFrom, xTo, yTo) {
    this.doc
      .lineCap('round')
      .lineWidth(0.5)
      .moveTo(xFrom, yFrom)
      .lineTo(xTo, yTo)
      .dash(2, { space: 2 })
      .fillOpacity(0.5)
      .stroke();
  }
}
