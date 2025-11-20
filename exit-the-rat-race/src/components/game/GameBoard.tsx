'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { FinancialDashboard } from './FinancialDashboard';
import { PlayerProfile } from './PlayerProfile';
import { AssetLiabilityList } from './AssetLiabilityList';
import { Button } from '@/components/ui/button';
import { Profession } from '@/types';

// Mock starting profession for now
const STARTING_PROFESSION: Profession = {
  id: 'engineer',
  title: 'Software Engineer',
  description: 'Writes code for money',
  salary: 8000,
  savings: 2000,
  expenses: {
    taxes: 1800,
    mortgage: 1200,
    schoolLoans: 300,
    carLoans: 200,
    creditCard: 150,
    other: 1000,
    perChild: 400
  },
  liabilities: {
    mortgage: 150000,
    schoolLoans: 20000,
    carLoans: 10000,
    creditCard: 3000
  }
};

export default function GameBoard() {
  const { gameState, currentPlayer, initGame, processRound } = useGameStore();

  useEffect(() => {
    if (!gameState) {
      const initialPlayer = {
        id: 'player-1',
        userId: 'user-1',
        name: 'Player 1',
        age: 25,
        profession: STARTING_PROFESSION,
        finances: {
          cashOnHand: STARTING_PROFESSION.savings,
          monthlyIncome: STARTING_PROFESSION.salary,
          monthlyExpenses: 0, // Will be calc by engine
          passiveIncome: 0,
          totalIncome: STARTING_PROFESSION.salary,
          netWorth: 0 // Will be calc by engine
        },
        assets: [],
        liabilities: [
          { id: 'l1', name: 'Mortgage', amount: STARTING_PROFESSION.liabilities.mortgage, monthlyPayment: STARTING_PROFESSION.expenses.mortgage },
          { id: 'l2', name: 'School Loans', amount: STARTING_PROFESSION.liabilities.schoolLoans, monthlyPayment: STARTING_PROFESSION.expenses.schoolLoans },
          { id: 'l3', name: 'Car Loans', amount: STARTING_PROFESSION.liabilities.carLoans, monthlyPayment: STARTING_PROFESSION.expenses.carLoans },
          { id: 'l4', name: 'Credit Card', amount: STARTING_PROFESSION.liabilities.creditCard, monthlyPayment: STARTING_PROFESSION.expenses.creditCard },
        ],
        childrenCount: 0,
        isRetired: false,
        isFinancialFree: false,
        decisions: []
      };
      
      initGame(initialPlayer);
    }
  }, [gameState, initGame]);

  if (!gameState || !currentPlayer) {
    return <div className="flex items-center justify-center h-screen text-white">Loading Game...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 font-sans text-slate-100">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Exit the Rat Race
          </h1>
          <p className="text-slate-400">Round {gameState.currentRound} / {gameState.maxRounds}</p>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={processRound}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg font-bold shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95"
          >
            Next Month (Payday)
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Profile & Stats */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <PlayerProfile player={currentPlayer} />
          <AssetLiabilityList player={currentPlayer} />
        </div>

        {/* Middle Column - Main Game Area */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <FinancialDashboard player={currentPlayer} />
          
          {/* Event Area Placeholder */}
          <div className="bg-slate-900 rounded-xl p-8 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-slate-500">
            <p className="mb-4">Game Events will appear here</p>
            <p className="text-sm">Current Phase: {gameState.phase}</p>
          </div>
        </div>

        {/* Right Column - Market & Tools */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="font-bold mb-4">Market Conditions</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Trend</span>
                <span className="capitalize text-blue-400">{gameState.marketConditions.trend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Inflation</span>
                <span>{(gameState.marketConditions.inflationRate * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Interest Rate</span>
                <span>{(gameState.marketConditions.interestRate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
