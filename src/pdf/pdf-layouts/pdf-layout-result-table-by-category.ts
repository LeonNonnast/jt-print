import { PDFLayoutResultTable } from './pdf-layout-result-table';

export class PDFLayoutResultTableByCategory extends PDFLayoutResultTable {
  readonly GROUPS = [{ fieldName: 'category', newPage: false }];

  protected sort() {
    this.athletes.sort((a, b) => {
      // Primary: weightedOrder (category ordering)
      if ((a.weightedOrder ?? 0) !== (b.weightedOrder ?? 0))
        return (a.weightedOrder ?? 0) - (b.weightedOrder ?? 0);
      // Secondary: category name (ensures same category stays together)
      if ((a.category ?? '') !== (b.category ?? ''))
        return (a.category ?? '') > (b.category ?? '') ? 1 : -1;
      // Tertiary: rank within category
      return (a.rank ?? 0) - (b.rank ?? 0);
    });
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
