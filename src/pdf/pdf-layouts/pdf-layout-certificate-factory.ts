import { DocumentInfo } from '../../types/document-info.type';
import { Athlete } from '../../types/athlete.type';
import {
  CertificateConfig,
  CertificateTemplateId,
} from '../../types/certificate-config.type';
import { PdfLayoutCertificate } from './pdf-layout-certificate';
import { PdfLayoutCertificateClassic } from './pdf-layout-certificate-classic';
import { PdfLayoutCertificateElegant } from './pdf-layout-certificate-elegant';
import { PdfLayoutCertificateFestive } from './pdf-layout-certificate-festive';

export abstract class PdfLayoutCertificateFactory {
  private static readonly VALID_TEMPLATES: ReadonlySet<CertificateTemplateId> =
    new Set(['classic', 'elegant', 'festive']);

  public static build(
    documentInfo: DocumentInfo,
    athletes: Athlete[],
    certificateConfig: CertificateConfig,
  ): PdfLayoutCertificate {
    if (!this.VALID_TEMPLATES.has(certificateConfig.templateId)) {
      console.warn(
        `Unknown templateId "${certificateConfig.templateId}", falling back to "classic"`,
      );
    }
    switch (certificateConfig.templateId) {
      case 'classic':
        return PdfLayoutCertificateClassic.Construct(
          documentInfo,
          athletes,
          certificateConfig,
        );
      case 'elegant':
        return PdfLayoutCertificateElegant.Construct(
          documentInfo,
          athletes,
          certificateConfig,
        );
      case 'festive':
        return PdfLayoutCertificateFestive.Construct(
          documentInfo,
          athletes,
          certificateConfig,
        );
      default:
        return PdfLayoutCertificateClassic.Construct(
          documentInfo,
          athletes,
          certificateConfig,
        );
    }
  }
}
