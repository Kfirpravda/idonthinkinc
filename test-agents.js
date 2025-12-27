#!/usr/bin/env node

/**
 * Standalone test script - Run from project root
 * Run with: node test-agents.js
 */

const path = require('path');

// Dynamic imports with error handling
let agents;

try {
  // Try to load from source
  agents = {
    TrendResearcherAgent: require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent').TrendResearcherAgent,
    ScripterAgent: require('./packages/agents/src/agents/scripter/ScripterAgent').ScripterAgent,
    VoiceActorAgent: require('./packages/agents/src/agents/voice-actor/VoiceActorAgent').VoiceActorAgent,
    QualityCriticAgent: require('./packages/agents/src/agents/quality-critic/QualityCriticAgent').QualityCriticAgent,
  };
  console.log('✓ Loaded agents from source files');
} catch (err) {
  console.error('✗ Failed to load agents:', err.message);
  console.log('Make sure you are running this from the project root directory');
  process.exit(1);
}

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
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
  log(`ℹ ${message}`, 'cyan');
}

async function testTrendResearcher() {
  log('\n' + '='.repeat(60), 'bright');
  log(' Testing TrendResearcherAgent', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const Agent = agents.TrendResearcherAgent;
  const agent = new Agent();

  info('Test 1: Validate correct input');
  const validInput = {
    category: 'technology',
    timeframe: '24h',
    source: 'youtube',
    depth: 'comprehensive',
  };

  const isValid = await agent.validate(validInput);
  if (isValid) {
    success('Input validation passed');
  } else {
    error('Input validation failed');
    return false;
  }

  info('\nTest 2: Execute trend research');
  try {
    const startTime = Date.now();
    const output = await agent.execute(validInput);
    const duration = Date.now() - startTime;

    success(`Found ${output.trends.length} trending topics (${duration}ms)`);
    info(`Source: ${output.metadata.source}`);
    info(`Timeframe: ${output.metadata.timeframe}`);
    info(`Total analyzed: ${output.metadata.totalTrendsFound}`);

    info('\nTop 3 trends:');
    output.trends.slice(0, 3).forEach((trend, index) => {
      info(`  ${index + 1}. ${trend.topic}`);
      info(`     Confidence: ${trend.confidence}`);
      info(`     Audience: ${trend.estimatedAudience.toLocaleString()}`);
      info(`     Keywords: ${trend.keywords.join(', ')}`);
      info('');
    });

    return true;
  } catch (err) {
    error(`Execution failed: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function testScripter() {
  log('\n' + '='.repeat(60), 'bright');
  log(' Testing ScripterAgent', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const Agent = agents.ScripterAgent;
  const agent = new Agent();

  info('Test 1: Validate input');
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
  if (isValid) {
    success('Input validation passed');
  } else {
    error('Input validation failed');
    return false;
  }

  info('\nTest 2: Execute script generation');
  try {
    const startTime = Date.now();
    const output = await agent.execute(input);
    const duration = Date.now() - startTime;

    success(`Script generated: ${output.script.title} (${duration}ms)`);
    info(`Duration: ${output.script.estimatedDuration}s`);
    info(`Scenes: ${output.script.scenes.length}`);
    info(`Tone: ${output.script.tone}`);
    info(`Format: ${output.script.format}`);

    info('\nFirst 3 scenes:');
    output.script.scenes.slice(0, 3).forEach((scene, index) => {
      info(`  ${index + 1}. ${scene.description}`);
      info(`     Duration: ${scene.duration}s`);
    });

    return true;
  } catch (err) {
    error(`Execution failed: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function testVoiceActor() {
  log('\n' + '='.repeat(60), 'bright');
  log(' Testing VoiceActorAgent', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const Agent = agents.VoiceActorAgent;
  const agent = new Agent();

  info('Test 1: Validate input');
  const input = {
    script: {
      id: 'script-123',
      content: 'Welcome to our video about AI content creation...',
      estimatedDuration: 300,
      scenes: [],
      createdAt: new Date(),
    },
    voiceType: 'neutral',
    emotion: 'enthusiastic',
    speed: 1.0,
  };

  const isValid = await agent.validate(input);
  if (isValid) {
    success('Input validation passed');
  } else {
    error('Input validation failed');
    return false;
  }

  info('\nTest 2: Execute voice generation');
  try {
    const startTime = Date.now();
    const output = await agent.execute(input);
    const duration = Date.now() - startTime;

    success(`Voice generated (${duration}ms)`);
    info(`Audio file: ${output.audioFile}`);
    info(`Duration: ${output.duration}s`);
    info(`Format: ${output.format}`);
    info(`Sample rate: ${output.sampleRate}Hz`);
    info(`Voice ID: ${output.metadata.voiceId}`);
    info(`Emotion: ${output.metadata.emotion}`);

    return true;
  } catch (err) {
    error(`Execution failed: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function testQualityCritic() {
  log('\n' + '='.repeat(60), 'bright');
  log(' Testing QualityCriticAgent', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const Agent = agents.QualityCriticAgent;
  const agent = new Agent();

  info('Test 1: Validate input');
  const input = {
    editedVideo: 'test-video.mp4',
    script: {
      id: 'script-123',
      scenes: [
        { id: 'scene-1', number: 1, dialogue: 'Intro', visualNotes: 'Hook', duration: 30 },
        { id: 'scene-2', number: 2, dialogue: 'Body', visualNotes: 'Demo', duration: 45 },
        { id: 'scene-3', number: 3, dialogue: 'Outro', visualNotes: 'CTA', duration: 25 },
      ],
      title: 'Test Video',
      content: 'Full script...',
      estimatedDuration: 100,
      tone: 'enthusiastic',
      format: 'youtube',
      createdAt: new Date(),
    },
    criteria: {
      audioQuality: 85,
      videoQuality: 85,
      contentQuality: 80,
      technicalQuality: 85,
    },
  };

  const isValid = await agent.validate(input);
  if (isValid) {
    success('Input validation passed');
  } else {
    error('Input validation failed');
    return false;
  }

  info('\nTest 2: Execute quality rating');
  try {
    const startTime = Date.now();
    const output = await agent.execute(input);
    const duration = Date.now() - startTime;

    success(`Quality rating complete (${duration}ms)`);
    info(`Overall score: ${output.overallScore}/100`);
    info(`Recommendation: ${output.recommendation}`);

    info('\nRatings:');
    info(`  Audio Quality: ${output.ratings.audioQuality}/100`);
    info(`  Video Quality: ${output.ratings.videoQuality}/100`);
    info(`  Content Quality: ${output.ratings.contentQuality}/100`);
    info(`  Technical Quality: ${output.ratings.technicalQuality}/100`);

    info('\nFeedback:');
    output.feedback.slice(0, 2).forEach((msg, index) => {
      info(`  ${index + 1}. ${msg}`);
    });

    info('\nIssues:');
    if (output.issues.length > 0) {
      output.issues.slice(0, 3).forEach((issue, index) => {
        info(`  ${index + 1}. ${issue.category} - ${issue.description} (${issue.severity})`);
      });
    } else {
      info('  No issues found');
    }

    return true;
  } catch (err) {
    error(`Execution failed: ${err.message}`);
    console.error(err);
    return false;
  }
}

async function runAllTests() {
  log('\n' + '='.repeat(60), 'bright');
  log(' 🧪 Agent Test Suite', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  const results = [];

  results.push(await testTrendResearcher());
  results.push(await testScripter());
  results.push(await testVoiceActor());
  results.push(await testQualityCritic());

  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;

  log('\n' + '='.repeat(60), 'bright');
  log(' Test Summary', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  success(`Passed: ${passed}/${results.length}`);
  if (failed > 0) {
    error(`Failed: ${failed}/${results.length}`);
  }

  if (failed === 0) {
    log('\n🎉 All tests passed!', 'green');
    log('\nAgents are working correctly!', 'green');
    process.exit(0);
  } else {
    log('\n❌ Some tests failed', 'red');
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  error(`Test suite error: ${err.message}`);
  console.error(err);
  process.exit(1);
});
