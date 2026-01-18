import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutBase } from './pdf-layout-base';
import { Competition } from '../../types/competition.type';
import { Systems } from '../../types/systems.enum';
import { ListInfo } from '../../types/list-info.type';
import { PDFComponentHeaderList } from './pdf-component-header-list';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentPageTitleList } from './pdf-component-header-page-title-list';

export abstract class PDFLayoutList extends PDFLayoutBase {
  protected constructor(
    documentInfo: DocumentInfo,
    protected listInfo: ListInfo,
    protected competitions: Competition[] = [],
  ) {
    super(documentInfo);

    this.setListInfo();
  }

  protected abstract get totalPages(): number;

  protected pageTitleComponent: PDFComponentPageTitleList;

  protected getDocumentTitle(): string {
    return 'List of competitions';
  }

  /**
   * get component for header
   *
   * @public
   * @return {*}  {string}
   * @memberof PDFLayoutBase
   */
  public getHeaderComponent(): PDFComponentHeader {
    return new PDFComponentHeaderList(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
      this.listInfo,
      this.pageTitleComponent,
      this.totalPages,
    );
  }

  /**
   * set list information based on provided information to avoid false api usage
   * get system and sized based on layout.
   * set athlete count based on competitions
   * @private
   * @memberof PDFLayoutList
   */
  private setListInfo() {
    this.listInfo.size = this.getListSize();
    this.listInfo.athleteCount = this.listInfo.athleteCount;
  }

  protected setPageTitle(_pageTitle: string) {
    this.pageTitleComponent = new PDFComponentPageTitleList(
      this.doc,
      _pageTitle,
    );
  }

  protected abstract getListSystem(): Systems;

  protected abstract getListSize(): number;

  public abstract generate(): Promise<void>;
}
