import { Athlete } from '../../types/athlete.type';
import { PDFLayoutBase } from './pdf-layout-base';

export abstract class PDFLayoutTable extends PDFLayoutBase {
  /**
   * table function to get next index
   * creates new page and resets 'next index' if end of document
   *
   * @protected
   * @param {number} currentIndex
   * @return {*}  {number}
   * @memberof PDFLayoutBase
   */
  protected async calculateNextRowIndex(currentIndex: number): Promise<number> {
    const nextRowIndex = currentIndex + this.ROW_HEIGHT;

    if (nextRowIndex >= this.doc.DOCUMENT_CONTENT_END) {
      await this.doc.addPageAsync();
      this.setFontNormal();
      return this.doc.DOCUMENT_CONTENT_START;
    }
    return currentIndex + this.ROW_HEIGHT;
  }

  /**
   * table function to create new row for groups
   * creates new page and resets 'next index' if groupOnNewPage is enabled
   *
   * @protected
   * @param {number} y
   * @param {string} nationCode
   * @param {boolean} [groupOnNewPage=false]
   * @return {*}  {number}
   * @memberof PDFLayoutBase
   */
  protected async generateTableGroupRow(
    y: number,
    groupTitle: string,
    groupOnNewPage = false,
    rightText = '',
  ): Promise<number> {
    let nextRowIndex = y + this.ROW_GROUP_PADDING;
    if (
      groupOnNewPage ||
      nextRowIndex + this.ROW_HEIGHT + this.ROW_GROUP_PADDING >=
        this.doc.DOCUMENT_CONTENT_END
    ) {
      await this.doc.addPageAsync();
      this.setFontNormal();
      nextRowIndex = this.doc.DOCUMENT_CONTENT_START;
    }

    this.doc.setFontBold();

    this.doc
      .text(groupTitle, 50, nextRowIndex, {
        align: 'left',
        width: 250,
      })
      .text(rightText, 300, nextRowIndex, {
        align: 'right',
        width: 260,
      });

    this.setFontNormal();

    return (
      (await this.calculateNextRowIndex(nextRowIndex)) + this.ROW_GROUP_PADDING
    );
  }

  protected setFontNormal() {
    this.doc.setFontNormal();
    this.doc.fontSize(9);
  }

  private groups = {};

  /**
   * table function to create a group row if value is not equal to last value
   *
   *
   * @protected
   * @param {string} fieldName property name to get value
   * @param {Athlete} athlete
   * @param {number} nextRowIndex
   * @param {boolean} [groupOnNewPage=false] when true, create new page for every group
   * @param {() => string} [fnGetRightText] will be called when group will be generated to get text for right site.
   * @return {*}  {number}
   * @memberof PDFLayoutResultTable
   */
  protected async createGroupIfNew(
    fieldName: string,
    athlete: Athlete,
    nextRowIndex: number,
    groupOnNewPage = false,
    fnCallbackIfFound?: () => void,
    fnGetRightText?: () => string,
  ): Promise<number> {
    if (this.groups[fieldName] != athlete[fieldName]) {
      this.groups[fieldName] = athlete[fieldName];

      nextRowIndex = await this.generateTableGroupRow(
        nextRowIndex,
        this.groups[fieldName],
        groupOnNewPage,
        fnGetRightText ? fnGetRightText() : undefined,
      );

      this.setFontNormal();

      if (fnCallbackIfFound && typeof fnCallbackIfFound == 'function')
        fnCallbackIfFound();
    }

    return nextRowIndex;
  }
}
