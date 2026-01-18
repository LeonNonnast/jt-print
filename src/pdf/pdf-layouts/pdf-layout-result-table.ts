import { DocumentInfo } from '../../types/document-info.type';
import { Athlete } from '../../types/athlete.type';
import { getFullName } from '../../types/athlete-registration.type';
import { PDFComponentHeaderFullSize } from './pdf-component-header-full-size';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFLayoutTable } from './pdf-layout-table';

export abstract class PDFLayoutResultTable extends PDFLayoutTable {
  constructor(documentInfo: DocumentInfo, protected athletes: Athlete[] = []) {
    super(documentInfo);
  }

  /**
   * sort athelte table to simplify grouping
   *
   * @protected
   * @abstract
   * @memberof PDFLayoutAthleteTable
   */
  protected abstract sort();

  /**
   * get component for header
   *
   * @public
   * @return {*}  {string}
   * @memberof PDFLayoutBase
   */
  public getHeaderComponent(): PDFComponentHeader {
    return new PDFComponentHeaderFullSize(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
    );
  }

  /**
   * sort athelte table to simplify grouping
   *
   * @protected
   * @abstract
   * @memberof PDFLayoutAthleteTable
   */
  protected filter() {
    this.athletes = this.athletes.filter(
      (athlete) => athlete.rank && athlete.rank <= 7,
    );
  }

  public async generate() {
    await this.doc.addPageAsync();
    this.setFontNormal();
    this.filter();
    this.sort();
    await this.generateTable();
  }

  protected abstract generateTable();

  protected async generateTableHeader(y): Promise<number> {
    this.doc.setFontBold();
    const nextRowIndex: number = await this.generateTableRow(
      y,
      'rank',
      'name',
      'club',
      'nation',
      'year',
    );
    this.setFontNormal();
    return nextRowIndex;
  }

  protected async generateTableItem(y, athlete: Athlete): Promise<number> {
    const nationSuffix =
      athlete.nationCode == 'GER' ? `-${athlete.associationCode}` : '';
    return await this.generateTableRow(
      y,
      athlete.rank,
      getFullName(athlete, 200),
      athlete.clubName,
      `${athlete.nationCode}${nationSuffix}`,
      athlete.yearOfBirth,
    );
  }

  private async generateTableRow(
    y,
    col1,
    col2,
    col3,
    col4,
    col5,
  ): Promise<number> {
    this.doc
      .text(col1, 35, y, { align: 'right', width: 10 })
      .text(col2, 50, y, { align: 'left', width: 150 })
      .text(col3, 200, y, { align: 'left', width: 200 })
      .text(col4, 400, y, { align: 'left', width: 50 })
      .text(col5, 500, y, { align: 'right', width: 60 });

    return await this.calculateNextRowIndex(y);
  }

  protected getDocumentTitle(): string {
    return 'Resultlist';
  }
}
