import { useState } from 'react';
import { useTrends } from '../../hooks/useStats';
import { formatPrice } from '../../lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Loader } from '../ui/loader';
import type { PriceChange, TransferTrend } from '../../types/api';

type PriceTab = 'risers' | 'fallers';
type TransferTab = 'in' | 'out';

function PriceTable({ players }: { players: PriceChange[] }) {
  if (!players.length) return <p className="text-text-muted text-sm py-4 text-center">No price changes this GW</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-left py-2 px-2">Team</th>
            <th className="text-left py-2 px-2">Pos</th>
            <th className="text-center py-2 px-2">From</th>
            <th className="text-center py-2 px-2">To</th>
            <th className="text-center py-2 px-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-bg-card-hover transition-colors">
              <td className="py-2 px-2 font-medium">{p.webName}</td>
              <td className="py-2 px-2 text-text-secondary">{p.teamShortName}</td>
              <td className="py-2 px-2">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-medium bg-fpl-pitch/50 text-fpl-grass">
                  {p.position}
                </span>
              </td>
              <td className="py-2 px-2 text-center text-text-muted">{formatPrice(p.costBefore)}</td>
              <td className="py-2 px-2 text-center">{formatPrice(p.cost)}</td>
              <td className={`py-2 px-2 text-center font-bold ${p.costChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {p.costChange > 0 ? '+' : ''}{formatPrice(p.costChange)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TransferTable({ players, mode }: { players: TransferTrend[]; mode: TransferTab }) {
  if (!players.length) return <p className="text-text-muted text-sm py-4 text-center">No transfer data</p>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted">
            <th className="text-left py-2 px-2">Name</th>
            <th className="text-left py-2 px-2">Team</th>
            <th className="text-left py-2 px-2">Pos</th>
            <th className="text-center py-2 px-2">Transfers</th>
            <th className="text-center py-2 px-2">Sel%</th>
          </tr>
        </thead>
        <tbody>
          {players.map((p) => (
            <tr key={p.id} className="border-b border-border/50 hover:bg-bg-card-hover transition-colors">
              <td className="py-2 px-2 font-medium">{p.webName}</td>
              <td className="py-2 px-2 text-text-secondary">{p.teamShortName}</td>
              <td className="py-2 px-2">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded text-[10px] font-medium bg-fpl-pitch/50 text-fpl-grass">
                  {p.position}
                </span>
              </td>
              <td className={`py-2 px-2 text-center font-bold ${mode === 'in' ? 'text-green-400' : 'text-red-400'}`}>
                {(mode === 'in' ? p.transfersIn : p.transfersOut).toLocaleString()}
              </td>
              <td className="py-2 px-2 text-center">{p.selectedByPercent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TrendsPanel() {
  const { data, isLoading, isError } = useTrends();
  const [priceTab, setPriceTab] = useState<PriceTab>('risers');
  const [transferTab, setTransferTab] = useState<TransferTab>('in');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-20"><Loader className="mx-auto" /></CardContent>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card>
        <CardContent className="py-20 text-center text-text-secondary">Failed to load trends</CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Price Changes */}
      <Card>
        <CardHeader>
          <CardTitle>PRICE CHANGES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['risers', 'fallers'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPriceTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  priceTab === tab
                    ? 'bg-fpl-grass text-bg-dark'
                    : 'bg-bg-dark text-text-muted hover:text-text-primary border border-border'
                }`}
              >
                {tab === 'risers' ? 'Risers' : 'Fallers'}
              </button>
            ))}
          </div>
          <PriceTable players={priceTab === 'risers' ? data.priceRisers : data.priceFallers} />
        </CardContent>
      </Card>

      {/* Transfer Activity */}
      <Card>
        <CardHeader>
          <CardTitle>TRANSFER ACTIVITY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['in', 'out'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTransferTab(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  transferTab === tab
                    ? 'bg-fpl-grass text-bg-dark'
                    : 'bg-bg-dark text-text-muted hover:text-text-primary border border-border'
                }`}
              >
                {tab === 'in' ? 'Most In' : 'Most Out'}
              </button>
            ))}
          </div>
          <TransferTable
            players={transferTab === 'in' ? data.topTransfersIn : data.topTransfersOut}
            mode={transferTab}
          />
        </CardContent>
      </Card>
    </div>
  );
}
