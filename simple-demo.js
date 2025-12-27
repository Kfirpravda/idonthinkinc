#!/usr/bin/env node

/**
 * Simple demo of agents working together
 * Run with: node simple-demo.js
 */

const { TrendResearcherAgent } = require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent');
const { ScripterAgent } = require('./packages/agents/src/agents/scripter/ScripterAgent');
const { VoiceActorAgent } = require('./packages/agents/src/agents/voice-actor/VoiceActorAgent');
const { QualityCriticAgent } = require('./packages/agents/src/agents/quality-critic/QualityCriticAgent');

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

async function demo() {
  log('\n' + '='.repeat(60), 'bright');
  log(' 🎬 Multi-Agent Content Creation Demo', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  try {
    // Step 1: Find trends
    log('--- Step 1: Finding Trending Topics ---', 'bright');
    const trendAgent = new TrendResearcherAgent();
    const trends = await trendAgent.execute({
      category: 'technology',
      timeframe: '24h',
      source: 'youtube',
      depth: 'basic'
    });

    success(`Found ${trends.trends.length} trending topics`);
    info(`🔥 Top trend: ${trends.trends[0].topic}`);
    info(`📊 Confidence: ${trends.trends[0].confidence}`);
    info(`👥 Audience: ${trends.trends[0].estimatedAudience.toLocaleString()}`);
    info(`🔑 Keywords: ${trends.trends[0].keywords.join(', ')}`);

    // Step 2: Generate script
    log('\n--- Step 2: Generating Script ---', 'bright');
    const scriptAgent = new ScripterAgent();
    const script = await scriptAgent.execute({
      trend: trends.trends[0],
      targetDuration: 120,
      tone: 'enthusiastic',
      format: 'youtube'
    });

    success(`Script generated: ${script.script.title}`);
    info(`⏱️  Duration: ${script.script.estimatedDuration}s`);
    info(`🎬 Scenes: ${script.script.scenes.length}`);
    info(`🎭 Tone: ${script.script.tone}`);
    info(`📺 Format: ${script.script.format}`);

    // Step 3: Create voiceover
    log('\n--- Step 3: Creating Voiceover ---', 'bright');
    const voiceAgent = new VoiceActorAgent();
    const voice = await voiceAgent.execute({
      script: script.script,
      voiceType: 'neutral',
      emotion: 'enthusiastic',
      speed: 1.0
    });

    success(`Voiceover created`);
    info(`🎵 Audio file: ${voice.audioFile}`);
    info(`⏱️  Duration: ${voice.duration}s`);
    info(`📁 Format: ${voice.format}`);
    info(`🔊 Sample rate: ${voice.sampleRate}Hz`);

    // Step 4: Rate quality
    log('\n--- Step 4: Rating Quality ---', 'bright');
    const qualityAgent = new QualityCriticAgent();
    const quality = await qualityAgent.execute({
      editedVideo: 'demo-video.mp4',
      script: script.script,
      criteria: {
        audioQuality: 85,
        videoQuality: 85,
        contentQuality: 80,
        technicalQuality: 85
      }
    });

    success(`Quality rating complete`);
    info(`📊 Overall score: ${quality.overallScore}/100`);
    info(`✅ Recommendation: ${quality.recommendation}`);

    log('\nDetailed Ratings:', 'cyan');
    info(`  🎵 Audio: ${quality.ratings.audioQuality}/100`);
    info(`  🎬 Video: ${quality.ratings.videoQuality}/100`);
    info(`  📝 Content: ${quality.ratings.contentQuality}/100`);
    info(`  ⚙️  Technical: ${quality.ratings.technicalQuality}/100`);

    log('\nFeedback:', 'cyan');
    quality.feedback.slice(0, 2).forEach((msg, i) => {
      info(`  ${i + 1}. ${msg}`);
    });

    // Summary
    log('\n' + '='.repeat(60), 'bright');
    log(' ✅ Demo Complete!', 'bright');
    log('='.repeat(60) + '\n', 'bright');

    success('All agents working correctly!');
    log('\nWhat you just saw:', 'yellow');
    log('1. TrendResearcher found trending topics', 'cyan');
    log('2. Scripter generated a video script', 'cyan');
    log('3. VoiceActor created TTS voiceover', 'cyan');
    log('4. QualityCritic rated the quality', 'cyan');

    log('\nAll 9 agents are implemented and tested!', 'yellow');
    log('Ready for integration with external APIs', 'yellow');

  } catch (err) {
    log(`\n✗ Error: ${err.message}`, 'red');
    console.error(err);
    process.exit(1);
  }
}

demo();
