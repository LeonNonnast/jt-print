import { ApiProperty } from '@nestjs/swagger';
import { DocumentInfo } from '../../types/document-info.type';

export class SafariLaufzettelParticipantDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  verein: string;

  @ApiProperty()
  altersklasse: string;

  @ApiProperty()
  gewicht: string;

  @ApiProperty({ required: false })
  vorjahresTeilnahme?: boolean;

  @ApiProperty({ required: false })
  budo?: {
    siege: number;
    gesamt: number;
    platzierung: number;
    punkte: number;
  };

  @ApiProperty({ required: false })
  kreativ?: {
    platzierung: number;
    punkte: number;
  };

  @ApiProperty({ required: false })
  lauf?: {
    versuche: { nummer: number; zeit: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };

  @ApiProperty({ required: false })
  sprung?: {
    versuche: { nummer: number; weite: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };

  @ApiProperty({ required: false })
  wurf?: {
    versuche: { nummer: number; weite: string }[];
    bestIndex?: number;
    platzierung: number;
    punkte: number;
  };

  @ApiProperty({ required: false })
  gesamtPunkte?: number;

  @ApiProperty({ required: false })
  vorjahresBonus?: number;

  @ApiProperty({ required: false })
  leistungsklasse?: {
    name: string;
    text: string;
  };
}

export class SafariLaufzettelRequestDto {
  @ApiProperty({ type: DocumentInfo })
  documentInfo: DocumentInfo;

  @ApiProperty({ type: [SafariLaufzettelParticipantDto] })
  participants: SafariLaufzettelParticipantDto[];

  @ApiProperty()
  year: number;

  @ApiProperty({ required: false })
  empty?: boolean;
}
