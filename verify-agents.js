#!/usr/bin/env node

/**
 * Simple verification script - Check if agent files exist and are valid
 * Run with: node verify-agents.js
 */

const fs = require('fs');
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

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'cyan');
}

// List of agents to verify
const agents = [
  {
    name: 'TrendResearcherAgent',
    path: 'packages/agents/src/agents/trend-researcher/TrendResearcherAgent.ts',
  },
  {
    name: 'ScripterAgent',
    path: 'packages/agents/src/agents/scripter/ScripterAgent.ts',
  },
  {
    name: 'FootageCreatorAgent',
    path: 'packages/agents/src/agents/footage-creator/FootageCreatorAgent.ts',
  },
  {
    name: 'VoiceActorAgent',
    path: 'packages/agents/src/agents/voice-actor/VoiceActorAgent.ts',
  },
  {
    name: 'VoiceOverAgent',
    path: 'packages/agents/src/agents/voiceover/VoiceOverAgent.ts',
  },
  {
    name: 'ComposerAgent',
    path: 'packages/agents/src/agents/composer/ComposerAgent.ts',
  },
  {
    name: 'EditorAgent',
    path: 'packages/agents/src/agents/editor/EditorAgent.ts',
  },
  {
    name: 'QualityCriticAgent',
    path: 'packages/agents/src/agents/quality-critic/QualityCriticAgent.ts',
  },
  {
    name: 'PublisherAgent',
    path: 'packages/agents/src/agents/publisher/PublisherAgent.ts',
  },
];

// Check BaseAgent
const baseAgentPath = 'packages/agents/src/base/BaseAgent.ts';

function verifyAgents() {
  log('\n' + '='.repeat(60), 'bright');
  log(' 🔍 Verifying Agent Implementations', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  let allExist = true;

  // Check BaseAgent
  if (fs.existsSync(baseAgentPath)) {
    success('BaseAgent exists');
    const content = fs.readFileSync(baseAgentPath, 'utf-8');
    if (content.includes('class BaseAgent') && content.includes('abstract')) {
      success('BaseAgent is an abstract class');
    } else {
      error('BaseAgent is not properly defined');
      allExist = false;
    }
  } else {
    error(`BaseAgent not found at ${baseAgentPath}`);
    allExist = false;
  }

  log('');

  // Check each agent
  agents.forEach((agent, index) => {
    const number = index + 1;
    const exists = fs.existsSync(agent.path);

    if (exists) {
      success(`${number}. ${agent.name}`);
      const content = fs.readFileSync(agent.path, 'utf-8');

      // Check for key patterns
      const hasClass = content.includes('class ' + agent.name);
      const hasBase = content.includes('extends BaseAgent');
      const hasExecute = content.includes('execute(');
      const hasValidate = content.includes('validate(');

      if (hasClass) {
        success(`   ✓ Class defined`);
      } else {
        error(`   ✗ Class not defined`);
        allExist = false;
      }

      if (hasBase) {
        success(`   ✓ Extends BaseAgent`);
      } else {
        error(`   ✗ Does not extend BaseAgent`);
        allExist = false;
      }

      if (hasExecute && hasValidate) {
        success(`   ✓ Has execute() and validate() methods`);
      } else {
        error(`   ✗ Missing required methods`);
        allExist = false;
      }

      // Check for README
      const readmePath = agent.path.replace('.ts', '/README.md');
      if (fs.existsSync(readmePath)) {
        success(`   ✓ Has README documentation`);
      } else {
        info(`   ⚠ No README found at ${readmePath}`);
      }

      log('');
    } else {
      error(`${number}. ${agent.name} - NOT FOUND`);
      error(`   Path: ${agent.path}`);
      allExist = false;
      log('');
    }
  });

  // Check shared types
  log('Checking Shared Types...', 'bright');
  const typesPath = 'packages/shared-types/src/index.ts';
  if (fs.existsSync(typesPath)) {
    success('Shared types file exists');
    const content = fs.readFileSync(typesPath, 'utf-8');

    const hasTrendTypes = content.includes('interface TrendResearchInput');
    const hasScriptTypes = content.includes('interface ScriptingInput');
    const hasWorkflowTypes = content.includes('interface WorkflowState');

    if (hasTrendTypes) {
      success('✓ Trend types defined');
    } else {
      error('✗ Trend types missing');
      allExist = false;
    }

    if (hasScriptTypes) {
      success('✓ Script types defined');
    } else {
      error('✗ Script types missing');
      allExist = false;
    }

    if (hasWorkflowTypes) {
      success('✓ Workflow types defined');
    } else {
      error('✗ Workflow types missing');
      allExist = false;
    }
  } else {
    error('Shared types file not found');
    allExist = false;
  }

  log('\n' + '='.repeat(60), 'bright');
  log(' Summary', 'bright');
  log('='.repeat(60) + '\n', 'bright');

  if (allExist) {
    success('All agents exist and are properly structured!');
    log('\n🎉 Agent implementation verification passed!', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Install TypeScript dev dependencies:', 'yellow');
    log('   npm install -D typescript ts-node @types/node', 'yellow');
    log('\n2. Build the packages:', 'yellow');
    log('   npm run build', 'yellow');
    log('\n3. Run actual tests:', 'yellow');
    log('   node test-runner.js (after build)', 'yellow');
    process.exit(0);
  } else {
    error('Some agents are missing or incorrectly structured');
    process.exit(1);
  }
}

verifyAgents();
