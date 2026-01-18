import { PDFLayoutListTree } from './pdf-layout-list-tree';
import { Systems } from '../../types/systems.enum';

export abstract class PDFLayoutListTreeKoSystemWithDoubleRepechage extends PDFLayoutListTree {
  protected getListSystem(): Systems {
    return Systems.KoSystemWithDoubleRepechage;
  }
}
