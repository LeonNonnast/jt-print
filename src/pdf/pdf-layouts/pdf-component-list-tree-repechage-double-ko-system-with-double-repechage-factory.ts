import { NotFoundException } from '@nestjs/common';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage32 } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage-32';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage64 } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage-64';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage16 } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage-16';
import { PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage8 } from './pdf-component-list-tree-repechage-double-ko-system-with-double-repechage-8';

export class PDFComponentListTreeRepechageDoubleKoWithDoubleRepechageFactory {
  public static Factory(size, doc, competitions) {
    switch (size) {
      case 8:
        return new PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage8(
          doc,
          competitions,
        );
      case 16:
        return new PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage16(
          doc,
          competitions,
        );
      case 32:
        return new PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage32(
          doc,
          competitions,
        );
      case 64:
        return new PDFComponentListTreeRepechageDoubleKoWithDoubleRepechage64(
          doc,
          competitions,
        );
      default:
        throw new NotFoundException('main table component not found');
    }
  }
}
