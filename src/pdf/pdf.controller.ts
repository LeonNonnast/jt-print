import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { SampleDto } from './dto/sample.dto';

// import { CompetitionTableDto } from './dto/competition-table.dto';
import { AthleteTableDto } from './dto/athlete-table.dto';
import { SystemListDto } from './dto/system-list.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AthleteRegistrationTableDto } from './dto/registration-table.dto';
import { DocumentInfo } from '../types/document-info.type';
import { AthleteRegistrationCertificationDto } from './dto/registration-certification';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  /**
   * endpoint to generate start cards per athlete
   * sorted by nation, association, lastname and firstname
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('start_cards')
  @ApiOperation({
    description: 'this endpoint generates start cards',
    summary: 'this endpoint generates start cards',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getStartCards(
    @Body() body: AthleteRegistrationTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument = await this.pdfService.generateStartCards(
      body.documentInfo,
      body.athleteRegistrations,
    );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate start cards per athlete
   * sorted by nation, association, lastname and firstname
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('certificates')
  @ApiOperation({
    description: 'this endpoint generates certificates',
    summary: 'this endpoint generates certificates',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteRegistrationCertificationDto })
  public async getCertificates(
    @Body() body: AthleteRegistrationCertificationDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument = await this.pdfService.generateCertificates(
      body.documentInfo,
      body.athletes,
    );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a sample pdf
   *
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('sample')
  @ApiOperation({
    description: 'this endpoint generates a sample pdf',
    summary: 'this endpoint generates a sample pdf',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getSample(@Body() body: SampleDto, @Res() res: Response) {
    const doc: PDFKit.PDFDocument = await this.pdfService.generateSamplePdf(
      body.documentInfo,
    );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a athlete-table pro category pdf
   *
   * @param {AthleteTableDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('athletes/category')
  @ApiOperation({
    description: 'this endpoint generates a athlete table grouped by category',
    summary:
      'endpoint generates a athlete table grouped by category. Columns are name, club, year, nation, weighed',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getAthletesByCategory(
    @Body() body: AthleteTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument =
      await this.pdfService.generateAthleteTableByCategory(
        body.documentInfo,
        body.athletes,
      );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a athlete-table pro category pdf
   *
   * @param {AthleteTableDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('athletes/cross_check')
  @ApiOperation({
    description:
      'this endpoint generates a athlete table grouped by category, nation and association',
    summary:
      'endpoint generates a athlete table grouped by category, nation and association. Columns are name, club, year, weighed',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getAthletesForCrossCheck(
    @Body() body: AthleteTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument =
      await this.pdfService.generateAthleteTableForCrossCheck(
        body.documentInfo,
        body.athletes,
      );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a athlete-table pro category pdf
   *
   * @param {AthleteTableDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('athletes/club')
  @ApiOperation({
    description: 'this endpoint generates a athlete table grouped by nation',
    summary:
      'endpoint generates a athlete table grouped by nation. Furthermore, for each nation it will be create a new page',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getAthletesByClub(
    @Body() body: AthleteTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument =
      await this.pdfService.generateAthleteTableByClub(
        body.documentInfo as DocumentInfo,
        body.athletes,
      );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a result-table pro category pdf
   *
   * @param {AthleteTableDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('results/category')
  @ApiOperation({
    description: 'this endpoint generates a results table grouped by category',
    summary: 'endpoint generates a athlete table grouped by category.',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getResultTableByCategory(
    @Body() body: AthleteTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument =
      await this.pdfService.generateResultTableByCategory(
        body.documentInfo,
        body.athletes,
      );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a result-table pro nation pdf
   *
   * @param {AthleteTableDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('results/nation')
  @ApiOperation({
    description: 'this endpoint generates a result table grouped by nation',
    summary:
      'endpoint generates a result table grouped by nation. Furthermore, for each nation it will be create a new page',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: AthleteTableDto })
  public async getResultTableByNation(
    @Body() body: AthleteTableDto,
    @Res() res: Response,
  ) {
    const doc: PDFKit.PDFDocument =
      await this.pdfService.generateResultTableByNation(
        body.documentInfo,
        body.athletes,
      );
    doc.pipe(res as any);
  }

  /**
   * endpoint to generate a result-table pro category pdf
   *
   * @param {SystemDto} body
   * @param {Response} res
   * @memberof PdfController
   */
  @Post('lists')
  @ApiOperation({
    description: 'this endpoint generates a list based on provided system',
    summary:
      'endpoint generates a list based on provided system and competitions.',
  })
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'PDF is successfully generated' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: SystemListDto })
  public async getList(@Body() body: SystemListDto, @Res() res: Response) {
    const doc: PDFKit.PDFDocument = await this.pdfService.generateList(body);
    doc.pipe(res as any);
  }
}
