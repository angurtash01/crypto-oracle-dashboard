
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Loader, Trash2, PlusCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/formatters';

interface CoinHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  price: number;
  value: number;
}

interface PortfolioStats {
  totalValue: number;
  riskScore: 'High' | 'Medium' | 'Low';
  diversification: 'Good' | 'Average' | 'Poor';
  largestHolding: string;
  largestAllocation: number;
  stablecoinPercentage: number;
}

const PortfolioAnalyzer = () => {
  const [holdings, setHoldings] = useState<CoinHolding[]>([]);
  const [newCoin, setNewCoin] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [stats, setStats] = useState<PortfolioStats | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch coin data from the API service
  const fetchCoinData = async (coinId: string) => {
    try {
      setLoading(true);
      // In a real app, this would fetch from CoinGecko API
      // For now, we're using our mock API service
      const response = await fetch(`/api/coins/${coinId}`);
      if (!response.ok) throw new Error('Coin not found');
      const coin = await response.json();
      return coin;
    } catch (error) {
      console.error('Error fetching coin data:', error);
      toast.error('Could not find that coin. Please check the ID and try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add a new coin to the portfolio
  const handleAddCoin = async () => {
    if (!newCoin.trim() || !newAmount.trim()) {
      toast.error('Please enter both coin ID and amount');
      return;
    }

    // Simulate fetching coin data
    setLoading(true);
    try {
      // In a real app, we would call fetchCoinData
      // For now, we'll simulate a response
      // Simulating a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample coins for demo
      const coinData = {
        id: newCoin.toLowerCase(),
        name: newCoin.charAt(0).toUpperCase() + newCoin.slice(1),
        symbol: newCoin.substring(0, 3).toUpperCase(),
        current_price: Math.random() * 10000
      };
      
      const amount = parseFloat(newAmount);
      if (isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const newHolding: CoinHolding = {
        id: coinData.id,
        name: coinData.name,
        symbol: coinData.symbol,
        amount: amount,
        price: coinData.current_price,
        value: amount * coinData.current_price
      };

      setHoldings([...holdings, newHolding]);
      setNewCoin('');
      setNewAmount('');
      toast.success(`Added ${amount} ${coinData.symbol} to your portfolio`);
    } catch (error) {
      console.error('Error adding coin:', error);
      toast.error('Could not add coin to portfolio');
    } finally {
      setLoading(false);
    }
  };

  // Remove a coin from the portfolio
  const handleRemoveCoin = (coinId: string) => {
    setHoldings(holdings.filter(coin => coin.id !== coinId));
    toast.info('Removed coin from portfolio');
  };

  // Analyze the portfolio
  const analyzePortfolio = () => {
    if (holdings.length === 0) {
      toast.error('Please add coins to your portfolio first');
      return;
    }

    setAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const totalValue = holdings.reduce((sum, coin) => sum + coin.value, 0);
      
      // Find largest holding
      let largestHolding = holdings[0];
      holdings.forEach(coin => {
        if (coin.value > largestHolding.value) {
          largestHolding = coin;
        }
      });
      
      // Calculate largest allocation percentage
      const largestAllocation = (largestHolding.value / totalValue) * 100;
      
      // Count stablecoins (simulated)
      const stablecoins = holdings.filter(coin => 
        ['usdt', 'usdc', 'dai', 'busd'].includes(coin.id.toLowerCase())
      );
      const stablecoinValue = stablecoins.reduce((sum, coin) => sum + coin.value, 0);
      const stablecoinPercentage = (stablecoinValue / totalValue) * 100;
      
      // Calculate risk score
      let riskScore: 'High' | 'Medium' | 'Low' = 'Medium';
      if (largestAllocation > 60 || holdings.length < 3) {
        riskScore = 'High';
      } else if (stablecoinPercentage > 40 && holdings.length > 5) {
        riskScore = 'Low';
      }
      
      // Calculate diversification score
      let diversification: 'Good' | 'Average' | 'Poor' = 'Average';
      if (holdings.length > 5 && largestAllocation < 40) {
        diversification = 'Good';
      } else if (holdings.length < 3 || largestAllocation > 70) {
        diversification = 'Poor';
      }
      
      // Generate suggestions
      const newSuggestions = [];
      
      if (riskScore === 'High') {
        newSuggestions.push(`Your portfolio is highly concentrated with ${largestAllocation.toFixed(0)}% in ${largestHolding.symbol}. Consider diversifying.`);
      }
      
      if (diversification === 'Poor') {
        newSuggestions.push('Adding more assets would improve your portfolio diversification.');
      }
      
      if (stablecoinPercentage < 10) {
        newSuggestions.push('Consider adding some stablecoins to reduce volatility.');
      }
      
      if (holdings.length < 4) {
        newSuggestions.push('Your portfolio has few assets. Adding more could reduce risk.');
      }
      
      if (stablecoinPercentage > 50) {
        newSuggestions.push('Your portfolio is heavily weighted in stablecoins. Consider adding growth assets in bull markets.');
      }
      
      setStats({
        totalValue,
        riskScore,
        diversification,
        largestHolding: largestHolding.symbol,
        largestAllocation,
        stablecoinPercentage
      });
      
      setSuggestions(newSuggestions);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Portfolio Analyzer</CardTitle>
        <CardDescription>
          Add your crypto holdings to analyze risk and get optimization suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Input
            placeholder="Coin ID (e.g., bitcoin)"
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Input
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            className="w-32"
            type="number"
            step="any"
            min="0"
            disabled={loading}
          />
          <Button 
            onClick={handleAddCoin} 
            disabled={loading}
          >
            {loading ? <Loader className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            Add
          </Button>
        </div>
        
        {holdings.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-1">Asset</th>
                    <th className="text-right py-2 px-1">Amount</th>
                    <th className="text-right py-2 px-1">Price</th>
                    <th className="text-right py-2 px-1">Value</th>
                    <th className="text-right py-2 px-1">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((coin) => (
                    <tr key={coin.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-2 px-1">
                        <div className="flex items-center">
                          <span className="font-medium">{coin.symbol.toUpperCase()}</span>
                          <span className="ml-2 text-muted-foreground">{coin.name}</span>
                        </div>
                      </td>
                      <td className="text-right py-2 px-1">{coin.amount}</td>
                      <td className="text-right py-2 px-1">{formatCurrency(coin.price)}</td>
                      <td className="text-right py-2 px-1">{formatCurrency(coin.value)}</td>
                      <td className="text-right py-2 px-1">
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveCoin(coin.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4">
              <Button
                className="w-full"
                onClick={analyzePortfolio}
                disabled={analyzing || holdings.length === 0}
              >
                {analyzing ? <Loader className="h-4 w-4 animate-spin mr-2" /> : 'Analyze Portfolio'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Add coins to your portfolio to get started</p>
          </div>
        )}
        
        {stats && (
          <div className="mt-6 space-y-4">
            <div className="bg-secondary p-4 rounded-md">
              <h3 className="font-medium mb-2">Portfolio Analysis</h3>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(stats.totalValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <Badge 
                    className={`
                      ${stats.riskScore === 'High' ? 'bg-red-500/20 text-red-500' : 
                        stats.riskScore === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 
                        'bg-green-500/20 text-green-500'}
                    `}
                  >
                    {stats.riskScore}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Diversification</p>
                  <Badge 
                    className={`
                      ${stats.diversification === 'Poor' ? 'bg-red-500/20 text-red-500' : 
                        stats.diversification === 'Average' ? 'bg-yellow-500/20 text-yellow-500' : 
                        'bg-green-500/20 text-green-500'}
                    `}
                  >
                    {stats.diversification}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Largest Holding</p>
                  <p className="font-medium">{stats.largestHolding} ({stats.largestAllocation.toFixed(1)}%)</p>
                </div>
              </div>
              
              <h3 className="font-medium mt-4 mb-2">Suggestions</h3>
              <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    {suggestion.includes('risk') || suggestion.includes('highly') ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : suggestion.includes('improve') || suggestion.includes('Consider adding') ? (
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Information is for educational purposes only and not financial advice.
      </CardFooter>
    </Card>
  );
};

export default PortfolioAnalyzer;
