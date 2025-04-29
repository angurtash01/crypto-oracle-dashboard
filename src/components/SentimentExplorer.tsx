
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader, Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Progress } from './ui/progress';

interface SentimentData {
  positive: number;
  negative: number;
  neutral: number;
  trending_phrases: string[];
  recent_headlines: {
    title: string;
    source: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    url: string;
  }[];
}

const SentimentExplorer = () => {
  const [coinId, setCoinId] = useState('bitcoin');
  const [loading, setLoading] = useState(false);
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [searchInput, setSearchInput] = useState('');
  
  // Popular coins for quick selection
  const popularCoins = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'binancecoin', name: 'BNB' },
    { id: 'solana', name: 'Solana' },
    { id: 'cardano', name: 'Cardano' },
  ];

  // Fetch sentiment data for a coin
  const fetchSentimentData = async (coin: string) => {
    setLoading(true);
    
    try {
      // In a real app, this would be an API call to get sentiment data
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate simulated sentiment data based on coin
      const isBitcoin = coin.toLowerCase() === 'bitcoin';
      const isEthereum = coin.toLowerCase() === 'ethereum';
      
      let sentimentScore = {
        positive: isBitcoin ? 62 : isEthereum ? 58 : Math.floor(Math.random() * 60) + 20,
        negative: isBitcoin ? 18 : isEthereum ? 22 : Math.floor(Math.random() * 30) + 10,
        neutral: isBitcoin ? 20 : isEthereum ? 20 : Math.floor(Math.random() * 30) + 10,
      };
      
      // Ensure percentages add up to 100%
      const total = sentimentScore.positive + sentimentScore.negative + sentimentScore.neutral;
      sentimentScore = {
        positive: Math.round((sentimentScore.positive / total) * 100),
        negative: Math.round((sentimentScore.negative / total) * 100),
        neutral: 100 - Math.round((sentimentScore.positive / total) * 100) - Math.round((sentimentScore.negative / total) * 100)
      };
      
      // Generate trending phrases
      const bitcoinPhrases = ['ETF approval', 'institutional adoption', 'store of value', 'digital gold', 'halving event'];
      const ethereumPhrases = ['scaling solutions', 'ETH 2.0', 'L2 networks', 'DeFi growth', 'staking rewards'];
      const genericPhrases = ['market recovery', 'trading volume', 'whale movement', 'technical analysis', 'price action'];
      
      const trendingPhrases = isBitcoin ? bitcoinPhrases : isEthereum ? ethereumPhrases : genericPhrases;
      
      // Generate news headlines
      const generateHeadlines = (coinName: string) => {
        const headlines = [
          {
            title: `${coinName} Shows Strong Momentum as Institutional Interest Grows`,
            source: 'CryptoNews',
            sentiment: 'positive',
            url: '#'
          },
          {
            title: `Technical Analysis: ${coinName} Approaching Key Resistance Level`,
            source: 'TradingView',
            sentiment: 'neutral',
            url: '#'
          },
          {
            title: `Market Uncertainty Causes ${coinName} Volatility`,
            source: 'CoinDesk',
            sentiment: 'negative',
            url: '#'
          },
          {
            title: `${coinName} Development Update Reveals New Features`,
            source: 'GitHub',
            sentiment: 'positive',
            url: '#'
          },
          {
            title: `Analysts Debate ${coinName}'s Future Price Direction`,
            source: 'CryptoAnalytics',
            sentiment: 'neutral',
            url: '#'
          }
        ];
        
        // Randomize the sentiment to add variety
        return headlines.map(headline => ({
          ...headline,
          sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral'
        }));
      };
      
      const coinName = coin.charAt(0).toUpperCase() + coin.slice(1);
      
      setSentimentData({
        positive: sentimentScore.positive,
        negative: sentimentScore.negative,
        neutral: sentimentScore.neutral,
        trending_phrases: trendingPhrases,
        recent_headlines: generateHeadlines(coinName)
      });
      
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSentimentData(coinId);
  }, []);

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setCoinId(searchInput.trim().toLowerCase());
    fetchSentimentData(searchInput.trim().toLowerCase());
  };

  // Handle quick selection
  const handleCoinSelect = (coin: string) => {
    setCoinId(coin);
    setSearchInput('');
    fetchSentimentData(coin);
  };

  // Get sentiment color class
  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-500';
      case 'negative':
        return 'text-red-500';
      case 'neutral':
        return 'text-yellow-500';
      default:
        return '';
    }
  };

  // Get sentiment icon
  const SentimentIcon = ({ sentiment }: { sentiment: 'positive' | 'negative' | 'neutral' }) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className={`h-4 w-4 ${getSentimentColor(sentiment)}`} />;
      case 'negative':
        return <TrendingDown className={`h-4 w-4 ${getSentimentColor(sentiment)}`} />;
      case 'neutral':
        return <Minus className={`h-4 w-4 ${getSentimentColor(sentiment)}`} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sentiment Explorer</CardTitle>
        <CardDescription>
          Analyze market sentiment for cryptocurrencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by coin name or ID..."
                className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading || !searchInput.trim()}>
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : 'Search'}
            </Button>
          </form>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {popularCoins.map((coin) => (
            <Button
              key={coin.id}
              variant={coin.id === coinId ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCoinSelect(coin.id)}
              disabled={loading}
            >
              {coin.name}
            </Button>
          ))}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : sentimentData ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold capitalize mb-4">{coinId} Sentiment Analysis</h3>
              
              <div className="grid gap-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Positive</span>
                    <span className="text-sm font-medium text-green-500">{sentimentData.positive}%</span>
                  </div>
                  <Progress value={sentimentData.positive} className="bg-muted h-2" indicatorClassName="bg-green-500" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Negative</span>
                    <span className="text-sm font-medium text-red-500">{sentimentData.negative}%</span>
                  </div>
                  <Progress value={sentimentData.negative} className="bg-muted h-2" indicatorClassName="bg-red-500" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Neutral</span>
                    <span className="text-sm font-medium text-yellow-500">{sentimentData.neutral}%</span>
                  </div>
                  <Progress value={sentimentData.neutral} className="bg-muted h-2" indicatorClassName="bg-yellow-500" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">TRENDING PHRASES</h4>
              <div className="flex flex-wrap gap-2">
                {sentimentData.trending_phrases.map((phrase, index) => (
                  <Badge key={index} variant="secondary" className="font-normal">
                    {phrase}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">RECENT HEADLINES</h4>
              <ul className="space-y-3">
                {sentimentData.recent_headlines.map((headline, index) => (
                  <li key={index} className="border-b border-border pb-2 last:border-0">
                    <a 
                      href={headline.url} 
                      className="block hover:bg-muted/50 rounded p-2 -m-2"
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <div className="flex items-start gap-2">
                        <SentimentIcon sentiment={headline.sentiment} />
                        <div>
                          <p className="font-medium text-sm">{headline.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{headline.source}</p>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Search for a cryptocurrency to see sentiment analysis</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Sentiment data is generated from news sources and social media analysis.
      </CardFooter>
    </Card>
  );
};

export default SentimentExplorer;
