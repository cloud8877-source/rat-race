export type Profession = {
  id: string;
  title: string;
  description: string;
  salary: number;
  savings: number;
  expenses: {
    taxes: number;
    mortgage: number;
    schoolLoans: number;
    carLoans: number;
    creditCard: number;
    other: number;
    perChild: number;
  };
  liabilities: {
    mortgage: number;
    schoolLoans: number;
    carLoans: number;
    creditCard: number;
  };
};

export type AssetType =
  | "stock"
  | "realEstate"
  | "business"
  | "crypto"
  | "bonds"
  | "gold";
export type RiskLevel = "low" | "medium" | "high" | "extreme";

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  purchasePrice: number;
  currentValue: number;
  monthlyIncome: number; // Cash flow
  risk: RiskLevel;
  liquidityDays: number; // How fast can it be sold
  purchaseRound: number;
  quantity?: number; // For stocks/crypto
}

export interface Liability {
  id: string;
  name: string;
  amount: number;
  monthlyPayment: number;
  interestRate?: number;
}

export interface PlayerFinances {
  cashOnHand: number;
  monthlyIncome: number; // Salary + Passive
  monthlyExpenses: number;
  passiveIncome: number;
  totalIncome: number;
  netWorth: number;
}

export interface Decision {
  id: string;
  eventId: string;
  choiceId: string;
  round: number;
  timestamp: number;
}

export interface Player {
  id: string;
  userId: string;
  name: string;
  age: number;
  profession: Profession;
  finances: PlayerFinances;
  assets: Asset[];
  liabilities: Liability[];
  childrenCount: number;
  isRetired: boolean;
  isFinancialFree: boolean;
  decisions: Decision[];
}

export type EventType = "market" | "personal" | "opportunity" | "crisis";

export interface ChoiceConsequence {
  immediate?: {
    cash?: number;
    asset?: Asset;
    liability?: Liability;
  };
  recurring?: {
    passiveIncome?: number;
    expenses?: number;
  };
  risk?: RiskLevel;
}

export interface Choice {
  id: string;
  label: string;
  description: string;
  consequences: ChoiceConsequence;
}

export interface GameEvent {
  id: string;
  round: number;
  type: EventType;
  title: string;
  description: string;
  choices: Choice[];
  aiGenerated: boolean;
  educationalContent?: string;
}

export interface MarketConditions {
  trend: "bull" | "bear" | "stable";
  inflationRate: number;
  interestRate: number;
  realEstateMarket: number; // Multiplier 0.8 - 1.2
  stockMarket: number; // Multiplier 0.7 - 1.3
  cryptoMarket: number; // Multiplier 0.5 - 2.0
}

export type GamePhase = "setup" | "playing" | "completed";

export interface GameState {
  sessionId: string;
  currentRound: number;
  maxRounds: number;
  players: Player[];
  marketConditions: MarketConditions;
  activeEvents: GameEvent[];
  phase: GamePhase;
  winnerId?: string;
}
