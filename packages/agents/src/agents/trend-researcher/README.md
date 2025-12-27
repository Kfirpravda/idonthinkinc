# TrendResearcherAgent

Analyzes competitor websites to identify trending topics.

## Purpose

The Trend Researcher agent scans competitor websites and analyzes their content to identify trending topics, keywords, and audience engagement metrics. This provides data-driven insights for content creation.

## Input

```typescript
interface TrendResearchInput {
  competitorUrl: string;      // URL of competitor website to analyze
  timeframe: string;           // Time period to analyze (e.g., '7d', '30d')
  depth?: 'basic' | 'comprehensive' | 'deep';  // Analysis depth (default: 'comprehensive')
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
  sourceUrl?: string;          // Where trend was found
  keywords: string[];          // Associated keywords
  estimatedAudience: number;   // Estimated audience size
}

interface ResearchMetadata {
  competitorUrl: string;
  analyzedAt: Date;
  timeframe: string;
  totalContentAnalyzed: number;
  topKeywords: string[];
}
```

## Example Usage

```typescript
import { TrendResearcherAgent } from '@idonthinkinc/agents';

const agent = new TrendResearcherAgent();

const input = {
  competitorUrl: 'https://example.com',
  timeframe: '7d',
  depth: 'comprehensive'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Found ${output.trends.length} trends:`);
  output.trends.forEach(trend => {
    console.log(`- ${trend.topic} (confidence: ${trend.confidence})`);
  });
}
```

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
- Audience demographics
- Extended analysis (10-15 min)

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: Yes (after analysis)
- **Estimated Execution Time**: 300000ms (5 min)
- **Max Retries**: 3

## Dependencies

- Web scraping library (simulated in current implementation)
- LLM API for content analysis (OpenAI integration planned)

## Error Handling

The agent will retry up to 3 times if analysis fails:

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  // Check error type and handle appropriately
  if (error.message.includes('competitorUrl')) {
    console.error('Invalid competitor URL');
  }
}
```

## Human Approval Workflow

After trend research is complete:

1. Agent outputs trends and metadata
2. Human reviews trends via dashboard
3. Human can:
   - **Approve** - Continue to scripting agent
   - **Reject** - Retry research with different parameters
   - **Modify** - Add custom trends to the list

## Logging

```
[2024-01-01T00:00:00.000Z] [TrendResearcher] [INFO] Starting trend research for https://example.com
[2024-01-01T00:00:00.000Z] [TrendResearcher] [INFO] Analyzing competitor with depth: comprehensive
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

## Next Steps

After trend research is approved, the workflow continues to:

**ScripterAgent** - Generates scripts based on selected trends
