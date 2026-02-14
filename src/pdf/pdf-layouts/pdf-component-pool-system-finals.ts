import { Competition } from '../../types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';
import {
  buildContainerOptions,
  ContainerOptions,
} from '../../types/list-tree-container-options.type';
import { PDFComponentCompetitionTransfer } from './pdf-component-competition-transfer';

/**
 * Mini-Bracket component for Pool System finals.
 * Draws HF1, HF2 → Final, and optionally a 3rd place fight (repechage).
 *
 * Layout:
 *   HF1 ─┐
 *         ├── Final
 *   HF2 ─┘
 *
 *   (optional: 3rd Place below)
 *
 * All fight boxes use PDFComponentCompetitionTransfer which renders:
 *   - Short 5px transfer lines at the top-left and bottom-left (athlete entry points)
 *   - Athlete name area (width = containerOptions.w)
 *   - Fight number box (25px wide) on the right side of the athlete area
 *   - Result line extending right from the fight number box
 *
 * Internal geometry of a Transfer component (for reference):
 *   Total box width = 25 (transfer gap) + containerOptions.w + 25 (fight number) = 150
 *   Box height = rowHeight * 2 (two athlete rows)
 *   Fight number box: x = startX + 25 + w, width = 25
 *   Result line: from fight number box right edge, width = w - 25
 *   Center line (result exit): y = startY + rowHeight
 */
export class PDFComponentPoolSystemFinals {
  private containerOptions: ContainerOptions;
  private transferComponent: PDFComponentCompetitionTransfer;

  /**
   * Constant widths matching PDFComponentCompetitionTransfer internals
   */
  private readonly FIGHT_NUM_WIDTH = 25;

  constructor(
    private doc: PDFDocumentWrapper,
    private competitions: Competition[],
    private hasThirdPlaceFight: boolean,
  ) {
    this.containerOptions = buildContainerOptions(100, 15, 1);
    this.transferComponent = new PDFComponentCompetitionTransfer(
      this.doc,
      this.containerOptions,
      true,
    );
  }

  /**
   * Width of one fight box (transfer lines + athlete area + fight number)
   */
  private get fightBoxWidth(): number {
    return (
      this.FIGHT_NUM_WIDTH +
      this.containerOptions.w +
      this.FIGHT_NUM_WIDTH
    );
  }

  /**
   * Width of the result line extending right from the fight number box
   */
  private get resultLineWidth(): number {
    return this.containerOptions.w - this.FIGHT_NUM_WIDTH;
  }

  get totalHeight(): number {
    return this.hasThirdPlaceFight ? 250 : 160;
  }

  /**
   * Draw a small two-line origin label next to a transfer entry point.
   * e.g. "1st\nPool A" next to the top-left transfer line of HF1.
   */
  private drawOriginLabel(rank: string, pool: string, x: number, y: number): void {
    this.doc.fontSize(5);
    this.doc.fillColor('#666');
    this.doc.text(rank, x + 6, y - 6, { width: 25, align: 'center', lineGap: 0 });
    this.doc.text(pool, x + 6, y + 1, { width: 25, align: 'center', lineGap: 0 });
    this.doc.fillColor('#000');
    this.doc.fontSize(this.containerOptions.h - 7);
  }

  async draw(yStart: number): Promise<number> {
    const xStart = 30;
    const h = this.containerOptions.h; // row height (15)
    const boxHeight = h * 2; // height of one fight box (30)

    // Sort competitions by fight number
    const sorted = [...this.competitions].sort(
      (a, b) => a.fightNumber - b.fightNumber,
    );

    // Identify fights by type — Final is always the LAST fight (highest number)
    // Order without 3rd place: HF1, HF2, Final
    // Order with 3rd place:    HF1, HF2, 3rd Place, Final
    // 3rd place: isFinal=true AND isRepechage=true
    // Final:     isFinal=true AND isRepechage=false/undefined
    const finale = sorted.find((c) => c.isFinal && !c.isRepechage);
    const thirdPlace = sorted.find((c) => c.isFinal && c.isRepechage) || null;
    const halfFinals = sorted.filter((c) => !c.isFinal);
    const hf1 = halfFinals[0];
    const hf2 = halfFinals[1];

    if (!hf1 || !hf2 || !finale) return yStart;

    // ---- Vertical spacing between HF1 and HF2 ----
    const hfGap = 30;

    // ---- Draw round header ----
    this.doc.fontSize(9);
    this.doc.setFontBold();
    this.doc.text('Semi-Finals', xStart, yStart - 15, {
      width: 150,
      align: 'left',
    });
    this.doc.setFontNormal();

    // ---- Draw HF1 ----
    // HF1: Athlete A = 1st Pool A, Athlete B = 2nd Pool B
    const hf1Y = yStart;
    this.drawOriginLabel('1st', 'Pool A', xStart, hf1Y);
    this.drawOriginLabel('2nd', 'Pool B', xStart, hf1Y + boxHeight);
    await this.transferComponent.draw(
      hf1,
      xStart,
      hf1Y,
      h,
      false,
      false,
      false,
      true,
    );

    // ---- Draw HF2 ----
    // HF2: Athlete A = 1st Pool B, Athlete B = 2nd Pool A
    const hf2Y = hf1Y + boxHeight + hfGap;
    this.drawOriginLabel('1st', 'Pool B', xStart, hf2Y);
    this.drawOriginLabel('2nd', 'Pool A', xStart, hf2Y + boxHeight);
    await this.transferComponent.draw(
      hf2,
      xStart,
      hf2Y,
      h,
      false,
      false,
      false,
      true,
    );

    // ---- Calculate connector geometry ----
    const resultLineEndX = xStart + this.fightBoxWidth + this.resultLineWidth;

    // Center lines of HF1 and HF2 (where result lines are)
    const hf1CenterY = hf1Y + h;
    const hf2CenterY = hf2Y + h;
    const midY = (hf1CenterY + hf2CenterY) / 2;

    // ---- Draw bracket connector lines ----
    // Vertical line connecting HF1 result line end to HF2 result line end
    this.doc
      .moveTo(resultLineEndX, hf1CenterY)
      .lineTo(resultLineEndX, hf2CenterY)
      .stroke();

    // Horizontal line from midpoint to the Final's left edge
    const connectorLength = 20;
    this.doc
      .moveTo(resultLineEndX, midY)
      .lineTo(resultLineEndX + connectorLength, midY)
      .stroke();

    // ---- Draw Final ----
    const finaleX = resultLineEndX + connectorLength;
    const finaleY = midY - h; // center line at midY

    // Draw "Final" header
    this.doc.fontSize(9);
    this.doc.setFontBold();
    this.doc.text(
      'Final',
      finaleX,
      finaleY - 15,
      { width: 150, align: 'left' },
    );
    this.doc.setFontNormal();

    // Connect the horizontal connector to the Final's transfer entry points
    this.doc
      .moveTo(finaleX, finaleY)
      .lineTo(finaleX, finaleY + boxHeight)
      .stroke();

    await this.transferComponent.draw(
      finale,
      finaleX,
      finaleY,
      h,
      false,
      true, // print winner (it's the final)
      false,
      true, // draw nation code
    );

    let endY = Math.max(hf2Y + boxHeight, finaleY + boxHeight) + 10;

    // ---- Draw 3rd place fight ----
    if (this.hasThirdPlaceFight && thirdPlace) {
      const thirdPlaceGap = 30;
      const thirdY = endY + thirdPlaceGap;

      // Label
      this.doc.fontSize(9);
      this.doc.setFontBold();
      this.doc.text('3rd Place', xStart, thirdY - 15, {
        width: 200,
        align: 'left',
      });
      this.doc.setFontNormal();

      // 3rd place fight — receives losers from HF1 and HF2
      await this.transferComponent.draw(
        thirdPlace,
        xStart,
        thirdY,
        h,
        false,
        true, // print winner
        false,
        true, // draw nation code
      );

      endY = thirdY + boxHeight + 10;
    }

    return endY;
  }
}
