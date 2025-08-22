import type { GraphData, Node } from '@/lib/types';
import { generateLinksFromCommunities } from '@/lib/graph';

export function getMockNodes(): Node[] {
  return [
    { id: '6485c9ca', label: 'RBI Monetary Policy', articles: 10, community: 0 },
    { id: '426b6a8d', label: 'Global Currency Fluctuations', articles: 26, community: 0 },
    { id: 'ce16a3ec', label: 'USD Impact on Gold', articles: 32, community: 0 },
    { id: '5312792e', label: 'Rising Inflation Trends', articles: 49, community: 0 },
    { id: '0a090a9a', label: 'EUR/USD Forecasts', articles: 13, community: 0 },
    { id: '2c2c37c5', label: 'Asian/African Currencies', articles: 34, community: 0 },
    { id: '5557131e', label: 'UK Inflation Markets', articles: 12, community: 0 },
    { id: '0d7d46f5', label: 'UK Food Inflation', articles: 14, community: 0 },
    { id: 'ac2f0351', label: 'Canadian Dollar Decline', articles: 11, community: 0 },
    { id: 'fbe1093a', label: 'USD vs NZD/AUD', articles: 20, community: 0 },
    { id: '664473b5', label: 'UK Inflation BOE', articles: 27, community: 0 },
    { id: 'cf26bbcd', label: 'Inflation Impact 2025', articles: 40, community: 0 },
    { id: '2c261c09', label: 'UK Pound Fluctuations', articles: 22, community: 0 },
    { id: 'c493aa97', label: 'UK Inflation High', articles: 15, community: 0 },
    { id: 'f04457c5', label: 'Eurozone Inflation', articles: 29, community: 0 },
    { id: '1e3139cf', label: 'UK Inflation 3.8%', articles: 18, community: 0 },
    { id: '9ef332d6', label: 'UK Economic Challenges', articles: 14, community: 0 },
    { id: '9df29ee8', label: 'UK Airfare/Food Inflation', articles: 22, community: 0 },
    { id: 'aec31c43', label: 'Bulgaria Euro Adoption', articles: 10, community: 0 },

    { id: '020b1dec', label: 'Tariffs on US Retailers', articles: 26, community: 1 },
    { id: 'c2041c85', label: 'ECB Trade Views', articles: 32, community: 1 },
    { id: '96ab5273', label: 'US-China Trade', articles: 14, community: 1 },
    { id: '4754791c', label: 'US Tariffs on India', articles: 36, community: 1 },
    { id: '21aa9290', label: 'Tariffs Consumer Impact', articles: 11, community: 1 },
    { id: '6a95ee3e', label: 'Trump Tariffs Policy', articles: 43, community: 1 },
    { id: '7283f824', label: 'Tariffs on US Business', articles: 17, community: 1 },
    { id: '0c176058', label: 'Tariffs Consumer Prices', articles: 23, community: 1 },
    { id: '7191c234', label: 'Tariffs Manufacturing', articles: 19, community: 1 },
    { id: '634c7f70', label: 'US Tariffs Japan', articles: 19, community: 1 },
    { id: '25b87629', label: 'Tariffs Gaming', articles: 30, community: 1 },
    { id: 'bfe77e6a', label: 'India-US-China Trade', articles: 15, community: 1 },
    { id: '905f9d4e', label: 'Canada-US Trade', articles: 18, community: 1 },
    { id: 'c847d9b0', label: 'Steel/Aluminum Tariffs', articles: 33, community: 1 },
    { id: '0ddee240', label: 'India-Russia Trade', articles: 52, community: 1 },
    { id: '8aae2555', label: 'US-Brazil Trade', articles: 17, community: 1 },
    { id: 'ed0e3f95', label: 'Tariffs vs Russia', articles: 24, community: 1 },
    { id: '982bc83a', label: 'India-EAEU Trade', articles: 21, community: 1 },

    { id: 'bfdf7fb8', label: 'Fed Inflation Concerns', articles: 81, community: 2 },
    { id: 'd31bb7a0', label: 'Fed Jackson Hole', articles: 15, community: 2 },
    { id: 'eae7bde5', label: 'Fed Policy Focus', articles: 15, community: 2 },
    { id: '981cec96', label: 'Fed & Cryptocurrency', articles: 18, community: 2 },
    { id: 'eda958f5', label: 'Trump vs Fed', articles: 27, community: 2 },
    { id: '4a5f91a7', label: 'Fed Cook Allegations', articles: 26, community: 2 },
    { id: '3770ecf2', label: 'Trump vs Cook', articles: 15, community: 2 },
    { id: '44eccf59', label: 'Cook Resists Trump', articles: 12, community: 2 },
    { id: '5c4ee13e', label: 'Fed Resignation Demands', articles: 47, community: 2 },

    { id: 'e54a27f0', label: 'China Financial Markets', articles: 25, community: 3 },
    { id: 'ac166490', label: 'Recession Risk Analysis', articles: 59, community: 3 },
    { id: 'c5294fbe', label: 'China Growth Strategies', articles: 18, community: 3 },
    { id: 'd706b4f6', label: 'Yuan Stablecoin', articles: 70, community: 3 },
    { id: 'b516e95e', label: 'SE Asia-China Growth', articles: 11, community: 3 },
    { id: '70f6d38a', label: 'Chinese Companies', articles: 13, community: 3 },
    { id: '0fda9cfa', label: 'China Tech & EV', articles: 26, community: 3 },
    { id: '5b4cccaf', label: 'Pop Mart Labubu', articles: 14, community: 3 },

    { id: '50193777', label: 'European Football', articles: 47, community: 4 },
    { id: '9e1cc062', label: 'Spain Summer Crisis', articles: 14, community: 4 },
    { id: '0aadbeca', label: 'Spain Festivals', articles: 19, community: 4 },
  ];
}

export function getMockGraph(): GraphData {
  const nodes = getMockNodes();
  return { nodes, links: generateLinksFromCommunities(nodes) };
}
