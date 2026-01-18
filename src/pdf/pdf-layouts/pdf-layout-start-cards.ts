import { DocumentInfo } from '../../types/document-info.type';
import { PDFLayoutBase } from './pdf-layout-base';
import { AthleteRegistration } from '../../types/athlete-registration.type';
import { BarcodeHelper } from 'src/utils/barcode-helper';
import { PDFComponentHeaderFullSize } from './pdf-component-header-full-size';

export class PdfLayoutStartCard extends PDFLayoutBase {
  protected constructor(
    documentInfo: DocumentInfo,
    protected athleteRegistrations: AthleteRegistration[] = [],
  ) {
    super(documentInfo);
  }

  public static Construct(
    documentInfo: DocumentInfo,
    athleteRegistrations: AthleteRegistration[] = [],
  ) {
    return new PdfLayoutStartCard(documentInfo, athleteRegistrations);
  }

  /**
   * get component for header
   *
   * @public
   * @return {*}  {string}
   * @memberof PDFLayoutBase
   */
  public getHeaderComponent() {
    return new PDFComponentHeaderFullSize(
      this.doc,
      this.documentInfo,
      this.getDocumentTitle(),
    );
  }

  public async generate(): Promise<void> {
    await this.doc.addPageAsync();
    for (let i = 0; i < this.athleteRegistrations.length; i++) {
      const _athleteRegistration = this.athleteRegistrations[i];
      if (i == 0) this.doc.initForm();
      else {
        await this.doc.addPageAsync();
      }

      this.addStartCard(_athleteRegistration, i);
    }
  }

  protected addStartCard(
    _athleteRegistration: AthleteRegistration,
    _index: number,
  ) {
    const yStart = 100,
      yStep = 50;

    this.addFormField(
      'Firstname',
      yStart,
      _athleteRegistration.firstName,
      _index,
    );

    this.addFormField(
      'Surname',
      yStart + yStep,
      _athleteRegistration.lastName,
      _index,
    );

    this.addFormField(
      'Club',
      yStart + yStep * 2,
      _athleteRegistration.clubName,
      _index,
    );

    this.addFormField(
      'Nation',
      yStart + yStep * 3,
      _athleteRegistration.nationCode,
      _index,
    );

    this.addFormField(
      'Year of birth',
      yStart + yStep * 4,
      _athleteRegistration.yearOfBirth,
      _index,
    );

    this.addFormField(
      'Category',
      yStart + yStep * 5,
      _athleteRegistration.category,
      _index,
    );

    this.addFormField('weighed?', yStart + yStep * 6, false, _index);

    if (_athleteRegistration.id) {
      const code128StringValue = _athleteRegistration.id;
      const code128 = BarcodeHelper.encodeToCode128(code128StringValue);
      this.doc.setCode128();
      this.doc.text(code128, 50, 700, {
        align: 'center',
      });
      this.doc.setFontNormal();
      this.doc.fontSize(6);
      this.doc.text(code128StringValue, 50, this.doc.DOCUMENT_CONTENT_END, {
        align: 'center',
      });
    }
  }

  private addFormText(fieldName: string, y: number, options: object) {
    this.doc.formText('txt' + fieldName + y, 250, y + 10, 200, 24, options);
  }

  private addFormCheckBox(fieldName: string, y: number, options: object) {
    this.doc.formCheckbox('cb' + fieldName, 250, y + 10, 24, 24, options);
  }

  private addFormDate(fieldName: string, y: number, options: object) {
    const tmpOptions = {
      ...options,
      format: { type: 'date', param: 'yyyy' },
    };
    this.doc.formText('date' + fieldName, 250, y + 10, 200, 24, tmpOptions);
  }

  private addFormField(
    label: string,
    y: number,
    value: string | boolean,
    index: number,
    editable = true,
  ) {
    const options = {
      multiline: false,
      value: value,
      readOnly: false,
    };

    this.doc.fontSize(18);
    this.doc.text(label + ':', 50, y + 5, {
      align: 'right',
      width: 150,
    });

    if (editable) {
      this.doc.fontSize(22);
      this.doc.text(
        typeof value == 'boolean' ? (value ? '[ x ]' : '[  ]') : value,
        250,
        y + 5,
        {
          align: 'left',
          width: 200,
        },
      );
    } else {
      switch (typeof value) {
        case 'string':
          this.addFormText(label.trim() + index, y, options);
          break;
        case 'boolean':
          this.addFormCheckBox(label.trim() + index, y, options);
          break;
        case 'number':
          this.addFormDate(label.trim() + index, y, options);
          break;
      }
    }
  }

  protected getDocumentTitle(): string {
    return 'Startcard';
  }
}
