import { Injectable } from '@nestjs/common';
import { PDFLayoutSample } from './pdf-layouts/pdf-layout-sample';
import { DocumentInfo } from '../types/document-info.type';
import { Athlete } from '../types/athlete.type';
import { AthleteRegistration } from '../types/athlete-registration.type';
import { PDFLayoutResultTableByCategory } from './pdf-layouts/pdf-layout-result-table-by-category';
import { PDFLayoutResultTableByNation } from './pdf-layouts/pdf-layout-result-table-by-nation';
import { PDFLayoutAthleteTableByClub } from './pdf-layouts/pdf-layout-athlete-table-by-club';
import { PDFLayoutAthleteTableByCategory } from './pdf-layouts/pdf-layout-athlete-table-by-category';

import { PDFLayoutListFactory } from './pdf-layouts/pdf-layout-list-factory';
import { SystemListDto } from './dto/system-list.dto';
import { PdfLayoutStartCard } from './pdf-layouts/pdf-layout-start-cards';
import { PDFDocumentWrapper } from './pdf.document';
import { PDFLayoutAthleteTableForCrossCheck } from './pdf-layouts/pdf-layout-athlete-table-for-cross-check';
import { PDFLayoutBase } from './pdf-layouts/pdf-layout-base';
import { PdfLayoutCertificate } from './pdf-layouts/pdf-layout-certificate';
import { PdfLayoutCertificateMasters2025 } from './pdf-layouts/pdf-layout-certificate-Masters-2025';

@Injectable()
export class PdfService {
  /**
   * generates a sample pdf
   *
   * @param {DocumentInfo} documentInfo
   * @return {*}
   * @memberof PdfService
   */
  async generateSamplePdf(
    documentInfo: DocumentInfo,
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutSample(documentInfo);

    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a certificates
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}
   * @memberof PdfService
   */
  async generateCertificates(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = PdfLayoutCertificateMasters2025.Construct(
      documentInfo,
      athletes,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a table of athletes grouped by category
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateResultTableByCategory(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutResultTableByCategory(
      documentInfo,
      athletes,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a table of athletes grouped by nation
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateResultTableByNation(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutResultTableByNation(documentInfo, athletes);
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a table of athletes with weighted status grouped by nation
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateAthleteTableByClub(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutAthleteTableByClub(documentInfo, athletes);
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a table of athletes with weighted status grouped by category
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateAthleteTableByCategory(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutAthleteTableByCategory(
      documentInfo,
      athletes,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates a table of athletes with weighted status grouped by category and nation
   *
   * @param {DocumentInfo} documentInfo
   * @param {Athlete[]} athletes
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateAthleteTableForCrossCheck(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = new PDFLayoutAthleteTableForCrossCheck(
      documentInfo,
      athletes,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates fight list
   *
   * @param {DocumentInfo} documentInfo
   * @param {Competition[]} competitions
   * @param {Systems} system
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateList(data: SystemListDto): Promise<PDFKit.PDFDocument> {
    const pdfLayout = PDFLayoutListFactory.build(
      data.listInfo,
      data.documentInfo,
      data.competitions,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  /**
   * generates start cards
   *
   * @param {DocumentInfo} documentInfo
   * @param {AthleteRegistration[]} athleteRegistrations
   * @return {*}  {PDFKit.PDFDocument}
   * @memberof PdfService
   */
  async generateStartCards(
    documentInfo: DocumentInfo,
    athleteRegistrations: AthleteRegistration[],
  ): Promise<PDFKit.PDFDocument> {
    const pdfLayout = PdfLayoutStartCard.Construct(
      documentInfo,
      athleteRegistrations,
    );
    return (await this.generateLayout(pdfLayout)).result();
  }

  private async generateLayout(pdfLayout: PDFLayoutBase) {
    return await PDFDocumentWrapper.create(pdfLayout).generate();
  }
}
