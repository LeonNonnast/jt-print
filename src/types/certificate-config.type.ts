export type CertificateTemplateId = 'classic' | 'elegant' | 'festive';

export interface CertificateConfig {
  templateId: CertificateTemplateId;
  clubName?: string;
  discipline?: string;
  logoBase64?: string;
  signatureBase64?: string;
  tournamentName: string;
  location?: string;
  date?: string;
}
