# How Agents Work Together and Communicate

## Overview

The multi-agent content creation system uses **3 communication patterns** to enable agents to work together efficiently:

1. **Direct Method Calls** - Orchestrator calls agent methods
2. **Agent-to-Agent Messaging** - Agents send/receive messages
3. **Shared Context** - Orchestrator stores and shares data

## Agent Communication Demo

Run the working demo:
```bash
node agent-communication-demo.js
```

This demonstrates:
- ✅ All 9 agents executing in sequence
- ✅ Agents sending/receiving messages to each other
- ✅ Parallel execution of independent agents
- ✅ Human checkpoints at critical stages
- ✅ Data flowing through the entire workflow

## Communication Patterns

### 1. Direct Method Calls (Orchestrator → Agent)

The `WorkflowOrchestrator` directly calls agent methods:

```javascript
// TrendResearcherAgent execution
const trendOutput = await trendResearcherAgent.execute({
  category: 'technology',
  timeframe: '24h',
  source: 'youtube'
});

// Output stored in orchestrator context
this.context.trends = trendOutput.data.trends;
```

**Flow**:
```
WorkflowOrchestrator
    ↓ agent.execute(input)
Agent executes logic
    ↓ return { status: success, data: {...} }
Orchestrator receives output
    ↓ stores in this.context
Context available to other agents
```

### 2. Agent-to-Agent Messaging (Agent → Agent)

Agents send messages to other agents using `send()` and `receive()`:

```javascript
// TrendResearcherAgent sends to ScripterAgent
const message = this.send(
  'ScripterAgent',           // To agent
  'TREND_DATA',             // Message type
  {                          // Data
    trend: trendData.trend,
    metadata: trendData.metadata
  }
);

// ScripterAgent receives message
scripterAgent.receive(message);
```

**Flow**:
```
Agent A
    ↓ send(toAgent, messageType, data)
Message created and logged
    ↓ pass to toAgent
Agent B
    ↓ receive(message)
Message logged as received
    ↓ extract data
Agent B has data from Agent A
```

### 3. Shared Context (Orchestrator → All Agents)

The orchestrator stores all agent outputs in `this.context`:

```javascript
class WorkflowOrchestrator {
  constructor() {
    this.context = {
      trends: null,          // From TrendResearcherAgent
      script: null,           // From ScripterAgent
      footage: null,          // From FootageCreatorAgent
      voice: null,            // From VoiceActorAgent
      voiceOver: null,         // From VoiceOverAgent
      composedVideo: null,    // From ComposerAgent
      editedVideo: null,      // From EditorAgent
      quality: null,          // From QualityCriticAgent
      uploadResult: null       // From PublisherAgent
    };
  }
}
```

Any agent can access context if needed:
```javascript
const script = this.context.script;
const trend = this.context.trends[0];
```

## Complete Agent Workflow

### Sequential Flow

```
1. TrendResearcherAgent
   ├─ execute({ category, timeframe, source })
   ├─ output: { trends: [...], metadata: {...} }
   ├─ send('ScripterAgent', 'TREND_DATA', trendData)
   └─ stored in context: context.trends

2. ScripterAgent
   ├─ receive('TREND_DATA') ← TrendResearcherAgent
   ├─ execute({ trend: context.trends[0], duration: 180 })
   ├─ output: { script: {...} }
   ├─ send('FootageCreatorAgent', 'SCRIPT_DATA', scriptData)
   ├─ send('VoiceActorAgent', 'SCRIPT_DATA', scriptData)
   └─ stored in context: context.script

3. FootageCreatorAgent & VoiceActorAgent (PARALLEL)
   │
   ├─ FootageCreatorAgent
   │   ├─ receive('SCRIPT_DATA') ← ScripterAgent
   │   ├─ execute({ script: context.script })
   │   ├─ output: { footage: {...} }
   │   ├─ send('VoiceOverAgent', 'FOOTAGE_DATA', footageData)
   │   └─ stored in context: context.footage
   │
   └─ VoiceActorAgent
       ├─ receive('SCRIPT_DATA') ← ScripterAgent
       ├─ execute({ script: context.script })
       ├─ output: { voice: {...} }
       ├─ send('VoiceOverAgent', 'VOICE_DATA', voiceData)
       └─ stored in context: context.voice

4. VoiceOverAgent
   ├─ receive('FOOTAGE_DATA') ← FootageCreatorAgent
   ├─ receive('VOICE_DATA') ← VoiceActorAgent
   ├─ execute({ footage: context.footage, voice: context.voice })
   ├─ output: { synced: {...} }
   ├─ send('ComposerAgent', 'SYNCED_VIDEO_DATA', syncedData)
   └─ stored in context: context.voiceOver

5. ComposerAgent
   ├─ receive('SYNCED_VIDEO_DATA') ← VoiceOverAgent
   ├─ execute({ voiceOver: context.voiceOver })
   ├─ output: { composed: {...} }
   ├─ send('EditorAgent', 'COMPOSED_VIDEO_DATA', composedData)
   └─ stored in context: context.composedVideo

6. EditorAgent
   ├─ receive('COMPOSED_VIDEO_DATA') ← ComposerAgent
   ├─ execute({ composedVideo: context.composedVideo })
   ├─ output: { edited: {...} }
   ├─ send('QualityCriticAgent', 'EDITED_VIDEO_DATA', editedData)
   └─ stored in context: context.editedVideo

7. QualityCriticAgent
   ├─ receive('EDITED_VIDEO_DATA') ← EditorAgent
   ├─ execute({ editedVideo: context.editedVideo, script: context.script })
   ├─ output: { quality: {...} }
   ├─ send('PublisherAgent', 'VIDEO_DATA', qualityData) [if approved]
   └─ stored in context: context.quality

8. PublisherAgent (if quality >= 70)
   ├─ receive('VIDEO_DATA') ← QualityCriticAgent
   ├─ execute({ video: context.editedVideo })
   ├─ output: { published: {...} }
   └─ stored in context: context.uploadResult
```

## Human-in-the-Loop

The workflow pauses at 3 critical checkpoints for human review:

### Checkpoint 1: After Trend Research

**What human sees**:
```
Trends Found:
1. AI in Content Creation (confidence: 0.85)
2. Multi-Agent Systems (confidence: 0.78)
3. Video Automation (confidence: 0.72)

Human Action Required:
- [ ] Approve selected trend
- [ ] Reject and re-research
- [ ] Add custom trend
```

**What happens**:
- **Approve**: Workflow continues to ScripterAgent with selected trend
- **Reject**: TrendResearcherAgent runs again with different parameters
- **Modify**: Human can add custom trends to the list

### Checkpoint 2: After Footage Creation

**What human sees**:
```
Footage Created:
- 9 scenes generated
- Total duration: 180s
- AI-generated footage for all scenes

Preview:
[Scene 1 thumbnail] [Scene 2 thumbnail] [Scene 3 thumbnail]...

Human Action Required:
- [ ] Approve footage
- [ ] Regenerate specific scenes
- [ ] Switch footage type (AI/Stock/Screen Recording)
```

**What happens**:
- **Approve**: Workflow continues to voiceover sync
- **Regenerate**: FootageCreatorAgent re-runs with new parameters
- **Switch**: Different footage type used

### Checkpoint 3: After Quality Rating

**What human sees**:
```
Quality Rating: 86/100

Ratings:
- Audio Quality: 87/100 ✓
- Video Quality: 89/100 ✓
- Content Quality: 82/100 ✓
- Technical Quality: 85/100 ✓

Recommendation: Needs Improvement

Issues Found:
1. Content could be more engaging (medium)
2. Minor audio noise in scene 3 (low)

Human Action Required:
- [ ] Approve for upload
- [ ] Request changes and re-run from EditorAgent
- [ ] Reject and start over
```

**What happens**:
- **Approve (>=85)**: PublisherAgent uploads to YouTube
- **Needs Improvement (70-84)**: Can request changes or still upload
- **Reject (<70)**: Workflow restarts from specific agent

## Parallel Execution

Some agents can run in parallel to speed up workflow:

```javascript
// FootageCreatorAgent and VoiceActorAgent run simultaneously
const [footageResult, voiceResult] = await Promise.all([
  footageCreatorAgent.execute({ script: context.script }),
  voiceActorAgent.execute({ script: context.script })
]);

// Both complete faster than sequential
```

**Benefits**:
- ⚡ 2x faster for independent tasks
- 💻 Better resource utilization
- 📦 More efficient workflow

## Message Types

Agents use message types to communicate data:

```javascript
const MESSAGE_TYPES = {
  TREND_DATA: 'TREND_DATA',              // Trend data → Scripter
  SCRIPT_DATA: 'SCRIPT_DATA',              // Script data → Footage + Voice
  FOOTAGE_DATA: 'FOOTAGE_DATA',          // Footage data → VoiceOver
  VOICE_DATA: 'VOICE_DATA',                // Voice data → VoiceOver
  SYNCED_VIDEO_DATA: 'SYNCED_VIDEO_DATA', // Synced video → Composer
  COMPOSED_VIDEO_DATA: 'COMPOSED_VIDEO_DATA', // Composed → Editor
  EDITED_VIDEO_DATA: 'EDITED_VIDEO_DATA', // Edited → QualityCritic
  VIDEO_DATA: 'VIDEO_DATA',              // Video data → Publisher
};
```

## Data Flow Example

### Example: ScripterAgent receives trend data

```javascript
// 1. TrendResearcherAgent sends
trendResearcherAgent.send('ScripterAgent', 'TREND_DATA', {
  trend: {
    id: 'trend-1',
    topic: 'AI in Content Creation',
    confidence: 0.85,
    keywords: ['AI', 'content creation'],
    estimatedAudience: 500000
  },
  metadata: {
    source: 'youtube',
    timeframe: '24h',
    totalTrendsFound: 6
  }
});

// Message sent: [2025-12-27T16:03:10.000Z] [TrendResearcherAgent] SENDING → ScripterAgent: TREND_DATA

// 2. ScripterAgent receives
scripterAgent.receive(message);

// Message received: [2025-12-27T16:03:10.000Z] [ScripterAgent] RECEIVED ← TrendResearcherAgent: TREND_DATA

// 3. ScripterAgent executes with trend data
const script = await scripterAgent.execute({
  trend: message.data.trend,  // ← Data from message!
  targetDuration: 180,
  tone: 'enthusiastic'
});

// Script generated: [2025-12-27T16:03:10.000Z] [ScripterAgent] Script generated: The Ultimate Guide to AI in Content Creation (5 scenes)
```

## Benefits of This Architecture

### 1. Loose Coupling
- Agents don't know about each other's internals
- Agents only send/receive messages
- Easy to add/remove/replace agents

### 2. Parallel Execution
- Independent agents can run simultaneously
- Faster workflow completion
- Better resource utilization

### 3. Human-in-the-Loop
- Pauses at critical decision points
- Humans approve/reject/modify
- Maintains control over content quality

### 4. Scalability
- Easy to add new agents
- Can scale to multiple workflows running in parallel
- Can distribute across machines

### 5. Debuggability
- All agent activity is logged with timestamps
- Easy to trace communication flow
- Simple to identify bottlenecks

## Running the Demo

### Quick Test
```bash
node agent-communication-demo.js
```

This runs the complete workflow showing:
- All 9 agents executing
- Agent-to-agent communication
- Parallel execution of independent agents
- Human checkpoints
- Complete data flow

### Expected Output

```
======================================================================
 🎬 Multi-Agent Content Creation Workflow
 Workflow ID: workflow-1766851390302
======================================================================

--- STAGE 1: Trend Research ---
[timestamp] [TrendResearcherAgent] Finding trending topics in technology...
[timestamp] [TrendResearcherAgent] Found 3 trending topics

⚠️  HUMAN CHECKPOINT: Trend Review
======================================================================
Trends found. Review and select a trend to proceed.

--- STAGE 2: Script Generation ---
[timestamp] [TrendResearcherAgent] SENDING → ScripterAgent: TREND_DATA
[timestamp] [ScripterAgent] RECEIVED ← TrendResearcherAgent: TREND_DATA
[timestamp] [ScripterAgent] Generating script for trend: AI in Content Creation
[timestamp] [ScripterAgent] Script generated: The Ultimate Guide to AI in Content Creation (5 scenes)

--- STAGE 3: Parallel Processing ---
[timestamp] [ScripterAgent] SENDING → FootageCreatorAgent: SCRIPT_DATA
[timestamp] [FootageCreatorAgent] RECEIVED ← ScripterAgent: SCRIPT_DATA
[timestamp] [ScripterAgent] SENDING → VoiceActorAgent: SCRIPT_DATA
[timestamp] [VoiceActorAgent] RECEIVED ← ScripterAgent: SCRIPT_DATA

Running FootageCreatorAgent and VoiceActorAgent in parallel...

[... all 9 agents execute ...]

✓ Workflow Complete!

📋 Agent Activity:
  TrendResearcherAgent
    Messages sent: 1
    Messages received: 0
    Executions completed: 1

  ScripterAgent
    Messages sent: 2
    Messages received: 1
    Executions completed: 1

  [... all agents ...]
```

## Next Steps

1. ✅ **Test agents**: Run `node agent-communication-demo.js`
2. ✅ **Review communication**: See how agents send/receive messages
3. ⏳ **Integrate with real APIs**: Connect to OpenAI, ElevenLabs, etc.
4. ⏳ **Build dashboard**: Create human approval UI
5. ⏳ **Add persistent storage**: Store workflow data in database
6. ⏳ **Add error handling**: Robust retry logic and failure recovery
7. ⏳ **Add monitoring**: Track workflow performance and agent metrics

## Summary

✅ **All 9 agents implemented and working**
✅ **Agent communication demonstrated**
✅ **Parallel execution working**
✅ **Human checkpoints defined**
✅ **Data flow verified**

**Key Communication Pattern**:
```
Orchestrator
    ↓ (direct calls)
Agent A
    ↓ (send)
Agent B
    ↓ (receive)
Agent B processes
    ↓ (send)
Agent C
    ↓ (continue through all 9 agents)
```

**Agents talk by**:
1. **Direct method calls** from orchestrator
2. **Agent.send()** to send messages
3. **Agent.receive()** to receive messages
4. **Shared context** to access other agent data
5. **Parallel execution** via Promise.all()

---

**Test it yourself:**
```bash
node agent-communication-demo.js
```
