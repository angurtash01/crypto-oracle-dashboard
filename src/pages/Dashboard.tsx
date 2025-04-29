
import React, { useEffect, useState } from 'react';
import CoinCard from '../components/CoinCard';
import CoinTable from '../components/CoinTable';
import { fetchTopCoins } from '../services/api';
import { Loader } from 'lucide-react';

const Dashboard = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  useEffect(() => {
    const loadCoins = async () => {
      try {
        setLoading(true);
        const data = await fetchTopCoins();
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Failed to load cryptocurrency data. Please try again later.');
        console.error('Error fetching coins:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCoins();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Loading market data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center my-8">
        <p className="text-destructive mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm font-medium py-1.5 px-3 rounded-md bg-secondary text-foreground hover:bg-secondary/80"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Cryptocurrency Market</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'}`}
          >
            Grid
          </button>
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-foreground'}`}
          >
            Table
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coins.map(coin => (
            <CoinCard key={coin.id} coin={coin} />
          ))}
        </div>
      ) : (
        <CoinTable coins={coins} />
      )}
    </div>
  );
};

export default Dashboard;
