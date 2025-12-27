# Testing Guide

This guide explains how to test the agents in the idonthinkinc content creation system.

## Quick Start

### Option 1: Standalone Test (No Build Required)

Run tests directly from source files:

```bash
cd packages/agents
node standalone-test.js
```

This tests:
- TrendResearcherAgent - Finding trending topics
- ScripterAgent - Generating video scripts
- VoiceActorAgent - Creating voiceover audio
- QualityCriticAgent - Rating video quality

### Option 2: Build and Test

Build all packages and run tests:

```bash
# From project root
npm run build

# Run built tests
cd packages/agents
node test-runner.js
```

## Testing Individual Agents

### Test TrendResearcherAgent

```bash
cd packages/agents
node -e "
const { TrendResearcherAgent } = require('./src/agents/trend-researcher/TrendResearcherAgent');

async function test() {
  const agent = new TrendResearcherAgent();
  const input = {
    category: 'technology',
    timeframe: '24h',
    source: 'youtube',
    depth: 'comprehensive'
  };

  const isValid = await agent.validate(input);
  console.log('Valid:', isValid);

  const output = await agent.execute(input);
  console.log('Trends found:', output.trends.length);
  output.trends.forEach(t => console.log('-', t.topic));
}

test().catch(console.error);
"
```

### Test ScripterAgent

```bash
node -e "
const { ScripterAgent } = require('./src/agents/scripter/ScripterAgent');

async function test() {
  const agent = new ScripterAgent();
  const input = {
    trend: {
      id: 'trend-1',
      topic: 'AI in Content Creation',
      confidence: 0.85,
      keywords: ['AI'],
      estimatedAudience: 50000
    },
    targetDuration: 300
  };

  const output = await agent.execute(input);
  console.log('Script:', output.script.title);
  console.log('Scenes:', output.script.scenes.length);
}

test().catch(console.error);
"
```

### Test VoiceActorAgent

```bash
node -e "
const { VoiceActorAgent } = require('./src/agents/voice-actor/VoiceActorAgent');

async function test() {
  const agent = new VoiceActorAgent();
  const input = {
    script: {
      id: 'script-123',
      content: 'Test script content',
      estimatedDuration: 300,
      scenes: []
    },
    voiceType: 'neutral',
    emotion: 'enthusiastic'
  };

  const output = await agent.execute(input);
  console.log('Audio:', output.audioFile);
  console.log('Duration:', output.duration);
}

test().catch(console.error);
"
```

### Test QualityCriticAgent

```bash
node -e "
const { QualityCriticAgent } = require('./src/agents/quality-critic/QualityCriticAgent');

async function test() {
  const agent = new QualityCriticAgent();
  const input = {
    editedVideo: 'test.mp4',
    script: {
      id: 'script-123',
      scenes: [{ id: 's1', duration: 30 }],
      estimatedDuration: 300
    }
  };

  const output = await agent.execute(input);
  console.log('Score:', output.overallScore);
  console.log('Recommendation:', output.recommendation);
}

test().catch(console.error);
"
```

## Testing Complete Workflow

Test the entire pipeline from start to finish:

```bash
cd packages/agents
node -e "
const {
  TrendResearcherAgent,
  ScripterAgent,
  VoiceActorAgent,
  QualityCriticAgent
} = require('./src/index');

async function testWorkflow() {
  console.log('🚀 Starting complete workflow test...\n');

  // Step 1: Find trends
  const trendAgent = new TrendResearcherAgent();
  const trendInput = {
    category: 'technology',
    timeframe: '24h',
    source: 'youtube',
    depth: 'comprehensive'
  };
  const trends = await trendAgent.execute(trendInput);
  console.log('✓ Found', trends.trends.length, 'trends');
  console.log('  Top trend:', trends.trends[0].topic, '\n');

  // Step 2: Generate script
  const scriptAgent = new ScripterAgent();
  const scriptInput = {
    trend: trends.trends[0],
    targetDuration: 300,
    tone: 'enthusiastic',
    format: 'youtube'
  };
  const script = await scriptAgent.execute(scriptInput);
  console.log('✓ Generated script:', script.script.title);
  console.log('  Scenes:', script.script.scenes.length, '\n');

  // Step 3: Create voiceover
  const voiceAgent = new VoiceActorAgent();
  const voiceInput = {
    script: script.script,
    voiceType: 'neutral',
    emotion: 'enthusiastic'
  };
  const voice = await voiceAgent.execute(voiceInput);
  console.log('✓ Created voiceover');
  console.log('  Duration:', voice.duration, 's\n');

  // Step 4: Rate quality
  const qualityAgent = new QualityCriticAgent();
  const qualityInput = {
    editedVideo: 'test-video.mp4',
    script: script.script
  };
  const quality = await qualityAgent.execute(qualityInput);
  console.log('✓ Quality rating complete');
  console.log('  Score:', quality.overallScore, '/100');
  console.log('  Recommendation:', quality.recommendation, '\n');

  console.log('🎉 Workflow test complete!');
}

testWorkflow().catch(console.error);
"
```

## Testing with Different Parameters

### Test Different Trend Categories

```bash
node -e "
const { TrendResearcherAgent } = require('./src/agents/trend-researcher/TrendResearcherAgent');

const agent = new TrendResearcherAgent();
const categories = ['technology', 'gaming', 'entertainment', 'all'];

for (const category of categories) {
  const input = { category, timeframe: '24h', source: 'youtube' };
  const output = await agent.execute(input);
  console.log(category + ':', output.trends.length, 'trends');
}
"
```

### Test Different Trend Sources

```bash
node -e "
const { TrendResearcherAgent } = require('./src/agents/trend-researcher/TrendResearcherAgent');

const agent = new TrendResearcherAgent();
const sources = ['youtube', 'tiktok', 'twitter'];

for (const source of sources) {
  const input = { source, timeframe: '24h', depth: 'basic' };
  const output = await agent.execute(input);
  console.log(source + ':', output.trends.length, 'trends');
}
"
```

### Test Different Video Formats

```bash
node -e "
const { ScripterAgent } = require('./src/agents/scripter/ScripterAgent');

const agent = new ScripterAgent();
const formats = ['youtube', 'tiktok', 'instagram'];

for (const format of formats) {
  const input = {
    trend: { id: '1', topic: 'Test', confidence: 0.9, keywords: [], estimatedAudience: 10000 },
    targetDuration: 300,
    format
  };
  const output = await agent.execute(input);
  console.log(format + ':', output.script.scenes.length, 'scenes');
}
"
```

## Unit Tests with Jest

Run Jest tests (when configured):

```bash
cd packages/agents
npm test
```

Run tests for specific agent:

```bash
npm test -- TrendResearcherAgent
```

Run tests in watch mode:

```bash
npm test -- --watch
```

## Integration Testing

Test agents working together:

```bash
cd packages/agents
node -e "
// Test parallel execution
const { ScripterAgent, VoiceActorAgent } = require('./src/index');

async function testParallel() {
  const input = {
    trend: { id: '1', topic: 'Test', confidence: 0.9, keywords: [], estimatedAudience: 10000 },
    targetDuration: 300
  };

  const scriptAgent = new ScripterAgent();
  const voiceAgent = new VoiceActorAgent();

  // Generate script and voice in parallel
  const script = await scriptAgent.execute(input);
  const voice = await voiceAgent.execute({ script: script.script });

  console.log('✓ Parallel execution complete');
  console.log('Script:', script.script.title);
  console.log('Voice:', voice.audioFile);
}

testParallel().catch(console.error);
"
```

## Error Handling Tests

Test agent error handling:

```bash
node -e "
const { TrendResearcherAgent } = require('./src/agents/trend-researcher/TrendResearcherAgent');

async function testErrors() {
  const agent = new TrendResearcherAgent();

  // Test invalid input
  try {
    await agent.execute({ timeframe: 'invalid' });
    console.log('❌ Should have failed validation');
  } catch (err) {
    console.log('✓ Correctly caught invalid input');
  }

  // Test missing required field
  const isValid = await agent.validate({});
  console.log(isValid ? '❌ Should be invalid' : '✓ Correctly rejected missing fields');
}

testErrors().catch(console.error);
"
```

## Performance Testing

Measure agent execution time:

```bash
node -e "
const { TrendResearcherAgent } = require('./src/agents/trend-researcher/TrendResearcherAgent');

async function testPerformance() {
  const agent = new TrendResearcherAgent();
  const input = { timeframe: '24h', source: 'youtube', depth: 'deep' };

  const start = Date.now();
  await agent.execute(input);
  const duration = Date.now() - start;

  console.log('Execution time:', duration, 'ms');
  console.log('Performance rating:', duration < 1000 ? '✓ Fast' : '⚠ Slow');
}

testPerformance().catch(console.error);
"
```

## Testing Checklist

Before marking agents as production-ready, test:

### TrendResearcherAgent
- [ ] Valid inputs pass validation
- [ ] Invalid inputs fail validation
- [ ] Finds trends for different categories
- [ ] Finds trends from different sources
- [ ] Handles different timeframes
- [ ] Returns correct metadata
- [ ] Handles errors gracefully

### ScripterAgent
- [ ] Generates scripts from trends
- [ ] Handles different tones
- [ ] Handles different formats
- [ ] Creates appropriate scene count
- [ ] Generates engaging titles
- [ ] Handles errors gracefully

### VoiceActorAgent
- [ ] Generates audio files
- [ ] Handles different voice types
- [ ] Handles different emotions
- [ ] Calculates correct duration
- [ ] Handles errors gracefully

### QualityCriticAgent
- [ ] Rates audio quality
- [ ] Rates video quality
- [ ] Rates content quality
- [ ] Rates technical quality
- [ ] Provides actionable feedback
- [ ] Makes correct recommendations
- [ ] Handles errors gracefully

## Debug Mode

Add debug logging to see detailed execution:

```bash
NODE_ENV=development DEBUG=* node standalone-test.js
```

## Common Issues

### Module Not Found

**Problem**: Cannot find agent modules

**Solution**: Ensure you're in the packages/agents directory or use absolute paths

### TypeScript Errors

**Problem**: Type errors when running tests

**Solution**: Run `npm run typecheck` to verify types

### Async/Await Issues

**Problem**: Tests hang or fail silently

**Solution**: Ensure all async operations are properly awaited and errors are caught

## Next Steps

After successful testing:

1. Integrate with workflow engine
2. Connect to external APIs (OpenAI, ElevenLabs, etc.)
3. Set up CI/CD pipeline
4. Deploy to production

## Need Help?

- Check agent-specific READMEs in `src/agents/*/README.md`
- Review TypeScript types in `packages/shared-types/src/index.ts`
- Open an issue on GitHub for bugs or questions
