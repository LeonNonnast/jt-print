import { PdfLayoutCertificate } from './pdf-layout-certificate';
import { DocumentInfo } from 'src/types/document-info.type';
import { Athlete } from 'src/types/athlete.type';
import { CertificateConfig } from 'src/types/certificate-config.type';

export class PdfLayoutCertificateFestive extends PdfLayoutCertificate {
  private static readonly GOLD = '#C8A84E';

  protected constructor(
    documentInfo: DocumentInfo,
    athleteRegistrations: Athlete[] = [],
    certificateConfig?: CertificateConfig,
  ) {
    super(documentInfo, athleteRegistrations, certificateConfig);
  }

  public static Construct(
    documentInfo: DocumentInfo,
    athleteRegistrations: Athlete[] = [],
    certificateConfig?: CertificateConfig,
  ) {
    return new PdfLayoutCertificateFestive(
      documentInfo,
      athleteRegistrations,
      certificateConfig,
    );
  }

  private drawDecorativeBorder(): void {
    const gold = PdfLayoutCertificateFestive.GOLD;
    const margin = 30;
    const pageWidth = 612;
    const pageHeight = 792;

    // Äußerer Rahmen
    this.doc
      .lineWidth(2)
      .rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2)
      .stroke(gold);

    // Innerer Rahmen
    const innerMargin = margin + 8;
    this.doc
      .lineWidth(0.5)
      .rect(
        innerMargin,
        innerMargin,
        pageWidth - innerMargin * 2,
        pageHeight - innerMargin * 2,
      )
      .stroke(gold);
  }

  protected getJtLogoPosition() {
    return { x: 500, y: 705, width: 45 };
  }

  protected printAthlete(_athlete: Athlete, _index: number): void {
    const pageWidth = 612;
    const lineSpace = 30;

    // Dekorativer Rahmen
    this.drawDecorativeBorder();

    // Großer Titel
    let currentY = 100;
    this.doc.setScriptFont();
    this.doc.fontSize(42);
    this.doc.fillColor(PdfLayoutCertificateFestive.GOLD);
    this.drawText('URKUNDE', currentY, { align: 'center' });

    currentY += 70;

    // Logo zentriert unter Titel
    if (this.certificateConfig?.logoBase64) {
      this.drawLogo(pageWidth / 2 - 50, currentY, 100);
      currentY += 120;
    } else {
      currentY += 20;
    }

    // Turnierbezeichnung
    this.doc.setFontNormal();
    this.doc.fontSize(16);
    this.doc.fillColor('#333333');
    const tournamentName =
      this.certificateConfig?.tournamentName ||
      this.documentInfo.tournamentName;
    this.drawText(tournamentName, currentY, { align: 'center' });

    currentY += 50;

    // Athletenname in Script-Font
    this.doc.setScriptFont();
    const fullName = _athlete.firstName + ' ' + _athlete.lastName;
    const fontSize = this.calculateFontSize(fullName, 450, 36);
    this.doc.fontSize(fontSize);
    this.doc.fillColor('#000000');
    this.drawText(fullName, currentY, { align: 'center' });

    currentY += fontSize + lineSpace;

    // Platzierung prominent
    this.doc.setFontNormal();
    this.doc.fontSize(28);
    this.doc.fillColor(PdfLayoutCertificateFestive.GOLD);
    this.drawText(_athlete.rank + '. Platz', currentY, { align: 'center' });

    currentY += 28 + lineSpace;

    // Gewichtsklasse / Kategorie
    this.doc.fontSize(20);
    this.doc.fillColor('#333333');
    const categoryText = this.formatCategory(_athlete.category);
    this.drawText(categoryText, currentY, { align: 'center' });

    currentY += 20 + lineSpace;

    // Vereinsname
    if (this.certificateConfig?.clubName) {
      this.doc.fontSize(14);
      this.doc.fillColor('#666666');
      this.drawText(this.certificateConfig.clubName, currentY, {
        align: 'center',
      });
    }

    // Fußzeile: Ort+Datum links, Unterschrift rechts
    const footerY = 700;
    const location = this.certificateConfig?.location || '';
    const date = this.certificateConfig?.date || '';
    const locationDate = [location, date].filter(Boolean).join(', ');
    if (locationDate) {
      this.doc.setFontNormal();
      this.doc.fontSize(12);
      this.doc.fillColor('#666666');
      this.drawText(locationDate, footerY + 10, { align: 'left' });
    }

    this.drawSignature(250, footerY, 130);

    // Farbe zurücksetzen
    this.doc.fillColor('#000000');
  }

  protected getDocumentTitle(): null {
    return null;
  }
  public getHeaderComponent(): null {
    return null;
  }
  public getFooterComponent(): null {
    return null;
  }
}
