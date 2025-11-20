import React from 'react';
import { Player } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AssetLiabilityListProps {
  player: Player;
}

export function AssetLiabilityList({ player }: AssetLiabilityListProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 text-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Balance Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-900">
            <TabsTrigger value="assets">Assets</TabsTrigger>
            <TabsTrigger value="liabilities">Liabilities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets" className="space-y-4 mt-4">
            {player.assets.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No assets yet.</p>
            ) : (
              <div className="space-y-2">
                {player.assets.map((asset) => (
                  <div key={asset.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-sm">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-xs text-slate-400 capitalize">{asset.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400">+${asset.monthlyIncome}/mo</p>
                      <p className="text-xs text-slate-400">Val: ${asset.currentValue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="liabilities" className="space-y-4 mt-4">
            <div className="space-y-2">
              {player.liabilities.map((liability) => (
                <div key={liability.id} className="flex justify-between items-center p-2 bg-slate-700/50 rounded text-sm">
                  <div>
                    <p className="font-medium">{liability.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400">-${liability.monthlyPayment}/mo</p>
                    <p className="text-xs text-slate-400">Amt: ${liability.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
