import { AthleteRegistration } from 'src/types/athlete-registration.type';
import { PdfLayoutCertificate } from './pdf-layout-certificate';
import { DocumentInfo, getLocaleDate } from 'src/types/document-info.type';
import { PDFComponentHeader } from './pdf-component-header';
import { Athlete } from 'src/types/athlete.type';
import { PDFComponentFooter } from './pdf-component-footer';
import { size } from 'pdfkit/js/page';
import { y } from 'pdfkit';

export class PdfLayoutCertificateMasters2025 extends PdfLayoutCertificate {
  protected constructor(
    documentInfo: DocumentInfo,
    athleteRegistrations: Athlete[] = [],
  ) {
    super(documentInfo, athleteRegistrations);
  }

  public static Construct(
    documentInfo: DocumentInfo,
    athleteRegistrations: Athlete[] = [],
  ) {
    return new PdfLayoutCertificateMasters2025(
      documentInfo,
      athleteRegistrations,
    );
  }

  protected printAthlete(_athlete: Athlete, _index: number): void {
    const options = {
      align: 'center',
    };

    const lineSpace = 30;

    let value = undefined,
      currentTopY = 575,
      fontSize = 24,
      currentBottomY = currentTopY + fontSize;

    this.doc.setScriptFont();
    fontSize = 34;
    this.doc.fontSize(fontSize);
    value = _athlete.firstName + ' ' + _athlete.lastName;
    this.drawText(value, currentTopY, options);

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace;

    this.doc.setFontNormal();
    fontSize = 28;

    this.doc.fontSize(fontSize);
    value = _athlete.rank + '. Sieger';
    this.drawText(value, currentTopY, options);

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace;

    value = 'Gewichtsklasse ' + _athlete.category + 'kg';
    this.drawText(value, currentTopY, options);

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace * 1.25;

    fontSize = 20;
    this.doc.fontSize(fontSize);
    value = 'Bremen, ' + getLocaleDate(this.documentInfo);
    this.drawText(value, currentTopY, {
      ...options,
      align: 'left',
    });

    currentBottomY = currentTopY + fontSize;
    currentTopY = currentBottomY + lineSpace;

    this.drawPointedLine(350, currentBottomY, 550, currentBottomY);
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
