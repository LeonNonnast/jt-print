import { PdfLayoutCertificate } from './pdf-layout-certificate';
import { DocumentInfo } from 'src/types/document-info.type';
import { Athlete } from 'src/types/athlete.type';
import { CertificateConfig } from 'src/types/certificate-config.type';

export class PdfLayoutCertificateClassic extends PdfLayoutCertificate {
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
    return new PdfLayoutCertificateClassic(
      documentInfo,
      athleteRegistrations,
      certificateConfig,
    );
  }

  protected getJtLogoPosition() {
    return { x: 510, y: 740, width: 45 };
  }

  protected printAthlete(_athlete: Athlete, _index: number): void {
    const options = {
      align: 'center',
    };

    const lineSpace = 30;
    const pageWidth = 612;

    let currentTopY = 575,
      fontSize = 24,
      currentBottomY = currentTopY + fontSize;

    // Athletenname mit dynamischer Font-Size
    this.doc.setScriptFont();
    const fullName = _athlete.firstName + ' ' + _athlete.lastName;
    fontSize = this.calculateFontSize(fullName, 500, 34);
    this.doc.fontSize(fontSize);
    this.drawText(fullName, currentTopY, options);

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace;

    // Platzierung
    this.doc.setFontNormal();
    fontSize = 28;
    this.doc.fontSize(fontSize);
    let rankText = _athlete.rank + '. Sieger';
    this.drawText(rankText, currentTopY, options);

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace;

    // Gewichtsklasse / Kategorie + optionale Disziplin
    let categoryText = this.formatCategory(_athlete.category);
    if (this.certificateConfig?.discipline) {
      categoryText += ' — ' + this.certificateConfig.discipline;
    }
    this.drawText(categoryText, currentTopY, options);

    currentBottomY = currentTopY + fontSize;

    // Fußzeile: Ort+Datum links, Unterschrift rechts
    const footerY = 720;
    const location = this.certificateConfig?.location || '';
    const date = this.certificateConfig?.date || '';
    let locationDate = [location, date].filter(Boolean).join(', ');

    this.doc.setFontNormal();
    fontSize = 14;
    this.doc.fontSize(fontSize);
    if (locationDate) {
      this.drawText(locationDate, footerY + 10, { align: 'left' });
    }

    this.drawSignature(250, footerY, 130);
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
