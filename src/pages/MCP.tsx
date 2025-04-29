
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MCPCard from '../components/MCPCard';
import { simulateMCPPrediction } from '../services/mcp';

const MCP = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadPrediction = async () => {
      try {
        setLoading(true);
        // Simulate an API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const predictionData = await simulateMCPPrediction();
        setPrediction(predictionData);
      } catch (error) {
        console.error('Failed to get prediction:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrediction();
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Market Contextual Predictor (MCP)</h1>
        <p className="text-muted-foreground mt-1">
          Advanced market analysis powered by AI and technical indicators
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MCPCard 
            prediction={prediction || {
              coin: 'Bitcoin',
              probability: 0,
              direction: 'up',
              timeframe: '',
              explanation: '',
              indicators: { rsi: 0, macd: '', sentiment: '' }
            }}
            isLoading={loading}
          />
        </div>
        
        <div className="bg-card rounded-lg p-6 border border-border/40">
          <h3 className="text-lg font-semibold mb-4">How It Works</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-1">Technical Analysis</h4>
              <p className="text-muted-foreground">
                MCP analyzes multiple technical indicators including RSI, MACD, and moving averages 
                to identify potential market trends.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Sentiment Analysis</h4>
              <p className="text-muted-foreground">
                News headlines and social media sentiment are processed to gauge market mood and 
                identify potential market-moving events.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">AI Integration</h4>
              <p className="text-muted-foreground">
                Our AI model combines these data points with historical patterns to generate 
                probability-based predictions for short-term price movements.
              </p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Disclaimer:</strong> MCP predictions are for informational purposes only. 
                Always conduct your own research before making investment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCP;
