#!/usr/bin/env node

/**
 * Quick test runner for agents without Jest infrastructure
 * Run with: node test-runner.js
 */

const { TrendResearcherAgent } = require('./dist/agents/trend-researcher/TrendResearcherAgent');
const { ScripterAgent } = require('./dist/agents/scripter/ScripterAgent');
const { FootageCreatorAgent } = require('./dist/agents/footage-creator/FootageCreatorAgent');
const { VoiceActorAgent } = require('./dist/agents/voice-actor/VoiceActorAgent');
const { VoiceOverAgent } = require('./dist/agents/voiceover/VoiceOverAgent');
const { ComposerAgent } = require('./dist/agents/composer/ComposerAgent');
const { EditorAgent } = require('./dist/agents/editor/EditorAgent');
const { QualityCriticAgent } = require('./dist/agents/quality-critic/QualityCriticAgent');
const { PublisherAgent } = require('./dist/agents/publisher/PublisherAgent');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

async function testAgent(agentName, agentClass, testName, testFn) {
  try {
    const agent = new agentClass();
    log(`\n${COLORS.bright}Testing ${agentName}: ${testName}${COLORS.reset}\n`);

    const startTime = Date.now();
    await testFn(agent);
    const duration = Date.now() - startTime;

    success(`${testName} passed (${duration}ms)`);
    return true;
  } catch (err) {
    error(`${testName} failed: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'bright');
  log(' Agent Test Runner', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  let passed = 0;
  let failed = 0;

  // Test TrendResearcherAgent
  const trendPassed = await testAgent(
    'TrendResearcherAgent',
    TrendResearcherAgent,
    'Basic trend research',
    async (agent) => {
      const input = {
        category: 'technology',
        timeframe: '24h',
        source: 'youtube',
        depth: 'comprehensive',
      };

      const isValid = await agent.validate(input);
      if (!isValid) throw new Error('Input validation failed');

      const output = await agent.execute(input);
      if (!output.trends || output.trends.length === 0) {
        throw new Error('No trends returned');
      }

      info(`Found ${output.trends.length} trends`);
      output.trends.forEach(trend => {
        info(`  - ${trend.topic} (confidence: ${trend.confidence})`);
      });
    }
  );
  if (trendPassed) passed++; else failed++;

  // Test ScripterAgent
  const scripterPassed = await testAgent(
    'ScripterAgent',
    ScripterAgent,
    'Script generation',
    async (agent) => {
      const input = {
        trend: {
          id: 'trend-1',
          topic: 'AI in Content Creation',
          confidence: 0.85,
          relevanceScore: 0.9,
          keywords: ['AI', 'content creation'],
          estimatedAudience: 50000,
        },
        targetDuration: 300,
        tone: 'enthusiastic',
        format: 'youtube',
      };

      const isValid = await agent.validate(input);
      if (!isValid) throw new Error('Input validation failed');

      const output = await agent.execute(input);
      if (!output.script || !output.script.title) {
        throw new Error('Script not generated');
      }

      info(`Generated script: ${output.script.title}`);
      info(`  Scenes: ${output.script.scenes.length}`);
      info(`  Duration: ${output.script.estimatedDuration}s`);
    }
  );
  if (scripterPassed) passed++; else failed++;

  // Test VoiceActorAgent
  const voicePassed = await testAgent(
    'VoiceActorAgent',
    VoiceActorAgent,
    'Voice generation',
    async (agent) => {
      const input = {
        script: {
          id: 'script-123',
          content: 'Welcome to our video about AI content creation...',
          estimatedDuration: 300,
          scenes: [],
        },
        voiceType: 'neutral',
        emotion: 'enthusiastic',
        speed: 1.0,
      };

      const isValid = await agent.validate(input);
      if (!isValid) throw new Error('Input validation failed');

      const output = await agent.execute(input);
      if (!output.audioFile) throw new Error('Audio not generated');

      info(`Generated voice: ${output.audioFile}`);
      info(`  Duration: ${output.duration}s`);
      info(`  Format: ${output.format}`);
    }
  );
  if (voicePassed) passed++; else failed++;

  // Test QualityCriticAgent
  const qualityPassed = await testAgent(
    'QualityCriticAgent',
    QualityCriticAgent,
    'Quality rating',
    async (agent) => {
      const input = {
        editedVideo: 'test-video.mp4',
        script: {
          id: 'script-123',
          scenes: [
            { id: 'scene-1', duration: 30 },
            { id: 'scene-2', duration: 45 },
          ],
          estimatedDuration: 300,
        },
      };

      const isValid = await agent.validate(input);
      if (!isValid) throw new Error('Input validation failed');

      const output = await agent.execute(input);
      if (typeof output.overallScore !== 'number') {
        throw new Error('Score not generated');
      }

      info(`Overall score: ${output.overallScore}/100`);
      info(`Recommendation: ${output.recommendation}`);
      info(`Ratings:`);
      info(`  Audio: ${output.ratings.audioQuality}/100`);
      info(`  Video: ${output.ratings.videoQuality}/100`);
      info(`  Content: ${output.ratings.contentQuality}/100`);
      info(`  Technical: ${output.ratings.technicalQuality}/100`);
    }
  );
  if (qualityPassed) passed++; else failed++;

  // Summary
  log('\n' + '='.repeat(60), 'bright');
  log(' Test Summary', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  success(`Passed: ${passed}`);
  error(`Failed: ${failed}`);

  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed', 'red');
    process.exit(1);
  }
}

runTests().catch((err) => {
  error(`Test runner error: ${err.message}`);
  process.exit(1);
});
