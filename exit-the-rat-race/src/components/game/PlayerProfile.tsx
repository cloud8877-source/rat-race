import React from 'react';
import { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlayerProfileProps {
  player: Player;
}

export function PlayerProfile({ player }: PlayerProfileProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex justify-between items-center">
          <span>{player.name}</span>
          <span className="text-sm font-normal text-slate-400">Age: {player.age}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-400">Profession</p>
            <p className="font-medium">{player.profession.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-400">Salary</p>
              <p className="font-medium text-green-400">${player.profession.salary.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Children</p>
              <p className="font-medium">{player.childrenCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
