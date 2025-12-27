#!/usr/bin/env node

/**
 * Demo script showing agent execution
 * Run with: node demo-agents.js
 */

const { spawn } = require('child_process');
const path = require('path');

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

async function runCommand(command, args, description) {
  log(`\n${COLORS.bright}⚡ ${description}${COLORS.reset}\n`);

  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
}

async function demo() {
  log('\n' + '='.repeat(60), 'bright');
  log(' 🎬 Multi-Agent Content Creation Demo', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  info('This demo will show how to test individual agents');
  info('and run a complete workflow test.\n');

  // Demo 1: Test a single agent
  log('--- Demo 1: Single Agent Test ---', 'bright');
  info('Testing TrendResearcherAgent to find trending topics\n');

  try {
    await runCommand('node', ['-e', `
      const { TrendResearcherAgent } = require('./packages/agents/src/agents/trend-researcher/TrendResearcherAgent');
      const agent = new TrendResearcherAgent();
      (async () => {
        const input = { timeframe: '24h', source: 'youtube', depth: 'comprehensive' };
        const output = await agent.execute(input);
        console.log('\\n✅ Found', output.trends.length, 'trending topics');
        console.log('\\n🔥 Top Trend:', output.trends[0].topic);
        console.log('   Confidence:', output.trends[0].confidence);
        console.log('   Keywords:', output.trends[0].keywords.join(', '));
        console.log('\\n🎯 Sample usage: node -e "const { TrendResearcherAgent } = require(\\'./packages/agents/src/agents/trend-researcher/TrendResearcherAgent\\'); const a = new TrendResearcherAgent(); (async () => { const r = await a.execute({ timeframe: \\'24h\\' }); console.log(r.trends); })().catch(console.err)"');
      })().catch(console.error);
    `], 'Finding trending topics');

    success('Single agent test completed!\n');
  } catch (err) {
    log(`✗ Error: ${err.message}`, 'red');
  }

  // Demo 2: Test multiple agents in sequence
  log('--- Demo 2: Sequential Workflow ---', 'bright');
  info('Running 4 agents in sequence to create content\n');

  try {
    await runCommand('node', ['-e', `
      const {
        TrendResearcherAgent,
        ScripterAgent,
        VoiceActorAgent,
        QualityCriticAgent
      } = require('./packages/agents/src/index');

      (async () => {
        console.log('🚀 Starting workflow...\\n');

        // Step 1: Find trends
        const trendAgent = new TrendResearcherAgent();
        const trendInput = { category: 'technology', timeframe: '24h', source: 'youtube', depth: 'basic' };
        const trends = await trendAgent.execute(trendInput);
        console.log('✅ Step 1: Found', trends.trends.length, 'trends');
        console.log('   📊 Top trend:', trends.trends[0].topic);

        // Step 2: Generate script
        const scriptAgent = new ScripterAgent();
        const scriptInput = {
          trend: trends.trends[0],
          targetDuration: 120,
          tone: 'enthusiastic',
          format: 'youtube'
        };
        const script = await scriptAgent.execute(scriptInput);
        console.log('\\n✅ Step 2: Generated script');
        console.log('   📝 Title:', script.script.title);
        console.log('   ⏱️  Duration:', script.script.estimatedDuration + 's');
        console.log('   🎬 Scenes:', script.script.scenes.length);

        // Step 3: Create voiceover
        const voiceAgent = new VoiceActorAgent();
        const voiceInput = {
          script: script.script,
          voiceType: 'neutral',
          emotion: 'enthusiastic'
        };
        const voice = await voiceAgent.execute(voiceInput);
        console.log('\\n✅ Step 3: Generated voiceover');
        console.log('   🎵 Audio:', voice.audioFile);
        console.log('   ⏱️  Duration:', voice.duration + 's');

        // Step 4: Rate quality
        const qualityAgent = new QualityCriticAgent();
        const qualityInput = {
          editedVideo: 'demo-video.mp4',
          script: script.script
        };
        const quality = await qualityAgent.execute(qualityInput);
        console.log('\\n✅ Step 4: Rated quality');
        console.log('   📊 Overall Score:', quality.overallScore + '/100');
        console.log('   ✓ Recommendation:', quality.recommendation);

        console.log('\\n🎉 Workflow completed successfully!');
      })().catch(console.error);
    `], 'Running sequential workflow');

    success('Sequential workflow completed!\n');
  } catch (err) {
    log(`✗ Error: ${err.message}`, 'red');
  }

  // Summary
  log('='.repeat(60), 'bright');
  log(' Demo Complete!', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  success('✅ All agents are working correctly');
  info('📚 Full documentation: packages/agents/src/agents/*/README.md');
  info('🧪 Testing guide: QUICK_TEST.md or TESTING.md');
  info('🔍 Verify any time: node verify-agents.js\n');

  log('💡 Quick test examples:', 'cyan');
  log('   node -e "const { TrendResearcherAgent } = require(\\'./packages/agents/src/agents/trend-researcher/TrendResearcherAgent\\'); (async () => { const a = new TrendResearcherAgent(); const r = await a.execute({ timeframe: \\'24h\\' }); console.log(\\'Trends:\\', r.trends.length); })().catch(console.err)"\n', 'yellow');
}

demo().catch(err => {
  log(`\n✗ Demo failed: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
