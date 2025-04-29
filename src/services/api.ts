
// Mock API service for CoinGecko-like data
// In a real app, this would make actual API calls to CoinGecko

const API_DELAY = 500; // Simulate network delay

// Mock data for top coins
const mockCoins = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    current_price: 63482.12,
    market_cap: 1245679432001,
    market_cap_rank: 1,
    fully_diluted_valuation: 1332342343242,
    total_volume: 32452342343,
    high_24h: 64200.32,
    low_24h: 62100.45,
    price_change_24h: 1252.32,
    price_change_percentage_24h: 2.01,
    market_cap_change_24h: 20345678901,
    market_cap_change_percentage_24h: 1.67,
    circulating_supply: 19562781,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 73500.22,
    ath_change_percentage: -13.63,
    ath_date: "2024-03-14T03:43:35.172Z",
    atl: 67.81,
    atl_change_percentage: 93253.45,
    atl_date: "2013-07-06T00:00:00.000Z",
    roi: null,
    last_updated: "2024-04-29T09:40:02.916Z",
    sparkline_in_7d: {
      price: [
        61250, 61400, 61800, 62100, 62300, 61900, 62400, 
        62800, 63200, 62900, 62600, 62400, 63100, 63400
      ]
    }
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    current_price: 3145.68,
    market_cap: 377353823231,
    market_cap_rank: 2,
    fully_diluted_valuation: 377353823231,
    total_volume: 17822345678,
    high_24h: 3185.42,
    low_24h: 3093.21,
    price_change_24h: 52.47,
    price_change_percentage_24h: 1.69,
    market_cap_change_24h: 6288900345,
    market_cap_change_percentage_24h: 1.69,
    circulating_supply: 120123945.312,
    total_supply: 120123945.312,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -35.51,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: 0.432979,
    atl_change_percentage: 725552.77,
    atl_date: "2015-10-20T00:00:00.000Z",
    roi: {
      times: 69.23,
      currency: "btc",
      percentage: 6923.47
    },
    last_updated: "2024-04-29T09:45:12.853Z",
    sparkline_in_7d: {
      price: [
        3050, 3080, 3020, 3010, 3000, 2990, 3030, 
        3060, 3100, 3120, 3110, 3090, 3120, 3145
      ]
    }
  },
  {
    id: "tether",
    symbol: "usdt",
    name: "Tether",
    image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    current_price: 1,
    market_cap: 107501734157,
    market_cap_rank: 3,
    fully_diluted_valuation: 107501734157,
    total_volume: 54321098765,
    high_24h: 1.001,
    low_24h: 0.998,
    price_change_24h: 0.00002,
    price_change_percentage_24h: 0.002,
    market_cap_change_24h: 123456789,
    market_cap_change_percentage_24h: 0.115,
    circulating_supply: 107501734157,
    total_supply: 107501734157,
    max_supply: null,
    ath: 1.32,
    ath_change_percentage: -24.36,
    ath_date: "2018-07-24T00:00:00.000Z",
    atl: 0.572521,
    atl_change_percentage: 74.69,
    atl_date: "2015-03-02T00:00:00.000Z",
    roi: null,
    last_updated: "2024-04-29T09:45:10.734Z",
    sparkline_in_7d: {
      price: [
        0.999, 1.001, 1.000, 0.999, 0.998, 1.001, 1.000, 
        1.001, 1.000, 0.999, 1.000, 1.001, 1.000, 1.000
      ]
    }
  },
  {
    id: "bnb",
    symbol: "bnb",
    name: "BNB",
    image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    current_price: 593.21,
    market_cap: 89123456789,
    market_cap_rank: 4,
    fully_diluted_valuation: 98765432123,
    total_volume: 1234567890,
    high_24h: 599.87,
    low_24h: 586.42,
    price_change_24h: -3.21,
    price_change_percentage_24h: -0.54,
    market_cap_change_24h: -432123456,
    market_cap_change_percentage_24h: -0.48,
    circulating_supply: 150123456.78,
    total_supply: 165123456.78,
    max_supply: 200000000,
    ath: 704.18,
    ath_change_percentage: -15.76,
    ath_date: "2021-05-10T07:30:33.730Z",
    atl: 0.03359941,
    atl_change_percentage: 1765482.38,
    atl_date: "2017-10-19T00:00:00.000Z",
    roi: null,
    last_updated: "2024-04-29T09:45:13.456Z",
    sparkline_in_7d: {
      price: [
        600, 605, 610, 605, 600, 595, 590, 
        585, 588, 592, 590, 587, 590, 593
      ]
    }
  },
];

// Generate more mock coins
for (let i = 0; i < 16; i++) {
  const isPositive = Math.random() > 0.5;
  const changePercent = +(Math.random() * 5).toFixed(2) * (isPositive ? 1 : -1);
  const price = +(Math.random() * 100).toFixed(2);
  
  // Generate random sparkline data
  const sparklineData = [];
  let currentPrice = price;
  for (let j = 0; j < 14; j++) {
    const change = currentPrice * (Math.random() * 0.03 - 0.015);
    currentPrice += change;
    sparklineData.push(+currentPrice.toFixed(2));
  }
  
  mockCoins.push({
    id: `mock-coin-${i}`,
    symbol: `mc${i}`,
    name: `Mock Coin ${i+1}`,
    image: `https://picsum.photos/200?random=${i}`,
    current_price: price,
    market_cap: Math.floor(Math.random() * 10000000000),
    market_cap_rank: 5 + i,
    fully_diluted_valuation: Math.floor(Math.random() * 20000000000),
    total_volume: Math.floor(Math.random() * 1000000000),
    high_24h: price * 1.05,
    low_24h: price * 0.95,
    price_change_24h: price * (changePercent / 100),
    price_change_percentage_24h: changePercent,
    market_cap_change_24h: Math.floor(Math.random() * 1000000000) * (isPositive ? 1 : -1),
    market_cap_change_percentage_24h: changePercent,
    circulating_supply: Math.floor(Math.random() * 1000000000),
    total_supply: Math.floor(Math.random() * 1000000000) * 1.2,
    max_supply: Math.floor(Math.random() * 1000000000) * 1.5,
    ath: price * 2,
    ath_change_percentage: -50,
    ath_date: "2021-11-10T14:24:19.604Z",
    atl: price * 0.1,
    atl_change_percentage: 900,
    atl_date: "2020-03-13T02:22:55.161Z",
    roi: null,
    last_updated: new Date().toISOString(),
    sparkline_in_7d: {
      price: sparklineData
    }
  });
}

// Mock coin detail data
const createMockCoinDetail = (id: string) => {
  const coin = mockCoins.find(c => c.id === id);
  if (!coin) return null;
  
  return {
    id: coin.id,
    symbol: coin.symbol,
    name: coin.name,
    description: {
      en: `${coin.name} (${coin.symbol.toUpperCase()}) is a cryptocurrency that aims to revolutionize the digital economy. 
      It offers fast, secure, and low-cost transactions across the globe.
      <br><br>
      <h3>Key Features:</h3>
      <ul>
        <li>Decentralized network architecture</li>
        <li>Proof-of-stake consensus mechanism</li>
        <li>Smart contract functionality</li>
        <li>Cross-chain compatibility</li>
      </ul>
      <br>
      The project is backed by a team of experienced developers and has partnerships with several major financial institutions.`
    },
    image: {
      thumb: coin.image,
      small: coin.image,
      large: coin.image
    },
    market_data: {
      current_price: {
        usd: coin.current_price
      },
      market_cap: {
        usd: coin.market_cap
      },
      total_volume: {
        usd: coin.total_volume
      },
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d: coin.price_change_percentage_24h * 1.2,
      price_change_percentage_30d: coin.price_change_percentage_24h * 2.1,
      price_change_percentage_1y: coin.price_change_percentage_24h * 5.3,
      circulating_supply: coin.circulating_supply,
      max_supply: coin.max_supply,
    },
    last_updated: coin.last_updated
  };
};

// Mock historical data
const createMockHistoryData = (id: string, days: string) => {
  const coin = mockCoins.find(c => c.id === id);
  if (!coin) return [];
  
  const dataPoints = days === '24h' ? 24 : 
                    days === '7d' ? 7 * 24 :
                    days === '30d' ? 30 * 24 :
                    days === '1y' ? 365 : 7 * 24;
  
  const now = Date.now();
  const startPrice = coin.current_price;
  const volatility = id === "bitcoin" ? 0.03 : id === "ethereum" ? 0.04 : 0.05;
  
  const data = [];
  let currentPrice = startPrice;
  
  for (let i = dataPoints; i >= 0; i--) {
    const timestamp = now - i * (86400000 / 24); // Each point represents an hour
    const change = currentPrice * (Math.random() * volatility - volatility/2);
    currentPrice += change;
    
    // Ensure price doesn't go negative
    if (currentPrice <= 0) currentPrice = 0.01;
    
    data.push([timestamp, currentPrice]);
  }
  
  return data;
};

// API functions that simulate actual API calls
export const fetchTopCoins = async () => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return [...mockCoins];
};

export const fetchCoinData = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  const coinDetail = createMockCoinDetail(id);
  
  if (!coinDetail) {
    throw new Error('Coin not found');
  }
  
  return coinDetail;
};

export const fetchCoinHistory = async (id: string, timeframe: string) => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  return createMockHistoryData(id, timeframe);
};

export const searchCoins = async (query: string) => {
  await new Promise(resolve => setTimeout(resolve, API_DELAY));
  const results = mockCoins.filter(coin => 
    coin.name.toLowerCase().includes(query.toLowerCase()) || 
    coin.symbol.toLowerCase().includes(query.toLowerCase())
  );
  return results;
};
