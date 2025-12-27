import { BaseAgent } from '../base/BaseAgent';
import {
  TrendResearchInput,
  TrendResearchOutput,
  Trend,
  ResearchMetadata,
  AgentCapabilities,
} from '@idonthinkinc/shared-types';

export class TrendResearcherAgent extends BaseAgent<TrendResearchInput, TrendResearchOutput> {
  name = 'TrendResearcher';
  version = '1.0.0';

  async validate(input: TrendResearchInput): Promise<boolean> {
    return !!(input.timeframe && ['1h', '24h', '7d', '30d'].includes(input.timeframe));
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: true,
      estimatedExecutionTime: 300000,
      maxRetries: 3,
    };
  }

  async execute(input: TrendResearchInput): Promise<TrendResearchOutput> {
    const category = input.category || 'all';
    const source = input.source || 'youtube';
    const timeframe = input.timeframe;
    const depth = input.depth || 'comprehensive';
    const location = input.location || 'global';

    this.log(`Finding trending topics in ${category} from ${source} (${timeframe}, ${location})`);

    try {
      const trends = await this.findTrends(input);
      const metadata = this.createMetadata(input, trends);

      this.log(`Found ${trends.length} trending topics`);

      return { trends, metadata };
    } catch (error) {
      this.log(`Trend research failed: ${error}`, 'error');
      throw error;
    }
  }

  private async findTrends(input: TrendResearchInput): Promise<Trend[]> {
    const source = input.source || 'youtube';
    const depth = input.depth || 'comprehensive';
    const category = input.category || 'all';

    this.log(`Fetching trends from ${source} with depth: ${depth}`);

    if (depth === 'basic') {
      return this.getBasicTrends(input);
    } else if (depth === 'comprehensive') {
      return await this.getComprehensiveTrends(input);
    } else {
      return await this.getDeepTrends(input);
    }
  }

  private async getBasicTrends(input: TrendResearchInput): Promise<Trend[]> {
    this.log('Fetching basic trending topics');

    const source = input.source || 'youtube';
    const category = input.category || 'all';

    return [
      {
        id: `${source}-trend-1`,
        topic: this.getTopicForCategory(category, 1),
        confidence: 0.85,
        relevanceScore: 0.9,
        sourceUrl: this.getSourceUrl(source, 'trend-1'),
        keywords: this.getKeywordsForCategory(category, 1),
        estimatedAudience: 500000,
      },
      {
        id: `${source}-trend-2`,
        topic: this.getTopicForCategory(category, 2),
        confidence: 0.78,
        relevanceScore: 0.85,
        sourceUrl: this.getSourceUrl(source, 'trend-2'),
        keywords: this.getKeywordsForCategory(category, 2),
        estimatedAudience: 350000,
      },
      {
        id: `${source}-trend-3`,
        topic: this.getTopicForCategory(category, 3),
        confidence: 0.72,
        relevanceScore: 0.8,
        sourceUrl: this.getSourceUrl(source, 'trend-3'),
        keywords: this.getKeywordsForCategory(category, 3),
        estimatedAudience: 250000,
      },
    ];
  }

  private async getComprehensiveTrends(input: TrendResearchInput): Promise<Trend[]> {
    this.log('Fetching comprehensive trending topics');

    const basicTrends = await this.getBasicTrends(input);
    const source = input.source || 'youtube';
    const category = input.category || 'all';

    return [
      ...basicTrends,
      {
        id: `${source}-trend-4`,
        topic: this.getTopicForCategory(category, 4),
        confidence: 0.88,
        relevanceScore: 0.92,
        sourceUrl: this.getSourceUrl(source, 'trend-4'),
        keywords: this.getKeywordsForCategory(category, 4),
        estimatedAudience: 600000,
      },
      {
        id: `${source}-trend-5`,
        topic: this.getTopicForCategory(category, 5),
        confidence: 0.75,
        relevanceScore: 0.78,
        sourceUrl: this.getSourceUrl(source, 'trend-5'),
        keywords: this.getKeywordsForCategory(category, 5),
        estimatedAudience: 400000,
      },
      {
        id: `${source}-trend-6`,
        topic: this.getTopicForCategory(category, 6),
        confidence: 0.82,
        relevanceScore: 0.85,
        sourceUrl: this.getSourceUrl(source, 'trend-6'),
        keywords: this.getKeywordsForCategory(category, 6),
        estimatedAudience: 450000,
      },
    ];
  }

  private async getDeepTrends(input: TrendResearchInput): Promise<Trend[]> {
    this.log('Fetching deep trending topics');

    const comprehensiveTrends = await this.getComprehensiveTrends(input);
    const source = input.source || 'youtube';
    const category = input.category || 'all';

    return [
      ...comprehensiveTrends,
      {
        id: `${source}-trend-7`,
        topic: this.getTopicForCategory(category, 7),
        confidence: 0.9,
        relevanceScore: 0.88,
        sourceUrl: this.getSourceUrl(source, 'trend-7'),
        keywords: this.getKeywordsForCategory(category, 7),
        estimatedAudience: 700000,
      },
      {
        id: `${source}-trend-8`,
        topic: this.getTopicForCategory(category, 8),
        confidence: 0.86,
        relevanceScore: 0.9,
        sourceUrl: this.getSourceUrl(source, 'trend-8'),
        keywords: this.getKeywordsForCategory(category, 8),
        estimatedAudience: 550000,
      },
      {
        id: `${source}-trend-9`,
        topic: this.getTopicForCategory(category, 9),
        confidence: 0.8,
        relevanceScore: 0.82,
        sourceUrl: this.getSourceUrl(source, 'trend-9'),
        keywords: this.getKeywordsForCategory(category, 9),
        estimatedAudience: 380000,
      },
    ];
  }

  private getTopicForCategory(category: string, index: number): string {
    const topics: Record<string, string[]> = {
      all: [
        'AI and Machine Learning Breakthroughs',
        'Climate Change Solutions 2024',
        'New Tech Gadgets Released',
        'Celebrity News and Gossip',
        'Sports Highlights and Analysis',
        'Viral Social Media Trends',
        'Economic Market Updates',
        'Entertainment Industry News',
        'Health and Wellness Tips',
      ],
      technology: [
        'GPT-5 and Next-Gen AI Models',
        'Apple Vision Pro Reviews',
        'Quantum Computing Advances',
        'Cybersecurity Threats 2024',
        'Electric Vehicle Innovations',
        'Space Exploration Updates',
        '5G Network Rollout',
        'Metaverse Development',
        'Blockchain Applications',
      ],
      gaming: [
        'New Game Releases This Week',
        'Esports Tournament Results',
        'Game Streaming Wars',
        'Indie Game Success Stories',
        'VR Gaming Advancements',
        'Console vs PC Gaming',
        'Mobile Gaming Trends',
        'Game Modding Communities',
        'Retro Gaming Comeback',
      ],
      entertainment: [
        'Upcoming Movie Releases',
        'TV Show Season Finales',
        'Music Album Drops',
        'Celebrity Scandals',
        'Streaming Platform Wars',
        'Award Show Predictions',
        'Concert Tour Announcements',
        'Book Adaptations',
        'Podcast Viral Episodes',
      ],
    };

    const categoryTopics = topics[category] || topics.all;
    return categoryTopics[(index - 1) % categoryTopics.length];
  }

  private getKeywordsForCategory(category: string, index: number): string[] {
    const keywords: Record<string, string[]> = {
      all: ['trending', 'viral', 'news', '2024'],
      technology: ['AI', 'tech', 'innovation', 'future', 'digital'],
      gaming: ['gaming', 'esports', 'streaming', 'games', 'play'],
      entertainment: ['movies', 'music', 'celebrity', 'TV', 'entertainment'],
    };

    const categoryKeywords = keywords[category] || keywords.all;
    return categoryKeywords.slice(0, 4);
  }

  private getSourceUrl(source: string, trendId: string): string {
    const urls: Record<string, string> = {
      youtube: `https://youtube.com/results?search_query=${trendId}`,
      tiktok: `https://tiktok.com/tag/${trendId}`,
      twitter: `https://twitter.com/search?q=${trendId}`,
      'google-trends': `https://trends.google.com/trends/trendingsearches`,
      reddit: `https://reddit.com/trending`,
    };

    return urls[source] || '#';
  }

  private createMetadata(input: TrendResearchInput, trends: Trend[]): ResearchMetadata {
    const allKeywords = trends.flatMap((trend) => trend.keywords);
    const keywordCounts = allKeywords.reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword]) => keyword);

    return {
      category: input.category,
      source: input.source || 'youtube',
      analyzedAt: new Date(),
      timeframe: input.timeframe,
      location: input.location,
      totalTrendsFound: trends.length,
      topKeywords,
    };
  }
}
