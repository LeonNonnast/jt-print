import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutBase } from './pdf-layout-base';
import { PDFComponentHeader } from './pdf-component-header';
import { PDFComponentHeaderFullSize } from './pdf-component-header-full-size';

/**
 * Data for a single participant's Laufzettel
 */
export interface SafariLaufzettelParticipant {
  name: string;
  verein: string;
  altersklasse: string;
  gewicht: string;
  vorjahresTeilnahme?: boolean;
  budo?: {
    siege: number;
    gesamt: number;
    platzierung: number;
    punkte: number;
  };
  kreativ?: {
    platzierung: number;
    punkte: number;
  };
  lauf?: {
    versuche: { nummer: number; zeit: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };
  sprung?: {
    versuche: { nummer: number; weite: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };
  wurf?: {
    versuche: { nummer: number; weite: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };
  gesamtPunkte?: number;
  vorjahresBonus?: number;
  leistungsklasse?: {
    name: string;
    text: string;
  };
}

/**
 * DTO for the Safari Laufzettel endpoint
 */
export interface SafariLaufzettelDto {
  documentInfo: DocumentInfo;
  participants: SafariLaufzettelParticipant[];
  year: number;
  empty?: boolean;
}

export class PDFLayoutSafariLaufzettel extends PDFLayoutBase {
  protected constructor(
    documentInfo: DocumentInfo,
    private participants: SafariLaufzettelParticipant[],
    private year: number,
    private empty: boolean,
  ) {
    super(documentInfo);
  }

  static Construct(
    documentInfo: DocumentInfo,
    participants: SafariLaufzettelParticipant[],
    year: number,
    empty = false,
  ): PDFLayoutSafariLaufzettel {
    return new PDFLayoutSafariLaufzettel(
      documentInfo,
      participants,
      year,
      empty,
    );
  }

  protected getDocumentTitle(): string {
    return 'Judo Safari Laufzettel';
  }

  public getHeaderComponent(): PDFComponentHeader {
    return new PDFComponentHeaderFullSize(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
    );
  }

  public async generate(): Promise<void> {
    for (let i = 0; i < this.participants.length; i++) {
      await this.doc.addPageAsync();
      this.drawLaufzettel(this.participants[i]);
    }
  }

  private drawLaufzettel(participant: SafariLaufzettelParticipant): void {
    const leftMargin = 50;
    const pageWidth = 460;
    let y = 85;

    // Title is in the header already — no duplicate title needed

    // --- Participant Info ---
    this.doc.fontSize(10);
    y = this.drawInfoRow('Name:', participant.name, y);
    y = this.drawInfoRow('Verein:', participant.verein, y);
    y = this.drawInfoRow('Altersklasse:', participant.altersklasse, y);
    y = this.drawInfoRow('Gewicht:', participant.gewicht, y);
    y += 8;

    // --- Vorjahres-Teilnahme Checkbox ---
    this.doc.setFontNormal();
    this.doc.fontSize(10);
    const checkboxChecked =
      !this.empty && participant.vorjahresTeilnahme === true;
    const checkboxText = checkboxChecked ? '[X]' : '[  ]';
    this.doc.text(
      `${checkboxText}  Vorjahres-Teilnahme (+25 Punkte)`,
      leftMargin,
      y,
      { width: pageWidth },
    );
    y += 28;

    // --- Results Table ---
    y = this.drawResultsTable(participant, y);

    // --- Summary ---
    this.drawSummary(participant, y);
  }

  private drawInfoRow(label: string, value: string, y: number): number {
    const leftMargin = 50;
    this.doc.setFontBold();
    this.doc.fontSize(10);
    this.doc.text(label, leftMargin, y, { width: 110 });
    this.doc.setFontNormal();
    this.doc.fontSize(10);
    this.doc.text(
      this.empty ? '________________________________________' : value || '',
      165,
      y,
      { width: 350 },
    );
    return y + 18;
  }

  private drawResultsTable(
    participant: SafariLaufzettelParticipant,
    startY: number,
  ): number {
    // Column layout — "Rechnung"-style with 3 value columns
    // | Disziplin | W1 | W2 | W3 | Platz | Punkte |
    const col = {
      nameX: 50,
      nameW: 80,
      w1X: 135,
      w1W: 70,
      w2X: 210,
      w2W: 70,
      w3X: 285,
      w3W: 70,
      platzX: 430,
      platzW: 35,
      punkteX: 470,
      punkteW: 40,
    };
    const rowH = 20;
    let y = startY;

    // --- Table Header ---
    this.doc.setFontBold();
    this.doc.fontSize(8);
    this.doc.text('Disziplin', col.nameX, y + 4, { width: col.nameW });
    this.doc.text('Wertung 1', col.w1X, y + 4, { width: col.w1W, align: 'center' });
    this.doc.text('Wertung 2', col.w2X, y + 4, { width: col.w2W, align: 'center' });
    this.doc.text('Wertung 3', col.w3X, y + 4, { width: col.w3W, align: 'center' });
    this.doc.text('Platz', col.platzX, y + 4, { width: col.platzW, align: 'right' });
    this.doc.text('Punkte', col.punkteX, y + 4, { width: col.punkteW, align: 'right' });
    y += rowH;
    this.doc.addHr(y - 4, '#000000', 1);
    y += 4;

    // --- Kreativ ---
    y = this.drawDisciplineRow(
      'Kreativ',
      [this.empty ? '______' : ''],
      this.empty ? '' : String(participant.kreativ?.platzierung ?? '-'),
      this.empty ? '' : String(participant.kreativ?.punkte ?? '-'),
      y, rowH, col,
    );

    // --- Spacing ---
    y += 8;
    this.doc.addHr(y, '#e0e0e0', 0.5);
    y += 8;

    // --- Lauf ---
    y = this.drawDisciplineRow(
      'Lauf',
      this.getAttemptValues(participant.lauf?.versuche?.map((v) => `${v.zeit}s`), 3),
      this.empty ? '' : String(participant.lauf?.platzierung ?? '-'),
      this.empty ? '' : String(participant.lauf?.punkte ?? '-'),
      y, rowH, col,
      participant.lauf?.bestIndex,
    );

    // --- Spacing ---
    y += 8;
    this.doc.addHr(y, '#e0e0e0', 0.5);
    y += 8;

    // --- Sprung ---
    y = this.drawDisciplineRow(
      'Sprung',
      this.getAttemptValues(participant.sprung?.versuche?.map((v) => `${v.weite}m`), 3),
      this.empty ? '' : String(participant.sprung?.platzierung ?? '-'),
      this.empty ? '' : String(participant.sprung?.punkte ?? '-'),
      y, rowH, col,
      participant.sprung?.bestIndex,
    );

    // --- Spacing ---
    y += 8;
    this.doc.addHr(y, '#e0e0e0', 0.5);
    y += 8;

    // --- Wurf ---
    y = this.drawDisciplineRow(
      'Wurf',
      this.getAttemptValues(participant.wurf?.versuche?.map((v) => `${v.weite}m`), 3),
      this.empty ? '' : String(participant.wurf?.platzierung ?? '-'),
      this.empty ? '' : String(participant.wurf?.punkte ?? '-'),
      y, rowH, col,
      participant.wurf?.bestIndex,
    );

    // --- Spacing ---
    y += 8;
    this.doc.addHr(y, '#e0e0e0', 0.5);
    y += 8;

    // --- Budo ---
    const budoW1 = this.empty
      ? '__ / __'
      : participant.budo
        ? `${participant.budo.siege} / ${participant.budo.gesamt}`
        : '-';
    y = this.drawDisciplineRow(
      'Budo (Siege)',
      [budoW1],
      this.empty ? '' : String(participant.budo?.platzierung ?? '-'),
      this.empty ? '' : String(participant.budo?.punkte ?? '-'),
      y, rowH, col,
    );

    // --- Bottom line ---
    y += 6;
    this.doc.addHr(y, '#000000', 1);
    y += 10;

    return y;
  }

  /**
   * Get attempt values as array of 3 strings (fill with blanks if empty)
   */
  private getAttemptValues(values: string[] | undefined, count: number): string[] {
    if (this.empty) {
      return Array.from({ length: count }, () => '______');
    }
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(values && values[i] ? values[i] : '-');
    }
    return result;
  }

  /**
   * Draw a single discipline row with up to 3 value columns.
   * bestIndex (optional): index of the best attempt — rendered with underline.
   */
  private drawDisciplineRow(
    name: string,
    values: string[],
    platz: string,
    punkte: string,
    y: number,
    rowH: number,
    col: Record<string, number>,
    bestIndex?: number,
  ): number {
    // Discipline name (bold)
    this.doc.setFontBold();
    this.doc.fontSize(9);
    this.doc.text(name, col.nameX, y + 4, { width: col.nameW });

    // Value columns (normal, best attempt underlined)
    this.doc.setFontNormal();
    this.doc.fontSize(9);
    const valCols = [
      { x: col.w1X, w: col.w1W },
      { x: col.w2X, w: col.w2W },
      { x: col.w3X, w: col.w3W },
    ];
    for (let i = 0; i < values.length && i < 3; i++) {
      if (this.empty && values[i] === '______') {
        this.doc
          .rect(valCols[i].x + 10, y + 1, valCols[i].w - 20, rowH - 4)
          .lineWidth(0.5)
          .stroke('#cccccc');
      } else {
        const isBest = !this.empty && bestIndex != null && i === bestIndex;
        this.doc.text(values[i], valCols[i].x, y + 4, {
          width: valCols[i].w,
          align: 'center',
          underline: isBest,
        });
      }
    }

    // Platz — empty box or value
    if (this.empty && !platz) {
      this.doc
        .rect(col.platzX + 2, y + 1, col.platzW - 4, rowH - 4)
        .lineWidth(0.5)
        .stroke('#cccccc');
    } else {
      this.doc.text(platz, col.platzX, y + 4, { width: col.platzW, align: 'right' });
    }

    // Punkte — empty box or value
    if (this.empty && !punkte) {
      this.doc
        .rect(col.punkteX + 2, y + 1, col.punkteW - 4, rowH - 4)
        .lineWidth(0.5)
        .stroke('#cccccc');
    } else {
      this.doc.text(punkte, col.punkteX, y + 4, { width: col.punkteW, align: 'right' });
    }

    return y + rowH;
  }

  private drawSummary(participant: SafariLaufzettelParticipant, y: number): void {
    const rightEdge = 510;

    // --- Gesamtpunkte (right-aligned like invoice total) ---
    this.doc.setFontBold();
    this.doc.fontSize(10);
    const totalPunkte = this.empty
      ? '______'
      : String(participant.gesamtPunkte ?? 0);
    const bonus = this.empty
      ? '______'
      : String(participant.vorjahresBonus ?? 0);

    this.doc.text(`Gesamtpunkte:`, 50, y, { width: 200 });
    this.doc.text(totalPunkte, 400, y, { width: rightEdge - 400, align: 'right' });
    y += 18;

    this.doc.text(`Vorjahres-Bonus:`, 50, y, { width: 200 });
    this.doc.text(bonus, 400, y, { width: rightEdge - 400, align: 'right' });
    y += 16;

    // --- Line BETWEEN Bonus and Summe ---
    this.doc.addHr(y, '#000000', 0.5);
    y += 10;

    // --- Summe ---
    this.doc.setFontBold();
    this.doc.fontSize(11);
    const summe = this.empty
      ? '______'
      : String((participant.gesamtPunkte ?? 0) + (participant.vorjahresBonus ?? 0));
    this.doc.text(`Summe:`, 50, y, { width: 200 });
    this.doc.text(summe, 400, y, { width: rightEdge - 400, align: 'right' });
    y += 28;

    // --- Leistungsklasse (right-aligned) ---
    this.doc.setFontBold();
    this.doc.fontSize(12);
    const lkName = this.empty
      ? '________________________________'
      : participant.leistungsklasse?.name ?? '';
    this.doc.text('Leistungsklasse:', 50, y, { width: 200 });
    this.doc.text(lkName, 250, y, { width: rightEdge - 250, align: 'right' });
  }
}
