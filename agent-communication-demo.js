#!/usr/bin/env node

/**
 * Agent Communication Demo (JavaScript - No compilation needed)
 * Shows how agents work together and communicate
 * Run with: node agent-communication-demo.js
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
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

/**
 * Base Agent Class
 * All agents extend this to get logging and communication capabilities
 */
class BaseAgent {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.sentMessages = [];
    this.receivedMessages = [];
  }

  /**
   * Log agent activity
   */
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`${COLORS.cyan}[${timestamp}]${COLORS.reset} ${COLORS.bright}[${this.name}]${COLORS.reset} ${message}`);
  }

  /**
   * Send message to another agent
   */
  send(toAgent, messageType, data) {
    const message = {
      from: this.name,
      to: toAgent,
      type: messageType,
      data: data,
      timestamp: new Date(),
    };

    this.sentMessages.push(message);

    this.log(`${COLORS.yellow}SENDING${COLORS.reset} → ${toAgent}: ${messageType}`);

    return message;
  }

  /**
   * Receive message from another agent
   */
  receive(message) {
    this.receivedMessages.push(message);

    this.log(`${COLORS.green}RECEIVED${COLORS.reset} ← ${message.from}: ${message.type}`);
    return message;
  }

  /**
   * Execute agent logic
   */
  async execute(input) {
    this.log(`Starting execution with input...`);
    return { status: 'success', data: input };
  }
}

/**
 * Trend Researcher Agent
 * Finds trending topics and shares with ScripterAgent
 */
class TrendResearcherAgent extends BaseAgent {
  constructor() {
    super('TrendResearcherAgent', '1.0.0');
  }

  async execute(input) {
    this.log(`Finding trending topics in ${input.category}...`);

    const trends = [
      {
        id: 'trend-1',
        topic: 'AI in Content Creation',
        confidence: 0.85,
        keywords: ['AI', 'content creation', 'automation'],
        estimatedAudience: 500000,
      },
      {
        id: 'trend-2',
        topic: 'Multi-Agent Systems',
        confidence: 0.78,
        keywords: ['multi-agent', 'AI agents', 'orchestration'],
        estimatedAudience: 350000,
      },
      {
        id: 'trend-3',
        topic: 'Video Automation',
        confidence: 0.72,
        keywords: ['video', 'automation', 'FFmpeg'],
        estimatedAudience: 250000,
      },
    ];

    this.log(`Found ${trends.length} trending topics`);

    return {
      status: 'success',
      data: {
        trends,
        metadata: {
          source: input.source,
          timeframe: input.timeframe,
          totalTrendsFound: trends.length,
          topKeywords: trends.flatMap(t => t.keywords),
        },
      },
    };
  }

  /**
   * Communicate with ScripterAgent
   */
  shareWithScripter(scripterAgent, trendIndex = 0) {
    this.log(`Preparing to share trend ${trendIndex} with ScripterAgent...`);

    const trendData = {
      trend: this.lastOutput.data.trends[trendIndex],
      metadata: this.lastOutput.data.metadata,
    };

    const message = this.send('ScripterAgent', 'TREND_DATA', trendData);
    scripterAgent.receive(message);

    return trendData;
  }
}

/**
 * Scripter Agent
 * Generates script from trend data and shares with FootageCreatorAgent
 */
class ScripterAgent extends BaseAgent {
  constructor() {
    super('ScripterAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Generating script for trend: ${input.trend.topic}`);

    const script = {
      id: `script-${Date.now()}`,
      title: `The Ultimate Guide to ${input.trend.topic}`,
      content: `Here's everything about ${input.trend.topic}...`,
      estimatedDuration: 180,
      scenes: [
        { id: 'scene-1', number: 1, description: 'Opening hook', duration: 15 },
        { id: 'scene-2', number: 2, description: 'Introduction', duration: 30 },
        { id: 'scene-3', number: 3, description: 'Deep dive', duration: 45 },
        { id: 'scene-4', number: 4, description: 'Benefits', duration: 30 },
        { id: 'scene-5', number: 5, description: 'Call to action', duration: 60 },
      ],
      tone: 'enthusiastic',
      format: 'youtube',
      createdAt: new Date(),
    };

    this.log(`Script generated: ${script.title} (${script.scenes.length} scenes)`);

    this.lastOutput = { status: 'success', data: { script } };
    return this.lastOutput;
  }

  /**
   * Communicate with FootageCreatorAgent and VoiceActorAgent (parallel)
   */
  shareWithNextAgents(footageCreatorAgent, voiceActorAgent) {
    this.log(`Preparing to share script with FootageCreatorAgent and VoiceActorAgent...`);

    const scriptData = { script: this.lastOutput.data.script };

    // Send to FootageCreatorAgent
    const message1 = this.send('FootageCreatorAgent', 'SCRIPT_DATA', scriptData);
    footageCreatorAgent.receive(message1);

    // Send to VoiceActorAgent
    const message2 = this.send('VoiceActorAgent', 'SCRIPT_DATA', scriptData);
    voiceActorAgent.receive(message2);

    return scriptData;
  }
}

/**
 * Footage Creator Agent
 * Creates video footage and shares with VoiceOverAgent
 */
class FootageCreatorAgent extends BaseAgent {
  constructor() {
    super('FootageCreatorAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Creating footage for ${input.script.scenes.length} scenes...`);

    const footage = {
      id: `footage-${Date.now()}`,
      scriptId: input.script.id,
      scenes: input.script.scenes.map(scene => ({
        ...scene,
        type: 'ai-generated',
      })),
      totalDuration: input.script.estimatedDuration,
      format: 'mp4-1080p',
      resolution: '1080p',
      createdAt: new Date(),
    };

    this.log(`Footage created: ${footage.totalDuration}s total`);

    this.lastOutput = { status: 'success', data: { footage } };
    return this.lastOutput;
  }

  /**
   * Communicate with VoiceOverAgent
   */
  shareWithVoiceOverAgent(voiceOverAgent) {
    this.log(`Preparing to share footage with VoiceOverAgent...`);

    const footageData = { footage: this.lastOutput.data.footage };

    const message = this.send('VoiceOverAgent', 'FOOTAGE_DATA', footageData);
    voiceOverAgent.receive(message);

    return footageData;
  }
}

/**
 * Voice Actor Agent
 * Generates TTS voiceover and shares with VoiceOverAgent
 */
class VoiceActorAgent extends BaseAgent {
  constructor() {
    super('VoiceActorAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Generating TTS voiceover for script...`);

    const voice = {
      audioFile: `storage/audio/script-${Date.now()}.mp3`,
      duration: input.script.estimatedDuration,
      format: 'mp3',
      sampleRate: 44100,
      metadata: {
        voiceId: 'neutral-enthusiastic',
        model: 'elevenlabs-turbo-v2',
        emotion: 'enthusiastic',
        speed: 1.0,
      },
    };

    this.log(`Voiceover generated: ${voice.duration}s`);

    this.lastOutput = { status: 'success', data: { voice } };
    return this.lastOutput;
  }

  /**
   * Communicate with VoiceOverAgent
   */
  shareWithVoiceOverAgent(voiceOverAgent) {
    this.log(`Preparing to share voice with VoiceOverAgent...`);

    const voiceData = { voice: this.lastOutput.data.voice };

    const message = this.send('VoiceOverAgent', 'VOICE_DATA', voiceData);
    voiceOverAgent.receive(message);

    return voiceData;
  }
}

/**
 * Voice Over Agent
 * Syncs audio with video and shares with ComposerAgent
 */
class VoiceOverAgent extends BaseAgent {
  constructor() {
    super('VoiceOverAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    // Can receive footage or voice
    if (input.footage && !input.voice) {
      this.log(`Waiting for voice data...`);
      return { status: 'pending', data: { pending: 'voice' } };
    }

    if (input.voice && !input.footage) {
      this.log(`Waiting for footage data...`);
      return { status: 'pending', data: { pending: 'footage' } };
    }

    this.log(`Syncing audio with video...`);

    const synced = {
      syncedVideo: `storage/videos/synced-${Date.now()}.mp4`,
      metadata: {
        syncAccuracy: 98.5,
        totalDuration: input.footage.totalDuration,
        audioSegments: input.footage.scenes.length,
      },
    };

    this.log(`Voiceover synced: ${synced.syncedVideo}`);

    this.lastOutput = { status: 'success', data: { synced } };
    return this.lastOutput;
  }

  /**
   * Communicate with ComposerAgent
   */
  shareWithComposerAgent(composerAgent) {
    this.log(`Preparing to share synced video with ComposerAgent...`);

    const syncedData = { voiceOver: this.lastOutput.data.synced };

    const message = this.send('ComposerAgent', 'SYNCED_VIDEO_DATA', syncedData);
    composerAgent.receive(message);

    return syncedData;
  }
}

/**
 * Composer Agent
 * Adds background music and shares with EditorAgent
 */
class ComposerAgent extends BaseAgent {
  constructor() {
    super('ComposerAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Adding background music...`);

    const composed = {
      videoWithMusic: `storage/videos/composed-${Date.now()}.mp4`,
      musicFile: `storage/audio/music/${Date.now()}.mp3`,
      metadata: {
        musicDuration: 180,
        totalDuration: input.voiceOver.metadata.totalDuration,
        volume: 0.5,
        fadePoints: [0, 144],
      },
    };

    this.log(`Video composed with music`);

    this.lastOutput = { status: 'success', data: { composed } };
    return this.lastOutput;
  }

  /**
   * Communicate with EditorAgent
   */
  shareWithEditorAgent(editorAgent) {
    this.log(`Preparing to share composed video with EditorAgent...`);

    const composedData = { composedVideo: this.lastOutput.data.composed.videoWithMusic };

    const message = this.send('EditorAgent', 'COMPOSED_VIDEO_DATA', composedData);
    editorAgent.receive(message);

    return composedData;
  }
}

/**
 * Editor Agent
 * Applies cuts/effects and shares with QualityCriticAgent
 */
class EditorAgent extends BaseAgent {
  constructor() {
    super('EditorAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Applying cuts and effects for YouTube...`);

    const edited = {
      editedVideo: `storage/videos/edited/youtube-${Date.now()}.mp4`,
      metadata: {
        originalDuration: 180,
        editedDuration: 175,
        cutsCount: 5,
        effectsCount: 3,
        platform: 'youtube',
      },
    };

    this.log(`Video edited: ${edited.metadata.cutsCount} cuts, ${edited.metadata.effectsCount} effects`);

    this.lastOutput = { status: 'success', data: { edited } };
    return this.lastOutput;
  }

  /**
   * Communicate with QualityCriticAgent
   */
  shareWithQualityCriticAgent(qualityCriticAgent, script) {
    this.log(`Preparing to share edited video with QualityCriticAgent...`);

    const editedData = { editedVideo: this.lastOutput.data.edited.editedVideo, script };

    const message = this.send('QualityCriticAgent', 'EDITED_VIDEO_DATA', editedData);
    qualityCriticAgent.receive(message);

    return editedData;
  }
}

/**
 * Quality Critic Agent
 * Rates video quality and shares with PublisherAgent
 */
class QualityCriticAgent extends BaseAgent {
  constructor() {
    super('QualityCriticAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Rating video quality...`);

    const ratings = {
      audioQuality: 87,
      videoQuality: 89,
      contentQuality: 82,
      technicalQuality: 85,
    };

    const overallScore = Math.round(
      ratings.audioQuality * 0.25 +
      ratings.videoQuality * 0.25 +
      ratings.contentQuality * 0.30 +
      ratings.technicalQuality * 0.20
    );

    const quality = {
      overallScore,
      ratings,
      feedback: [
        'Audio quality is excellent - clear and professional',
        'Video quality is outstanding - crisp and well-composed',
        'Content is engaging and well-structured',
        'Technical execution is flawless',
      ],
      issues: [],
      recommendation: overallScore >= 85 ? 'approve' : 'needs-improvement',
    };

    this.log(`Quality rating complete: ${overallScore}/100`);

    this.lastOutput = { status: 'success', data: { quality } };
    return this.lastOutput;
  }

  /**
   * Communicate with PublisherAgent
   */
  shareWithPublisherAgent(publisherAgent, script) {
    if (this.lastOutput.data.quality.overallScore < 70) {
      this.log(`${COLORS.red}Quality too low. Not sharing with PublisherAgent${COLORS.reset}`);
      return null;
    }

    this.log(`Preparing to share video with PublisherAgent...`);

    const qualityData = {
      video: this.lastOutput.data.editedVideo,
      quality: this.lastOutput.data.quality,
      script,
    };

    const message = this.send('PublisherAgent', 'VIDEO_DATA', qualityData);
    publisherAgent.receive(message);

    return qualityData;
  }
}

/**
 * Publisher Agent
 * Uploads video to platforms
 */
class PublisherAgent extends BaseAgent {
  constructor() {
    super('PublisherAgent', '1.0.0');
    this.lastOutput = null;
  }

  async execute(input) {
    this.log(`Uploading video to ${input.platform}...`);

    const published = {
      videoId: `yt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform: input.platform,
      url: `https://youtube.com/watch?v=yt_${Date.now()}`,
      status: 'uploaded',
      publishedAt: new Date(),
    };

    this.log(`Video uploaded: ${published.url}`);

    this.lastOutput = { status: 'success', data: { published } };
    return this.lastOutput;
  }
}

/**
 * Workflow Orchestrator
 * Coordinates agents and manages communication flow
 */
class WorkflowOrchestrator {
  constructor() {
    this.agents = {};
    this.workflowId = `workflow-${Date.now()}`;
    this.context = {};
  }

  /**
   * Initialize all agents
   */
  initializeAgents() {
    this.agents = {
      trendResearcher: new TrendResearcherAgent(),
      scripter: new ScripterAgent(),
      footageCreator: new FootageCreatorAgent(),
      voiceActor: new VoiceActorAgent(),
      voiceOver: new VoiceOverAgent(),
      composer: new ComposerAgent(),
      editor: new EditorAgent(),
      qualityCritic: new QualityCriticAgent(),
      publisher: new PublisherAgent(),
    };
  }

  /**
   * Execute complete workflow showing agent communication
   */
  async execute() {
    log('\n' + '='.repeat(70), 'bright');
    log(' 🎬 Multi-Agent Content Creation Workflow', 'bright');
    log(` Workflow ID: ${this.workflowId}`);
    log('='.repeat(70) + '\n', 'bright');

    const startTime = Date.now();

    // STAGE 1: Trend Research
    log('--- STAGE 1: Trend Research ---', 'bright');
    this.agents.trendResearcher.lastOutput = await this.agents.trendResearcher.execute({
      category: 'technology',
      timeframe: '24h',
      source: 'youtube',
      depth: 'basic',
    });

    // Human checkpoint 1
    this.humanCheckpoint(
      'Trend Review',
      'Trends found. Review and select a trend to proceed.'
    );

    // STAGE 2: Script Generation
    log('\n--- STAGE 2: Script Generation ---', 'bright');
    const trendData = this.agents.trendResearcher.shareWithScripter(this.agents.scripter);
    this.agents.scripter.lastOutput = await this.agents.scripter.execute(trendData);

    // STAGE 3: Parallel Processing (Footage + Voice)
    log('\n--- STAGE 3: Parallel Processing ---', 'bright');
    const scriptData = this.agents.scripter.shareWithNextAgents(
      this.agents.footageCreator,
      this.agents.voiceActor
    );

    log('Running FootageCreatorAgent and VoiceActorAgent in parallel...', 'cyan');
    const [footageResult, voiceResult] = await Promise.all([
      this.agents.footageCreator.execute({ script: scriptData.script }),
      this.agents.voiceActor.execute({ script: scriptData.script }),
    ]);

    this.agents.footageCreator.lastOutput = footageResult;
    this.agents.voiceActor.lastOutput = voiceResult;

    // Human checkpoint 2
    this.humanCheckpoint(
      'Footage Review',
      'Video footage created. Review before proceeding with voiceover sync.'
    );

    // STAGE 4: Voiceover Sync
    log('\n--- STAGE 4: Voiceover Sync ---', 'bright');
    this.agents.footageCreator.shareWithVoiceOverAgent(this.agents.voiceOver);
    this.agents.voiceActor.shareWithVoiceOverAgent(this.agents.voiceOver);

    const voiceOverInput = {
      footage: this.agents.footageCreator.lastOutput.data.footage,
      voice: this.agents.voiceActor.lastOutput.data.voice,
    };

    this.agents.voiceOver.lastOutput = await this.agents.voiceOver.execute(voiceOverInput);

    // STAGE 5: Composition
    log('\n--- STAGE 5: Composition ---', 'bright');
    this.agents.voiceOver.shareWithComposerAgent(this.agents.composer);

    const composerInput = {
      voiceOver: this.agents.voiceOver.lastOutput.data.synced,
    };

    this.agents.composer.lastOutput = await this.agents.composer.execute(composerInput);

    // STAGE 6: Editing
    log('\n--- STAGE 6: Editing ---', 'bright');
    this.agents.composer.shareWithEditorAgent(this.agents.editor);

    const editorInput = {
      composedVideo: this.agents.composer.lastOutput.data.composed.videoWithMusic,
      targetPlatform: 'youtube',
    };

    this.agents.editor.lastOutput = await this.agents.editor.execute(editorInput);

    // STAGE 7: Quality Rating
    log('\n--- STAGE 7: Quality Rating ---', 'bright');
    this.agents.editor.shareWithQualityCriticAgent(
      this.agents.qualityCritic,
      scriptData.script
    );

    const qualityInput = {
      editedVideo: this.agents.editor.lastOutput.data.edited.editedVideo,
      script: scriptData.script,
    };

    this.agents.qualityCritic.lastOutput = await this.agents.qualityCritic.execute(qualityInput);

    // Human checkpoint 3
    this.humanCheckpoint(
      'Quality Review',
      `Video rated ${this.agents.qualityCritic.lastOutput.data.quality.overallScore}/100. Approve to upload or request changes.`
    );

    // STAGE 8: Upload (if approved)
    log('\n--- STAGE 8: Upload ---', 'bright');
    const qualityData = this.agents.qualityCritic.shareWithPublisherAgent(
      this.agents.publisher,
      scriptData.script
    );

    if (qualityData) {
      const publisherInput = {
        video: qualityData.video,
        platform: 'youtube',
        metadata: {
          title: scriptData.script.title,
          description: `Video about ${trendData.trend.topic}`,
          tags: [...trendData.trend.keywords],
          privacy: 'public',
        },
      };

      this.agents.publisher.lastOutput = await this.agents.publisher.execute(publisherInput);
    }

    const totalTime = Date.now() - startTime;

    // Print summary
    this.printSummary(totalTime);
    this.printCommunicationFlow();
  }

  humanCheckpoint(stage, description) {
    log(`\n${'='.repeat(70)}`, 'yellow');
    log(`⚠️  HUMAN CHECKPOINT: ${stage}`, 'yellow');
    log(`${'='.repeat(70)}`, 'yellow');
    log(description, 'cyan');
    log('(Press Enter to continue...)');
    // In real system, would wait for human approval via dashboard
  }

  printSummary(totalTime) {
    log('\n' + '='.repeat(70), 'bright');
    log(' 📊 Workflow Summary', 'bright');
    log('='.repeat(70) + '\n', 'bright');

    success(`Workflow ID: ${this.workflowId}`);
    success(`Total time: ${(totalTime / 1000).toFixed(2)}s`);
    success(`Agents executed: 9`);

    log('\n📋 Agent Activity:', 'bright');
    Object.values(this.agents).forEach(agent => {
      const sent = agent.sentMessages.length;
      const received = agent.receivedMessages.length;
      const executed = agent.lastOutput ? 1 : 0;

      log(`\n${agent.name}`, 'blue');
      info(`  Messages sent: ${sent}`);
      info(`  Messages received: ${received}`);
      info(`  Executions completed: ${executed}`);

      if (sent > 0) {
        log(`\n  Sent messages:`, 'cyan');
        agent.sentMessages.slice(0, 2).forEach((msg, i) => {
          log(`    ${i + 1}. ${msg.to} ← ${msg.type}`, 'yellow');
        });
      }

      if (received > 0) {
        log(`\n  Received messages:`, 'cyan');
        agent.receivedMessages.slice(0, 2).forEach((msg, i) => {
          log(`    ${i + 1}. ${msg.from} → ${msg.type}`, 'magenta');
        });
      }
    });
  }

  printCommunicationFlow() {
    log('\n' + '='.repeat(70), 'bright');
    log(' 💬 Agent Communication Flow', 'bright');
    log('='.repeat(70) + '\n', 'bright');

    log('Communication Pattern:', 'bright');
    log('\n1. Direct Method Calls:', 'cyan');
    log('   Orchestrator calls agent.execute(input)', 'yellow');
    log('   Agent returns output', 'yellow');

    log('\n2. Agent-to-Agent Messaging:', 'cyan');
    log('   agentA.send(agentB, messageType, data)', 'yellow');
    log('   agentB.receive(message)', 'yellow');

    log('\n3. Shared Context:', 'cyan');
    log('   Orchestrator stores all agent outputs', 'yellow');
    log('   Agents can access context if needed', 'yellow');

    log('\n4. Human Checkpoints:', 'cyan');
    log('   Workflow pauses at critical stages', 'yellow');
    log('   Human approves/rejects/modifies', 'yellow');
    log('   Workflow continues with approval', 'yellow');

    log('\n\nData Flow (How Agents Talk):', 'bright');
    log('```', 'cyan');
    log('TrendResearcherAgent', 'blue');
    log('  ↓ output: { trends: [...], metadata: {...} }', 'yellow');
    log('  ↓ agent.send("ScripterAgent", "TREND_DATA", output)', 'yellow');
    log('', 'white');
    log('ScripterAgent', 'blue');
    log('  ← agent.receive(message)', 'magenta');
    log('  ↓ input: { trend: {...} }', 'yellow');
    log('  ↓ output: { script: {...} }', 'yellow');
    log('  ↓ agent.send("FootageCreatorAgent", "SCRIPT_DATA", output)', 'yellow');
    log('  ↓ agent.send("VoiceActorAgent", "SCRIPT_DATA", output)', 'yellow');
    log('', 'white');
    log('FootageCreatorAgent & VoiceActorAgent (parallel)', 'magenta');
    log('  ← both receive: { script: {...} }', 'magenta');
    log('  ↓ FootageCreator: { footage: {...} }', 'yellow');
    log('  ↓ VoiceActor: { voice: {...} }', 'yellow');
    log('', 'white');
    log('VoiceOverAgent', 'blue');
    log('  ← receives from both: { footage: {...}, voice: {...} }', 'magenta');
    log('  ↓ output: { synced: {...} }', 'yellow');
    log('  ↓ agent.send("ComposerAgent", "SYNCED_VIDEO_DATA", output)', 'yellow');
    log('...continues to all 9 agents...', 'cyan');
    log('```', 'cyan');
  }
}

// Run the workflow
(async () => {
  try {
    const orchestrator = new WorkflowOrchestrator();
    orchestrator.initializeAgents();
    await orchestrator.execute();
  } catch (err) {
    error(`Workflow failed: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
})();
