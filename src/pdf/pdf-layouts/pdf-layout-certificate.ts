import { Athlete } from 'src/types/athlete.type';
import { DocumentInfo } from '../../types/document-info.type';
import { CertificateConfig } from '../../types/certificate-config.type';
import { PDFLayoutBase } from './pdf-layout-base';
import * as fs from 'fs';
import * as path from 'path';

export abstract class PdfLayoutCertificate extends PDFLayoutBase {
  private jtLogoBase64: string | null = null;

  protected constructor(
    documentInfo: DocumentInfo,
    protected athletes: Athlete[] = [],
    protected certificateConfig?: CertificateConfig,
  ) {
    super(documentInfo);
    const logoPath = path.resolve('./assets/img/jt-logo.png');
    if (fs.existsSync(logoPath)) {
      this.jtLogoBase64 = fs.readFileSync(logoPath).toString('base64');
    }
  }

  protected abstract getJtLogoPosition(): { x: number; y: number; width: number };

  public async generate(): Promise<void> {
    for (let i = 0; i < this.athletes.length; i++) {
      await this.doc.addPageAsync();

      const _athleteRegistration = this.athletes[i];

      this.printAthlete(_athleteRegistration, i);

      // JT-Logo als allerletztes auf jeder Seite zeichnen
      const pos = this.getJtLogoPosition();
      this.drawJtLogo(pos.x, pos.y, pos.width);
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

  protected drawPointedLine(xFrom: number, yFrom: number, xTo: number, yTo: number) {
    this.doc
      .lineCap('round')
      .lineWidth(0.5)
      .moveTo(xFrom, yFrom)
      .lineTo(xTo, yTo)
      .dash(2, { space: 2 })
      .fillOpacity(0.5)
      .stroke()
      .undash()
      .fillOpacity(1);
  }

  protected truncate(text: string, maxLength = 200): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  }

  protected drawLogo(x: number, y: number, width: number): void {
    if (!this.certificateConfig?.logoBase64) return;
    const buffer = Buffer.from(this.certificateConfig.logoBase64, 'base64');
    this.doc.image(buffer, x, y, { width });
  }

  protected drawSignature(x: number, y: number, width: number, maxHeight = 40): void {
    if (this.certificateConfig?.signatureBase64) {
      const buffer = Buffer.from(
        this.certificateConfig.signatureBase64,
        'base64',
      );
      this.doc.image(buffer, x, y, { fit: [width, maxHeight] });
    } else {
      this.drawPointedLine(x, y + 20, x + width, y + 20);
    }
  }

  protected drawJtLogo(x: number, y: number, width: number): void {
    if (this.jtLogoBase64) {
      const buffer = Buffer.from(this.jtLogoBase64, 'base64');
      this.doc.image(buffer, x, y, { width });
    }
  }

  protected calculateFontSize(
    text: string,
    maxWidth: number,
    baseSize: number,
  ): number {
    if (text.length <= 25) return baseSize;
    const ratio = 25 / text.length;
    const reduced = Math.round(baseSize * ratio);
    return Math.max(reduced, 16);
  }

  protected formatCategory(category: string | undefined): string {
    if (!category) return '';
    if (/^\d+([.,]\d+)?$/.test(category.trim())) {
      return 'Gewichtsklasse ' + category + 'kg';
    }
    return category;
  }
}
