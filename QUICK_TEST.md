# Testing Guide for idonthinkinc Multi-Agent System

## Quick Start - Run Tests Now

### Option 1: Verify Agents (Recommended - No Build Required)

```bash
node verify-agents.js
```

This verifies:
- ✅ All 9 agents exist
- ✅ All agents extend BaseAgent
- ✅ All agents have required methods
- ✅ Shared types are defined
- ✅ Documentation exists

**No TypeScript compilation needed** - runs in seconds!

### Option 2: Build and Run Tests

```bash
# From project root
npm run build

# Run tests
node test-runner.js
```

### Option 2: Build and Test

```bash
# From project root
npm run build

# Run tests
cd packages/agents
node test-runner.js
```

## What Changed

### TrendResearcherAgent Updated

**Old Approach**: Analyzed competitor website URL

**New Approach**: Finds trending topics from multiple platforms

**New Input**:
```typescript
{
  category: 'technology',      // Optional: tech, gaming, entertainment, etc.
  timeframe: '24h',          // Required: 1h, 24h, 7d, 30d
  source: 'youtube',          // Optional: youtube, tiktok, twitter, google-trends, reddit
  depth: 'comprehensive',      // Optional: basic, comprehensive, deep
  location: 'global'           // Optional: US, UK, global, etc.
}
```

**Example**:
```typescript
const agent = new TrendResearcherAgent();
const trends = await agent.execute({
  category: 'technology',
  timeframe: '24h',
  source: 'youtube',
  depth: 'comprehensive'
});

console.log(`Found ${trends.trends.length} trending topics:`);
trends.trends.forEach(trend => {
  console.log(`- ${trend.topic} (confidence: ${trend.confidence})`);
  console.log(`  Keywords: ${trend.keywords.join(', ')}`);
  console.log(`  Audience: ${trend.estimatedAudience.toLocaleString()}`);
});
```

**Supported Sources**:
- **YouTube** - Trending videos
- **TikTok** - Trending hashtags
- **Twitter** - Trending topics
- **Google Trends** - Search trends
- **Reddit** - Trending posts

**Supported Categories**:
- **Technology** - AI, gadgets, innovation
- **Gaming** - Games, esports, streaming
- **Entertainment** - Movies, music, TV
- **All** - Combined trends (default)

## Testing Individual Agents

### Quick One-Liner Tests

```bash
# Test TrendResearcher
node -e "const { TrendResearcherAgent } = require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent'); (async () => { const a = new TrendResearcherAgent(); const r = await a.execute({ timeframe: '24h' }); console.log('Trends:', r.trends.length); })().catch(console.error)"

# Test Scripter
node -e "const { ScripterAgent } = require('./packages/agents/src/agents/scripter/ScripterAgent'); (async () => { const a = new ScripterAgent(); const r = await a.execute({ trend: { id: '1', topic: 'Test', confidence: 0.9, keywords: [], estimatedAudience: 10000 }, targetDuration: 300 }); console.log('Script:', r.script.title); })().catch(console.error)"
```

### Test Complete Workflow

```bash
cd packages/agents
node -e "
const { TrendResearcherAgent, ScripterAgent, VoiceActorAgent } = require('./src/index');

(async () => {
  // 1. Find trends
  const trends = await new TrendResearcherAgent().execute({
    category: 'technology',
    timeframe: '24h'
  });
  console.log('✓ Found', trends.trends.length, 'trends');

  // 2. Generate script
  const script = await new ScripterAgent().execute({
    trend: trends.trends[0],
    targetDuration: 300
  });
  console.log('✓ Generated:', script.script.title);

  // 3. Create voiceover
  const voice = await new VoiceActorAgent().execute({
    script: script.script
  });
  console.log('✓ Voice:', voice.audioFile);

  console.log('\\n🎉 Workflow complete!');
})().catch(console.error)
"
```

## Test Different Scenarios

### Test Different Categories
```bash
for category in technology gaming entertainment all; do
  echo "Testing $category..."
  node -e "const { TrendResearcherAgent } = require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent'); (async () => { const a = new TrendResearcherAgent(); const r = await a.execute({ category: '$category', timeframe: '24h' }); console.log('Trends:', r.trends.length); })().catch(console.error)"
done
```

### Test Different Sources
```bash
for source in youtube tiktok twitter; do
  echo "Testing $source..."
  node -e "const { TrendResearcherAgent } = require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent'); (async () => { const a = new TrendResearcherAgent(); const r = await a.execute({ source: '$source', timeframe: '24h' }); console.log('Trends:', r.trends.length); })().catch(console.error)"
done
```

## Expected Output

When you run `standalone-test.js`, you should see:

```
===========================================================
 🧪 Agent Test Suite (===========================================================

===========================================================
 Testing TrendResearcherAgent: Basic trend research
===========================================================

ℹ Finding trending topics in technology from youtube (24h, global)
ℹ Fetching trends from youtube with depth: comprehensive
ℹ Found 6 trending topics
✓ Basic trend research passed (5ms)

===========================================================
 Testing ScripterAgent: Script generation
===========================================================

ℹ Generating script for trend: AI in Content Creation
✓ Script generation passed (3ms)

[... more tests ...]

===========================================================
 Test Summary
===========================================================
✓ Passed: 4
✗ Failed: 0

🎉 All tests passed!
```

## Troubleshooting

### Module Not Found Error

**Problem**: `Cannot find module './src/agents/...'`

**Solution**: Make sure you're in the `packages/agents` directory

### TypeScript Errors

**Problem**: Type errors when running

**Solution**: The standalone tests use Node.js dynamic requires, no TypeScript compilation needed

### Tests Hang

**Problem**: Tests seem to hang

**Solution**: Agents use `setTimeout` to simulate API calls, should complete within a few seconds

## Full Documentation

- **[TESTING.md](packages/agents/TESTING.md)** - Complete testing guide
- **[TrendResearcher README](packages/agents/src/agents/trend-researcher/README.md)** - Trend research documentation
- **[Agent Package README](packages/agents/README.md)** - All agents overview

## All 9 Agents Implemented

1. ✅ **TrendResearcherAgent** - Find trending topics
2. ✅ **ScripterAgent** - Generate video scripts
3. ✅ **FootageCreatorAgent** - Create video footage
4. ✅ **VoiceActorAgent** - Generate TTS voiceover
5. ✅ **VoiceOverAgent** - Sync audio with video
6. ✅ **ComposerAgent** - Add background music
7. ✅ **EditorAgent** - Apply cuts and effects
8. ✅ **QualityCriticAgent** - Rate video quality
9. ✅ **PublisherAgent** - Upload to platforms

## Next Steps

1. ✅ Test agents with provided scripts
2. ⏳ Integrate with external APIs (OpenAI, ElevenLabs, etc.)
3. ⏳ Implement workflow orchestration
4. ⏳ Build dashboard for human approvals
5. ⏳ Deploy to production

## Need Help?

- Run `node standalone-test.js` for quick testing
- Check `TESTING.md` for detailed testing guide
- Review individual agent READMEs in `packages/agents/src/agents/*/README.md`
- Open an issue on GitHub for bugs or questions

---

**Quick Test Command**:
```bash
cd packages/agents && node standalone-test.js
```

**That's it!** 🚀
