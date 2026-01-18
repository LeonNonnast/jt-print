import { DocumentInfo } from 'src/types/document-info.type';
import { Athlete } from 'src/types/athlete.type';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentHeaderFullSize } from './pdf-component-header-full-size';
import { PDFLayoutTable } from './pdf-layout-table';

export abstract class PDFLayoutAthleteTable extends PDFLayoutTable {
  readonly columns = [];

  constructor(documentInfo: DocumentInfo, protected athletes: Athlete[] = []) {
    super(documentInfo);
  }

  /**
   * sort athlete table to simplify grouping
   *
   * @protected
   * @abstract
   * @memberof PDFLayoutAthleteTable
   */
  protected abstract sort();

  public async generate() {
    await this.doc.addPageAsync();
    this.setFontNormal();
    this.sort();
    await this.generateTable();
  }

  protected abstract generateTable(): Promise<void>;

  protected getDocumentTitle(): string {
    return 'List of athletes';
  }

  protected getAthleteText(count: number | string): string {
    return (count ? count : '') + (count == 1 ? ' Athlete' : ' Athletes');
  }

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
}
