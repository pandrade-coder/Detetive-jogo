
export type CardType = 'dossier' | 'evidence' | 'interrogation' | 'resource';

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  code: string;
  imageUrl?: string;
}

export interface DossierState {
  id: string;
  dossierCard: GameCard;
  assignedCards: GameCard[];
}

export interface GameState {
  hours: number;
  deck: GameCard[];
  revealedCards: GameCard[];
  hand: GameCard[];
  dossiers: DossierState[];
  isGameOver: boolean;
}
