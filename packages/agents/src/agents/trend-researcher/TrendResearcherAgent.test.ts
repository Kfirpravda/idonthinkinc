import { describe, it, expect, beforeEach } from '@jest/globals';
import { TrendResearcherAgent } from '../src/agents/trend-researcher/TrendResearcherAgent';
import { TrendResearchInput } from '@idonthinkinc/shared-types';

describe('TrendResearcherAgent', () => {
  let agent: TrendResearcherAgent;

  beforeEach(() => {
    agent = new TrendResearcherAgent();
  });

  describe('validate', () => {
    it('should validate correct input', async () => {
      const input: TrendResearchInput = {
        category: 'technology',
        timeframe: '24h',
        source: 'youtube',
        depth: 'comprehensive',
      };

      const isValid = await agent.validate(input);
      expect(isValid).toBe(true);
    });

    it('should reject invalid input', async () => {
      const input = {} as TrendResearchInput;

      const isValid = await agent.validate(input);
      expect(isValid).toBe(false);
    });
  });

  describe('execute', () => {
    it('should find trending topics', async () => {
      const input: TrendResearchInput = {
        category: 'technology',
        timeframe: '24h',
        source: 'youtube',
        depth: 'comprehensive',
      };

      const output = await agent.execute(input);

      expect(output.trends).toBeDefined();
      expect(Array.isArray(output.trends)).toBe(true);
      expect(output.trends.length).toBeGreaterThan(0);
      expect(output.metadata).toBeDefined();
    });

    it('should return trends with required fields', async () => {
      const input: TrendResearchInput = {
        category: 'technology',
        timeframe: '24h',
        source: 'youtube',
        depth: 'basic',
      };

      const output = await agent.execute(input);

      const trend = output.trends[0];
      expect(trend).toHaveProperty('id');
      expect(trend).toHaveProperty('topic');
      expect(trend).toHaveProperty('confidence');
      expect(trend).toHaveProperty('relevanceScore');
      expect(trend).toHaveProperty('sourceUrl');
      expect(trend).toHaveProperty('keywords');
      expect(trend).toHaveProperty('estimatedAudience');
    });

    it('should return different trends for different depths', async () => {
      const baseInput: TrendResearchInput = {
        category: 'technology',
        timeframe: '24h',
        source: 'youtube',
      };

      const basicOutput = await agent.execute({ ...baseInput, depth: 'basic' });
      const comprehensiveOutput = await agent.execute({ ...baseInput, depth: 'comprehensive' });

      expect(basicOutput.trends.length).toBeLessThan(comprehensiveOutput.trends.length);
    });
  });

  describe('getCapabilities', () => {
    it('should return correct capabilities', () => {
      const capabilities = agent.getCapabilities();

      expect(capabilities.canHandleAsync).toBe(true);
      expect(capabilities.requiresHumanApproval).toBe(true);
      expect(capabilities.estimatedExecutionTime).toBeGreaterThan(0);
      expect(capabilities.maxRetries).toBeGreaterThan(0);
    });
  });
});
