import { NotFoundException } from '@nestjs/common';
import { PDFComponentListTreeMainTable8 } from './pdf-component-list-tree-main-table-8';
import { PDFComponentListTreeMainTable16 } from './pdf-component-list-tree-main-table-16';
import { PDFComponentListTreeMainTable32 } from './pdf-component-list-tree-main-table-32';
import { PDFComponentListTreeMainTable64 } from './pdf-component-list-tree-main-table-64';
import { Competition } from 'src/types/competition.type';
import { PDFDocumentWrapper } from '../pdf.document';

export class PDFComponentListTreeMainTableFactory {
  public static build(
    size: number,
    doc: PDFDocumentWrapper,
    competitions: Competition[],
  ) {
    switch (size) {
      case 8:
        return new PDFComponentListTreeMainTable8(doc, competitions);
      case 16:
        return new PDFComponentListTreeMainTable16(doc, competitions);
      case 32:
        return new PDFComponentListTreeMainTable32(doc, competitions);
      case 64:
        return new PDFComponentListTreeMainTable64(doc, competitions);
      default:
        throw new NotFoundException('main table component not found');
    }
  }
}
