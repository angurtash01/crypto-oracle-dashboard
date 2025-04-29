
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { SendHorizontal, Bot, User, Loader } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MarketChatAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I\'m your AI market assistant. Ask me anything about cryptocurrencies, market trends, or specific coins.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Generate responses based on market knowledge
  const generateResponse = async (query: string): Promise<string> => {
    // In a real app, this would call an LLM API
    // For now, we'll simulate responses based on keywords
    const lowerQuery = query.toLowerCase();
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple pattern matching for demo purposes
    if (lowerQuery.includes('bitcoin') || lowerQuery.includes('btc')) {
      if (lowerQuery.includes('price') || lowerQuery.includes('worth')) {
        return "Bitcoin is currently trading around $63,500. It's up about 2% in the last 24 hours, with strong support at the $62,000 level. Trading volume has been increasing, which could indicate growing market interest.";
      }
      if (lowerQuery.includes('news') || lowerQuery.includes('happening')) {
        return "The latest Bitcoin news includes continued institutional adoption, with another ETF seeing strong inflows this week. There's also discussion about the upcoming halving event, which historically has led to price increases.";
      }
      return "Bitcoin remains the largest cryptocurrency by market cap. It was created in 2009 by Satoshi Nakamoto and has become a store of value often compared to digital gold. Its limited supply of 21 million coins makes it deflationary by design.";
    }
    
    if (lowerQuery.includes('ethereum') || lowerQuery.includes('eth')) {
      if (lowerQuery.includes('price') || lowerQuery.includes('worth')) {
        return "Ethereum is currently trading around $3,145. It's up about 1.7% in the past 24 hours. The ETH/BTC ratio has been relatively stable lately, suggesting neither is significantly outperforming the other.";
      }
      if (lowerQuery.includes('news') || lowerQuery.includes('happening')) {
        return "Ethereum's latest developments include continued progress on layer-2 scaling solutions. The network recently hit a milestone in transaction volume, and staking yields have been stable at around 4%.";
      }
      return "Ethereum is the leading smart contract platform, enabling decentralized applications (dApps) and programmable transactions. It transitioned from Proof-of-Work to Proof-of-Stake in 2022 with The Merge, significantly reducing its energy consumption.";
    }
    
    if (lowerQuery.includes('market') && (lowerQuery.includes('bull') || lowerQuery.includes('bear'))) {
      return "The current market sentiment appears to be cautiously optimistic. While we've seen recovery from previous lows, trading volumes suggest institutional participation is still growing. Key indicators like the Fear & Greed Index show we're in neutral territory, neither strongly bullish nor bearish at the moment.";
    }
    
    if (lowerQuery.includes('trending') || lowerQuery.includes('popular')) {
      return "This week's trending cryptocurrencies include several layer-1 alternatives and AI-related projects. Trading volume has been particularly high for DeFi tokens following recent protocol upgrades. As always, remember that high volatility works both ways - assets trending upward can reverse quickly.";
    }
    
    if (lowerQuery.includes('why') && lowerQuery.includes('down')) {
      return "The recent price decline could be attributed to several factors: macroeconomic concerns affecting risk assets broadly, profit-taking after the recent rally, and some regulatory uncertainty in key markets. Market sentiment often moves in cycles, and corrections are normal even in upward trends.";
    }
    
    if (lowerQuery.includes('invest') || lowerQuery.includes('buy')) {
      return "I can't provide investment advice, as everyone's financial situation and risk tolerance differs. Generally speaking, many analysts recommend doing your own research, only investing what you can afford to lose, and considering dollar-cost averaging instead of trying to time the market. Diversification across different asset classes is also commonly recommended.";
    }
    
    // Default response if no patterns match
    return "That's an interesting question about the crypto market. While I don't have specific information on this particular query, I can tell you that market conditions are constantly evolving based on technological developments, regulatory news, macroeconomic factors, and sentiment. Would you like me to focus on a specific aspect of the market?";
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // Get AI response
      const response = await generateResponse(input);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>AI Market Chat Assistant</CardTitle>
        <CardDescription>
          Ask questions about crypto markets, trends, and news
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`
                  max-w-[80%] px-4 py-2 rounded-lg 
                  ${message.role === 'user' 
                    ? 'bg-accent text-accent-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === 'assistant' 
                    ? <Bot className="h-3.5 w-3.5" />
                    : <User className="h-3.5 w-3.5" />
                  }
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-secondary-foreground px-4 py-3 rounded-lg rounded-bl-none max-w-[80%]">
                <Loader className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="border-t border-border pt-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about market trends, coins, or news..."
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default MarketChatAssistant;
