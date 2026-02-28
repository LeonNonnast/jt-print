import { PDFLayoutResultTable } from './pdf-layout-result-table';

export class PDFLayoutResultTableByNation extends PDFLayoutResultTable {
  protected sort() {
    this.athletes.sort((a, b) => {
      // Primary: nationCode
      if (a.nationCode !== b.nationCode)
        return a.nationCode > b.nationCode ? 1 : -1;
      // Secondary: weightedOrder (category ordering)
      if ((a.weightedOrder ?? 0) !== (b.weightedOrder ?? 0))
        return (a.weightedOrder ?? 0) - (b.weightedOrder ?? 0);
      // Tertiary: category name (ensures same category stays together)
      if ((a.category ?? '') !== (b.category ?? ''))
        return (a.category ?? '') > (b.category ?? '') ? 1 : -1;
      // Quaternary: rank within category
      return (a.rank ?? 0) - (b.rank ?? 0);
    });
  }

  async generateTable() {
    let nextRowIndex = this.doc.DOCUMENT_CONTENT_START;

    for (let i = 0; i < this.athletes.length; i++) {
      const athlete = this.athletes[i];

      nextRowIndex = await this._createGroupNation(
        athlete,
        nextRowIndex,
        true && i > 0,
      );

      nextRowIndex = await this._createGroupCategory(athlete, nextRowIndex);

      nextRowIndex = await this.generateTableItem(nextRowIndex, athlete);
    }
  }

  private async _createGroupCategory(athlete, nextRowIndex) {
    return await this.createGroupIfNew(
      'category',
      athlete,
      nextRowIndex,
      false,
    );
  }

  private async _createGroupNation(
    athlete,
    nextRowIndex,
    groupOnNewPage: boolean,
  ) {
    return await this.createGroupIfNew(
      'nationCode',
      athlete,
      nextRowIndex,
      groupOnNewPage,
      null,
    );
  }
}
