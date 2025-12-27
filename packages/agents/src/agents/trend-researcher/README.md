# TrendResearcherAgent

Finds trending topics across multiple platforms.

## Purpose

The Trend Researcher agent discovers trending topics from various platforms including YouTube, TikTok, Twitter, Google Trends, and Reddit. It analyzes what's currently popular in specific categories and timeframes.

## Input

```typescript
interface TrendResearchInput {
  category?: string;  // 'technology', 'gaming', 'entertainment', 'news', or 'all' (default)
  timeframe: string;   // '1h', '24h', '7d', '30d'
  source?: string;     // 'youtube', 'tiktok', 'twitter', 'google-trends', 'reddit' (default: 'youtube')
  depth?: 'basic' | 'comprehensive' | 'deep';  // Analysis depth (default: 'comprehensive')
  location?: string;   // 'US', 'UK', 'global', etc. (default: 'global')
}
```

## Output

```typescript
interface TrendResearchOutput {
  trends: Trend[];
  metadata: ResearchMetadata;
}

interface Trend {
  id: string;
  topic: string;
  confidence: number;          // 0-1, confidence in trend detection
  relevanceScore: number;      // 0-1, relevance to your content strategy
  sourceUrl?: string;          // URL to see more about the trend
  keywords: string[];          // Associated keywords
  estimatedAudience: number;   // Estimated audience size
}

interface ResearchMetadata {
  category?: string;
  source: string;
  analyzedAt: Date;
  timeframe: string;
  location?: string;
  totalTrendsFound: number;
  topKeywords: string[];
}
```

## Example Usage

```typescript
import { TrendResearcherAgent } from '@idonthinkinc/agents';

const agent = new TrendResearcherAgent();

const input = {
  category: 'technology',
  timeframe: '24h',
  source: 'youtube',
  depth: 'comprehensive',
  location: 'global'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Found ${output.trends.length} trending topics:`);
  output.trends.forEach(trend => {
    console.log(`- ${trend.topic} (confidence: ${trend.confidence})`);
    console.log(`  Keywords: ${trend.keywords.join(', ')}`);
    console.log(`  Estimated audience: ${trend.estimatedAudience.toLocaleString()}`);
  });

  console.log(`\nTop keywords: ${output.metadata.topKeywords.join(', ')}`);
}
```

## Supported Categories

- **all** - All categories (default)
- **technology** - Tech, AI, gadgets, innovation
- **gaming** - Games, esports, streaming
- **entertainment** - Movies, music, TV, celebrities
- **news** - Current events, world news
- **sports** - Sports news and highlights

## Supported Sources

- **youtube** - YouTube trending videos (default)
- **tiktok** - TikTok trending hashtags
- **twitter** - Twitter trending topics
- **google-trends** - Google Trends search data
- **reddit** - Reddit trending posts

## Supported Timeframes

- **1h** - Last hour (fast-moving trends)
- **24h** - Last 24 hours (recommended for daily content)
- **7d** - Last 7 days (weekly trends)
- **30d** - Last 30 days (monthly trends)

## Analysis Depth Levels

### Basic
- Top 3 trending topics
- Basic keyword extraction
- Quick analysis (2-3 min)

### Comprehensive (Default)
- Top 6 trending topics
- Detailed keyword analysis
- Medium analysis (5-8 min)

### Deep
- Top 9 trending topics
- Advanced keyword clustering
- Full audience analysis
- Extended analysis (10-15 min)

## Example Scenarios

### Find Tech Trends on YouTube

```typescript
const techTrends = await agent.execute({
  category: 'technology',
  timeframe: '24h',
  source: 'youtube',
  depth: 'comprehensive'
});
```

### Find Gaming Trends on TikTok

```typescript
const gamingTrends = await agent.execute({
  category: 'gaming',
  timeframe: '7d',
  source: 'tiktok',
  depth: 'deep'
});
```

### Find All Trends in the Last Hour

```typescript
const trendingNow = await agent.execute({
  timeframe: '1h',
  depth: 'basic'
});
```

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: Yes (after research)
- **Estimated Execution Time**: 300000ms (5 min)
- **Max Retries**: 3

## Dependencies

- Trend APIs (planned: YouTube Data API, TikTok API, Twitter API)
- Google Trends API
- Reddit API
- Currently uses simulated trend data

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('timeframe')) {
    console.error('Invalid timeframe. Use: 1h, 24h, 7d, or 30d');
  }
}
```

## Human Approval Workflow

After trend research is complete:

1. Agent outputs trending topics and metadata
2. Human reviews trends via dashboard
3. Human can:
   - **Approve specific trends** - Select trends to use for content
   - **Reject trends** - Exclude from content strategy
   - **Search again** - Retry with different parameters
   - **Add custom trends** - Manually add trending topics

## Logging

```
[2024-01-01T00:00:00.000Z] [TrendResearcher] [INFO] Finding trending topics in technology from youtube (24h, global)
[2024-01-01T00:00:00.000Z] [TrendResearcher] [INFO] Fetching trends from youtube with depth: comprehensive
[2024-01-01T00:00:00.000Z] [TrendResearcher] [INFO] Found 6 trending topics
```

## Development

```bash
# Run agent in development mode
npm run dev:agent:trend-researcher

# Run tests
npm run test:agent:trend-researcher

# Type check
npm run typecheck
```

## Testing Examples

### Test with Different Categories

```typescript
const categories = ['technology', 'gaming', 'entertainment', 'all'];

for (const category of categories) {
  const output = await agent.execute({
    category,
    timeframe: '24h',
    depth: 'comprehensive'
  });

  console.log(`${category}: ${output.trends.length} trends`);
}
```

### Test with Different Sources

```typescript
const sources = ['youtube', 'tiktok', 'twitter'];

for (const source of sources) {
  const output = await agent.execute({
    source,
    timeframe: '24h',
    depth: 'basic'
  });

  console.log(`${source}: ${output.trends.length} trends`);
}
```

## Best Practices

1. **Timeframe Selection**
   - Use **1h** for breaking news and viral content
   - Use **24h** for daily content planning
   - Use **7d** for weekly content calendars
   - Use **30d** for monthly strategy planning

2. **Source Selection**
   - **YouTube** - Best for video content trends
   - **TikTok** - Best for short-form video trends
   - **Twitter** - Best for real-time conversation trends
   - **Google Trends** - Best for search intent trends
   - **Reddit** - Best for community-driven trends

3. **Depth Selection**
   - Use **basic** for quick trend scanning
   - Use **comprehensive** for regular content planning
   - Use **deep** for comprehensive market research

## Next Steps

After trend research is approved, workflow continues to:

**ScripterAgent** - Generates scripts based on selected trends
