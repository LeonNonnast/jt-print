import { PdfLayoutCertificate } from './pdf-layout-certificate';
import { DocumentInfo } from 'src/types/document-info.type';
import { Athlete } from 'src/types/athlete.type';
import { CertificateConfig } from 'src/types/certificate-config.type';

export class PdfLayoutCertificateElegant extends PdfLayoutCertificate {
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
    return new PdfLayoutCertificateElegant(
      documentInfo,
      athleteRegistrations,
      certificateConfig,
    );
  }

  protected getJtLogoPosition() {
    return { x: 510, y: 740, width: 40 };
  }

  protected printAthlete(_athlete: Athlete, _index: number): void {
    const pageWidth = 612;
    const centerX = pageWidth / 2;
    const lineSpace = 25;

    // Logo oben zentriert
    if (this.certificateConfig?.logoBase64) {
      this.drawLogo(centerX - 40, 100, 80);
    }

    // Dünne Trennlinie oben
    this.doc
      .lineWidth(0.5)
      .moveTo(150, 220)
      .lineTo(pageWidth - 150, 220)
      .stroke('#999999');

    // Turnierbezeichnung
    let currentY = 250;
    this.doc.setFontNormal();
    this.doc.fontSize(14);
    this.doc.fillColor('#666666');
    const tournamentName =
      this.certificateConfig?.tournamentName ||
      this.documentInfo.tournamentName;
    this.drawText(tournamentName, currentY, { align: 'center' });

    currentY += 60;

    // Athletenname gross und zentriert
    this.doc.setScriptFont();
    const fullName = _athlete.firstName + ' ' + _athlete.lastName;
    const fontSize = this.calculateFontSize(fullName, 400, 34);
    this.doc.fontSize(fontSize);
    this.doc.fillColor('#000000');
    this.drawText(this.truncate(fullName, 40), currentY, { align: 'center', width: pageWidth - 100 });

    currentY += fontSize + lineSpace;

    // Dünne Trennlinie unter Name
    this.doc
      .lineWidth(0.5)
      .moveTo(200, currentY)
      .lineTo(pageWidth - 200, currentY)
      .stroke('#999999');

    currentY += lineSpace;

    // Platzierung
    this.doc.setFontNormal();
    this.doc.fontSize(24);
    this.doc.fillColor('#333333');
    this.drawText(_athlete.rank + '. Platz', currentY, { align: 'center' });

    currentY += 24 + lineSpace;

    // Gewichtsklasse / Kategorie
    this.doc.fontSize(18);
    const categoryText = this.formatCategory(_athlete.category);
    this.drawText(categoryText, currentY, { align: 'center' });

    currentY += 18 + lineSpace * 2;

    // Vereinsname zentriert
    if (this.certificateConfig?.clubName) {
      this.doc.fontSize(12);
      this.doc.fillColor('#666666');
      this.drawText(this.certificateConfig.clubName, currentY, { align: 'center' });
    }

    // Fußzeile: Ort+Datum links, Unterschrift rechts
    const footerY = 710;
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
