
import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length === 0) return null;
  
  // Simple sparkline SVG
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg className="h-12 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        points={points}
        className="sparkline"
        stroke={color}
      />
    </svg>
  );
};

interface CoinCardProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    sparkline_in_7d?: { price: number[] };
    market_cap: number;
    image: string;
  }
}

const CoinCard = ({ coin }: CoinCardProps) => {
  const priceChangeIsPositive = coin.price_change_percentage_24h >= 0;
  const sparklineColor = priceChangeIsPositive ? '#22c55e' : '#ef4444';
  
  return (
    <Link to={`/coin/${coin.id}`} className="block">
      <div className="bg-card rounded-lg p-4 card-hover border border-border/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="w-8 h-8 rounded-full" />
            <div>
              <h3 className="font-medium text-foreground">{coin.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-foreground">{formatCurrency(coin.current_price)}</p>
            <p className={`text-xs ${priceChangeIsPositive ? 'text-gain' : 'text-loss'}`}>
              {formatPercentage(coin.price_change_percentage_24h)}
            </p>
          </div>
        </div>
        
        {coin.sparkline_in_7d && (
          <div className="mt-2">
            <Sparkline data={coin.sparkline_in_7d.price} color={sparklineColor} />
          </div>
        )}
        
        <div className="mt-1 pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <p>Market Cap: {formatCurrency(coin.market_cap)}</p>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
