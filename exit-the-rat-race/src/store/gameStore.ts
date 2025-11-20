import { create } from 'zustand';
import { GameState, Player, Decision, Asset, GameEvent, Profession } from '@/types';
import { GameEngine } from '@/lib/game/GameEngine';

interface GameStore {
  gameState: GameState | null;
  currentPlayer: Player | null;
  isMultiplayer: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initGame: (player: Player, maxRounds?: number) => void;
  processRound: () => void;
  makeDecision: (decision: Decision) => void;
  buyAsset: (asset: Asset) => void;
  sellAsset: (assetId: string) => void;
  repayLiability: (liabilityId: string) => void;
  takeLoan: (amount: number) => void;
  addLog: (message: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  currentPlayer: null,
  isMultiplayer: false,
  isLoading: false,
  error: null,

  initGame: (player: Player, maxRounds = 55) => {
    const initialState: GameState = {
      sessionId: Math.random().toString(36).substr(2, 9),
      currentRound: 1,
      maxRounds,
      players: [player],
      marketConditions: {
        trend: 'stable',
        inflationRate: 0.03,
        interestRate: 0.05,
        realEstateMarket: 1.0,
        stockMarket: 1.0,
        cryptoMarket: 1.0,
      },
      activeEvents: [],
      phase: 'playing',
    };

    set({ gameState: initialState, currentPlayer: player });
  },

  processRound: () => {
    const { currentPlayer, gameState } = get();
    if (!currentPlayer || !gameState) return;

    // 1. Process Payday
    const updatedPlayer = GameEngine.processPayday(currentPlayer);

    // 2. Check Victory
    const isWinner = GameEngine.checkVictory(updatedPlayer);

    // 3. Update Game State
    const nextRound = gameState.currentRound + 1;
    const updatedGameState: GameState = {
      ...gameState,
      currentRound: nextRound,
      players: gameState.players.map(p => p.id === updatedPlayer.id ? updatedPlayer : p),
      phase: isWinner ? 'completed' : (nextRound > gameState.maxRounds ? 'completed' : 'playing'),
      winnerId: isWinner ? updatedPlayer.id : undefined,
    };

    set({ 
      gameState: updatedGameState, 
      currentPlayer: updatedPlayer 
    });
  },

  makeDecision: (decision: Decision) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;
    
    const updatedPlayer = {
      ...currentPlayer,
      decisions: [...currentPlayer.decisions, decision]
    };
    
    set({ currentPlayer: updatedPlayer });
  },

  buyAsset: (asset: Asset) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    try {
      const updatedPlayer = GameEngine.buyAsset(currentPlayer, asset);
      set({ currentPlayer: updatedPlayer });
    } catch (error) {
      set({ error: (error as Error).message });
      setTimeout(() => set({ error: null }), 3000);
    }
  },

  sellAsset: (assetId: string) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    try {
      const updatedPlayer = GameEngine.sellAsset(currentPlayer, assetId);
      set({ currentPlayer: updatedPlayer });
    } catch (error) {
      set({ error: (error as Error).message });
      setTimeout(() => set({ error: null }), 3000);
    }
  },

  repayLiability: (liabilityId: string) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    try {
      const updatedPlayer = GameEngine.repayLiability(currentPlayer, liabilityId);
      set({ currentPlayer: updatedPlayer });
    } catch (error) {
      set({ error: (error as Error).message });
      setTimeout(() => set({ error: null }), 3000);
    }
  },

  takeLoan: (amount: number) => {
    const { currentPlayer } = get();
    if (!currentPlayer) return;

    try {
      const updatedPlayer = GameEngine.takeLoan(currentPlayer, amount);
      set({ currentPlayer: updatedPlayer });
    } catch (error) {
      set({ error: (error as Error).message });
      setTimeout(() => set({ error: null }), 3000);
    }
  },

  addLog: (message: string) => {
    console.log(`[Game Log]: ${message}`);
  }
}));
