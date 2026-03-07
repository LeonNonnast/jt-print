import { PDFLayoutBase } from './pdf-layout-base';
import { PDFComponentHeader } from './pdf-component-header';
import * as fs from 'fs';
import * as path from 'path';

export class PDFLayoutInvoice extends PDFLayoutBase {
  private invoiceData: any;
  private logoBuffer: Buffer | null = null;

  constructor(data: any) {
    // Pass a minimal documentInfo
    super({ title: 'Rechnung', logo: null } as any);
    this.invoiceData = data;

    const logoPath = path.resolve('./assets/img/jt-logo.png');
    if (fs.existsSync(logoPath)) {
      this.logoBuffer = fs.readFileSync(logoPath);
    }
  }

  protected getDocumentTitle(): string {
    return `Rechnung ${this.invoiceData.invoiceNumber}`;
  }

  public getHeaderComponent(): PDFComponentHeader | null {
    return null;
  }

  public getFooterComponent() {
    return null;
  }

  public async generate(): Promise<void> {
    const data = this.invoiceData;
    const doc = this.doc;

    doc.addPage({
      size: 'A4',
      margins: { top: 50, left: 50, bottom: 50, right: 50 },
    });

    const pageWidth = 595.28 - 100; // A4 width minus margins

    // Logo (top left)
    if (this.logoBuffer) {
      doc.image(this.logoBuffer, 50, 45, { width: 80 });
    }

    // Company header (right-aligned)
    doc.setFontBold();
    doc.fontSize(10);
    if (data.companyName) {
      doc.text(data.companyName, 50, 50, { align: 'right', width: pageWidth });
    }
    doc.setFontNormal();
    doc.fontSize(8);
    if (data.companyAddress) {
      const addressLines = data.companyAddress.split('\n');
      for (const line of addressLines) {
        doc.text(line, 50, doc.y, { align: 'right', width: pageWidth });
      }
    }
    if (data.taxId) {
      doc.text(`Steuernummer: ${data.taxId}`, 50, doc.y + 5, {
        align: 'right',
        width: pageWidth,
      });
    }

    // Customer address (left)
    const customerY = 160;
    doc.setFontNormal();
    doc.fontSize(10);
    doc.text(data.customerName || '', 50, customerY);
    if (data.customerAddress) {
      const lines = data.customerAddress.split('\n');
      for (const line of lines) {
        doc.text(line);
      }
    }

    // Invoice title + details
    const detailsY = 260;
    doc.setFontBold();
    doc.fontSize(16);
    doc.text('RECHNUNG', 50, detailsY);

    doc.setFontNormal();
    doc.fontSize(10);
    doc.text(`Rechnungsnummer: ${data.invoiceNumber}`, 50, detailsY + 30);

    // Format date
    let dateStr = data.date;
    try {
      const d = new Date(data.date);
      dateStr = d.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {}
    doc.text(`Rechnungsdatum: ${dateStr}`, 50, doc.y + 3);

    if (data.servicePeriod) {
      doc.text(`Leistungszeitraum: ${data.servicePeriod}`, 50, doc.y + 3);
    }

    // Items table
    const tableY = doc.y + 25;
    const colX = { desc: 50, qty: 320, price: 380, total: 450 };

    // Table header
    doc.setFontBold();
    doc.fontSize(9);
    doc
      .moveTo(50, tableY - 5)
      .lineTo(50 + pageWidth, tableY - 5)
      .stroke('#333333');

    doc.text('Beschreibung', colX.desc, tableY);
    doc.text('Menge', colX.qty, tableY, { width: 50, align: 'right' });
    doc.text('Einzelpreis', colX.price, tableY, { width: 60, align: 'right' });
    doc.text('Gesamt', colX.total, tableY, { width: 50, align: 'right' });

    doc
      .moveTo(50, tableY + 15)
      .lineTo(50 + pageWidth, tableY + 15)
      .stroke('#333333');

    // Table rows
    doc.setFontNormal();
    let rowY = tableY + 25;

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        doc.text(item.description || '', colX.desc, rowY, { width: 260 });
        doc.text(String(item.quantity || 1), colX.qty, rowY, {
          width: 50,
          align: 'right',
        });
        doc.text(this.formatCurrency(item.unitPrice), colX.price, rowY, {
          width: 60,
          align: 'right',
        });
        doc.text(this.formatCurrency(item.total), colX.total, rowY, {
          width: 50,
          align: 'right',
        });
        rowY += 20;
      }
    }

    // Separator line
    doc
      .moveTo(300, rowY + 5)
      .lineTo(50 + pageWidth, rowY + 5)
      .stroke('#333333');

    // Totals
    const totalsX = 380;
    const totalsValX = 450;
    rowY += 15;

    doc.text('Netto:', totalsX, rowY, { width: 60, align: 'right' });
    doc.text(this.formatCurrency(data.amountNet), totalsValX, rowY, {
      width: 50,
      align: 'right',
    });

    rowY += 15;
    doc.text(`MwSt. ${data.taxRate}%:`, totalsX, rowY, {
      width: 60,
      align: 'right',
    });
    doc.text(this.formatCurrency(data.amountTax), totalsValX, rowY, {
      width: 50,
      align: 'right',
    });

    rowY += 15;
    doc
      .moveTo(300, rowY - 3)
      .lineTo(50 + pageWidth, rowY - 3)
      .stroke('#333333');

    doc.setFontBold();
    doc.text('Brutto:', totalsX, rowY, { width: 60, align: 'right' });
    doc.text(this.formatCurrency(data.amountGross), totalsValX, rowY, {
      width: 50,
      align: 'right',
    });

    // Payment terms
    doc.setFontNormal();
    doc.fontSize(9);
    rowY += 40;

    if (data.paymentTerms) {
      doc.text(data.paymentTerms, 50, rowY, { width: pageWidth });
      rowY += 20;
    }

    if (data.bankDetails) {
      doc.text(`Bankverbindung: ${data.bankDetails}`, 50, rowY, {
        width: pageWidth,
      });
    }

  }

  private formatCurrency(value: number | string): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0,00 EUR';
    return (
      num.toFixed(2).replace('.', ',') + ' EUR'
    );
  }
}
