
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCoinData, fetchCoinHistory } from '../services/api';
import { formatCurrency, formatPercentage, formatDate } from '../utils/formatters';
import { Loader, ArrowLeft } from 'lucide-react';
import PatternDetector from '../components/PatternDetector';
import MarketTrendIndicator from '../components/MarketTrendIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent
} from '../components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// This would be replaced with proper Chart.js implementation
const PricePlaceholder = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) return null;
  
  const height = 300;
  const width = 800;
  const maxPrice = Math.max(...data.map(point => point[1]));
  const minPrice = Math.min(...data.map(point => point[1]));
  const range = maxPrice - minPrice;
  
  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((point[1] - minPrice) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="h-[300px] w-full bg-secondary/30 rounded-lg p-4 border border-border/40 relative">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
        />
      </svg>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground">
        <span>{formatDate(data[0][0])}</span>
        <span>{formatDate(data[data.length - 1][0])}</span>
      </div>
    </div>
  );
};

const CoinDetail = () => {
  const { id } = useParams<{id: string}>();
  const [coin, setCoin] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('7d');
  const [analysisTab, setAnalysisTab] = useState<'overview' | 'patterns' | 'trend'>('overview');

  useEffect(() => {
    const loadCoinData = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const [coinData, historyData] = await Promise.all([
          fetchCoinData(id),
          fetchCoinHistory(id, timeframe)
        ]);
        
        setCoin(coinData);
        setHistory(historyData);
        setError(null);
      } catch (err) {
        setError('Failed to load coin data. Please try again later.');
        console.error('Error fetching coin data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoinData();
  }, [id, timeframe]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading coin data...</p>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
        </Link>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <p className="text-destructive mb-2">{error || 'Coin not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm font-medium py-1.5 px-3 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const priceChangeIsPositive = coin.market_data.price_change_percentage_24h >= 0;
  const priceData = history.map(point => point[1]);
  const volumeData = Array(priceData.length).fill(coin.market_data.total_volume.usd / priceData.length); // Mock volume data

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
      </Link>
      
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <img src={coin.image.large} alt={coin.name} className="w-12 h-12 mr-4" />
          <div>
            <h1 className="text-2xl font-bold">{coin.name} <span className="text-muted-foreground">{coin.symbol.toUpperCase()}</span></h1>
            <div className="flex items-center mt-1">
              <span className="text-xl font-medium mr-2">
                {formatCurrency(coin.market_data.current_price.usd)}
              </span>
              <span className={`text-sm font-medium ${priceChangeIsPositive ? 'text-gain' : 'text-loss'}`}>
                {formatPercentage(coin.market_data.price_change_percentage_24h)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 mb-4">
          {['24h', '7d', '30d', '1y'].map(period => (
            <button 
              key={period}
              onClick={() => setTimeframe(period)}
              className={`py-1 px-3 text-sm rounded-md ${
                timeframe === period ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        
        <PricePlaceholder data={history} />
        
        <Tabs value={analysisTab} onValueChange={(v) => setAnalysisTab(v as any)} className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
            <TabsTrigger value="trend">Market Trend</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 border border-border/40">
                <h2 className="text-lg font-semibold mb-4">Market Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Market Cap</span>
                    <span className="font-medium">{formatCurrency(coin.market_data.market_cap.usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Volume (24h)</span>
                    <span className="font-medium">{formatCurrency(coin.market_data.total_volume.usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Circulating Supply</span>
                    <span className="font-medium">{coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Max Supply</span>
                    <span className="font-medium">{coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-lg p-6 border border-border/40">
                <h2 className="text-lg font-semibold mb-4">Price Change</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">24h</span>
                    <span className={coin.market_data.price_change_percentage_24h >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatPercentage(coin.market_data.price_change_percentage_24h)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">7d</span>
                    <span className={coin.market_data.price_change_percentage_7d >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatPercentage(coin.market_data.price_change_percentage_7d)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">30d</span>
                    <span className={coin.market_data.price_change_percentage_30d >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatPercentage(coin.market_data.price_change_percentage_30d)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">1y</span>
                    <span className={coin.market_data.price_change_percentage_1y >= 0 ? 'text-gain' : 'text-loss'}>
                      {formatPercentage(coin.market_data.price_change_percentage_1y)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns" className="mt-4">
            <PatternDetector priceData={priceData} />
          </TabsContent>
          
          <TabsContent value="trend" className="mt-4">
            <MarketTrendIndicator 
              priceData={priceData} 
              volumeData={volumeData} 
              sentimentScore={55} // Mock sentiment score
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-card rounded-lg p-6 border border-border/40 mb-8">
        <h2 className="text-lg font-semibold mb-4">About {coin.name}</h2>
        <div className="prose prose-sm prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: coin.description.en || 'No description available.' }} />
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
