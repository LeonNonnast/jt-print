import { PDFLayoutResultTable } from './pdf-layout-result-table';

export class PDFLayoutResultTableByNation extends PDFLayoutResultTable {
  protected sort() {
    this.athletes
      .sort((a, b) => (a.rank > b.rank ? 1 : -1))
      .sort((a, b) =>
        a.weightedOrder == b.weightedOrder
          ? 0
          : a.weightedOrder > b.weightedOrder
          ? 1
          : -1,
      )
      .sort((a, b) =>
        a.nationCode == b.nationCode ? 0 : a.nationCode > b.nationCode ? 1 : -1,
      );
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
