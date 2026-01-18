import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutList } from './pdf-layout-list';
import { Competition } from '../../types/competition.type';
import { Athlete } from '../../types/athlete.type';
import { ListInfo } from '../../types/list-info.type';
import { ContainerOptions } from 'src/types/list-tree-container-options.type';
import { PDFComponentListTreeMainTable } from './pdf-component-list-tree-main-table';
import { PDFComponentListTreeRepechage } from './pdf-component-list-tree-repechage';

export abstract class PDFLayoutListTree extends PDFLayoutList {
  protected abstract get mainTableComponent(): PDFComponentListTreeMainTable;
  protected abstract get repechageTableComponent(): PDFComponentListTreeRepechage;

  protected constructor(
    documentInfo: DocumentInfo,
    listInfo: ListInfo,
    competitions: Competition[],
  ) {
    super(documentInfo, listInfo, competitions);
  }

  protected abstract get containerOptions(): ContainerOptions;

  public async generate() {
    await this.generateMainTable();
    await this.generateRepechageTable();
  }

  protected async generateMainTable() {
    this.setPageTitle('Main Table');
    await this.mainTableComponent.draw();
  }

  protected async generateRepechageTable() {
    this.setPageTitle('Repechage');
    await this.repechageTableComponent.draw();
  }
}
