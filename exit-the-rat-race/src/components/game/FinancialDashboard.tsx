import React from 'react';
import { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock UI components if not yet created, or we can create them inline for now
// For speed, I'll create simple versions of Card/Progress here if they don't exist, 
// but ideally we should have a separate UI library. 
// Since I haven't created the UI library components yet, I will assume standard HTML/Tailwind for now 
// or create a basic structure.

interface FinancialDashboardProps {
  player: Player;
}

export function FinancialDashboard({ player }: FinancialDashboardProps) {
  const progressToFreedom = Math.min(100, (player.finances.passiveIncome / player.finances.monthlyExpenses) * 100);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-4">Financial Freedom Progress</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-300">
            <span>Passive Income: ${player.finances.passiveIncome.toLocaleString()}</span>
            <span>Goal: ${player.finances.monthlyExpenses.toLocaleString()}</span>
          </div>
          <div className="h-4 w-full bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progressToFreedom}%` }}
            />
          </div>
          <p className="text-right text-xs text-emerald-400 font-mono">{progressToFreedom.toFixed(1)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Cash on Hand</h3>
          <p className="text-2xl font-bold text-white">${player.finances.cashOnHand.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Net Worth</h3>
          <p className="text-2xl font-bold text-purple-400">${player.finances.netWorth.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-green-400">+${player.finances.totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-medium text-slate-400 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-400">-${player.finances.monthlyExpenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <h3 className="text-sm font-medium text-slate-400 mb-2">Monthly Cashflow</h3>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-white">
            ${(player.finances.totalIncome - player.finances.monthlyExpenses).toLocaleString()}
          </p>
          <span className="text-sm text-slate-400 mb-1">/ month</span>
        </div>
      </div>
    </div>
  );
}
