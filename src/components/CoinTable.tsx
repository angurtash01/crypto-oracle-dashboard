
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

interface CoinTableProps {
  coins: Coin[];
}

const CoinTable = ({ coins }: CoinTableProps) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Coin; direction: 'ascending' | 'descending' }>({
    key: 'market_cap',
    direction: 'descending'
  });

  const requestSort = (key: keyof Coin) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedCoins = () => {
    const sortableCoins = [...coins];
    sortableCoins.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sortableCoins;
  };

  const renderSortIcon = (columnName: keyof Coin) => {
    if (sortConfig.key !== columnName) return null;
    
    return sortConfig.direction === 'ascending' 
      ? <ArrowUp className="h-4 w-4 inline-block ml-1" />
      : <ArrowDown className="h-4 w-4 inline-block ml-1" />;
  };

  const sortedCoins = getSortedCoins();

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full">
        <thead className="border-b border-border">
          <tr>
            <th className="p-4 text-left font-medium text-muted-foreground" onClick={() => requestSort('name')}>
              <div className="flex items-center cursor-pointer">
                Coin {renderSortIcon('name')}
              </div>
            </th>
            <th className="p-4 text-right font-medium text-muted-foreground" onClick={() => requestSort('current_price')}>
              <div className="flex items-center justify-end cursor-pointer">
                Price {renderSortIcon('current_price')}
              </div>
            </th>
            <th className="p-4 text-right font-medium text-muted-foreground" onClick={() => requestSort('price_change_percentage_24h')}>
              <div className="flex items-center justify-end cursor-pointer">
                24h Change {renderSortIcon('price_change_percentage_24h')}
              </div>
            </th>
            <th className="p-4 text-right font-medium text-muted-foreground hidden md:table-cell" onClick={() => requestSort('market_cap')}>
              <div className="flex items-center justify-end cursor-pointer">
                Market Cap {renderSortIcon('market_cap')}
              </div>
            </th>
            <th className="p-4 text-right font-medium text-muted-foreground hidden md:table-cell" onClick={() => requestSort('total_volume')}>
              <div className="flex items-center justify-end cursor-pointer">
                Volume (24h) {renderSortIcon('total_volume')}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCoins.map((coin) => {
            const priceChangeIsPositive = coin.price_change_percentage_24h >= 0;
            
            return (
              <tr 
                key={coin.id} 
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="p-4">
                  <Link to={`/coin/${coin.id}`} className="flex items-center">
                    <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2 rounded-full" />
                    <div>
                      <span className="font-medium">{coin.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{coin.symbol.toUpperCase()}</span>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(coin.current_price)}
                </td>
                <td className="p-4 text-right font-medium">
                  <span className={priceChangeIsPositive ? 'text-gain' : 'text-loss'}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </span>
                </td>
                <td className="p-4 text-right text-muted-foreground hidden md:table-cell">
                  {formatCurrency(coin.market_cap)}
                </td>
                <td className="p-4 text-right text-muted-foreground hidden md:table-cell">
                  {formatCurrency(coin.total_volume)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
