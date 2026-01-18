import { PDFLayoutResultTable } from './pdf-layout-result-table';

export class PDFLayoutResultTableByCategory extends PDFLayoutResultTable {
  readonly GROUPS = [{ fieldName: 'category', newPage: false }];

  protected sort() {
    this.athletes
      .sort((a, b) => (a.rank > b.rank ? 1 : -1))
      .sort((a, b) =>
        a.weightedOrder == b.weightedOrder
          ? 0
          : a.weightedOrder > b.weightedOrder
          ? 1
          : -1,
      );
  }

  protected async generateTable() {
    let nextRowIndex = this.doc.DOCUMENT_CONTENT_START;

    // nextRowIndex = this.generateTableHeader(nextRowIndex);

    for (let i = 0; i < this.athletes.length; i++) {
      const athlete = this.athletes[i];

      nextRowIndex = await this._createGroupCategory(athlete, nextRowIndex);

      nextRowIndex = await this.generateTableItem(nextRowIndex, athlete);
    }
  }

  private _createGroupCategory(athlete, nextRowIndex) {
    return this.createGroupIfNew('category', athlete, nextRowIndex, false);
  }
}
