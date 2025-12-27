# @idonthinkinc/agents

Multi-agent package for the idonthinkinc content creation system.

## Overview

This package contains all agent implementations for the automated content creation workflow:

1. **TrendResearcherAgent** - Analyzes competitor websites to identify trending topics
2. **ScripterAgent** - Generates video scripts using AI
3. **FootageCreatorAgent** - Creates video footage (AI-generated, stock, screen recording)
4. **VoiceActorAgent** - Generates voiceover audio using TTS
5. **VoiceOverAgent** - Syncs audio with video
6. **ComposerAgent** - Adds background music to video
7. **EditorAgent** - Applies cuts and effects for target platform
8. **QualityCriticAgent** - Rates video quality across multiple dimensions
9. **PublisherAgent** - Uploads video to platforms (YouTube, TikTok, Instagram)

## Installation

```bash
npm install @idonthinkinc/agents
```

## Usage

### Individual Agent Usage

```typescript
import { TrendResearcherAgent } from '@idonthinkinc/agents';

const agent = new TrendResearcherAgent();

const input = {
  competitorUrl: 'https://example.com',
  timeframe: '7d',
  depth: 'comprehensive'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);
  console.log(output.trends);
}
```

### All Agents

```typescript
import {
  TrendResearcherAgent,
  ScripterAgent,
  FootageCreatorAgent,
  VoiceActorAgent,
  VoiceOverAgent,
  ComposerAgent,
  EditorAgent,
  QualityCriticAgent,
  PublisherAgent
} from '@idonthinkinc/agents';
```

## Agent Interface

All agents implement the `Agent<Input, Output>` interface:

```typescript
interface Agent<Input, Output> {
  name: string;
  version: string;
  execute(input: Input): Promise<Output>;
  validate(input: Input): Promise<boolean>;
  getCapabilities(): AgentCapabilities;
}
```

## BaseAgent Class

The `BaseAgent` abstract class provides common functionality:

- Logging (`this.log()`)
- Retry logic (`this.executeWithRetry()`)
- Error handling

### Extending BaseAgent

```typescript
import { BaseAgent } from '@idonthinkinc/agents';
import { Agent, AgentCapabilities } from '@idonthinkinc/shared-types';

export class MyAgent extends BaseAgent<Input, Output> implements Agent<Input, Output> {
  name = 'MyAgent';
  version = '1.0.0';

  async validate(input: Input): Promise<boolean> {
    return true;
  }

  async execute(input: Input): Promise<Output> {
    this.log('Starting execution');

    const result = await this.executeWithRetry(async () => {
      return await this.performTask(input);
    });

    return result;
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 60000,
      maxRetries: 3
    };
  }

  private async performTask(input: Input): Promise<Output> {
    // Implementation
  }
}
```

## Agent Workflows

### Standard Workflow

```
TrendResearcher
    ↓ (requires human approval)
Scripter
    ↓
FootageCreator
    ↓ (requires human approval)
VoiceActor
    ↓
VoiceOver
    ↓
Composer
    ↓
Editor
    ↓
QualityCritic
    ↓ (requires human approval)
Publisher
```

### Parallel Execution

Some agents can run in parallel:

```typescript
import { Promise } from 'bluebird';

const [script, footage] = await Promise.all([
  scripterAgent.execute(scriptInput),
  footageCreatorAgent.execute(footageInput)
]);
```

## Agent Capabilities

### Human Approval Required

- `TrendResearcherAgent` - After competitor analysis
- `FootageCreatorAgent` - After footage generation
- `QualityCriticAgent` - After quality rating

### Async Capable

All agents support async execution for parallel processing.

## Development

### Run in Development Mode

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

## Testing

```bash
npm test
```

## Agent-Specific Documentation

Each agent has its own documentation in its directory:

- [TrendResearcherAgent](./src/agents/trend-researcher/)
- [ScripterAgent](./src/agents/scripter/)
- [FootageCreatorAgent](./src/agents/footage-creator/)
- [VoiceActorAgent](./src/agents/voice-actor/)
- [VoiceOverAgent](./src/agents/voiceover/)
- [ComposerAgent](./src/agents/composer/)
- [EditorAgent](./src/agents/editor/)
- [QualityCriticAgent](./src/agents/quality-critic/)
- [PublisherAgent](./src/agents/publisher/)

## Error Handling

All agents include built-in error handling and retry logic:

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  // Agent will retry up to maxRetries times
  // If all retries fail, error is thrown
}
```

## Logging

Agents log to console with timestamps:

```
[2024-01-01T00:00:00.000Z] [AgentName] [INFO] Message
[2024-01-01T00:00:00.000Z] [AgentName] [WARN] Warning message
[2024-01-01T00:00:00.000Z] [AgentName] [ERROR] Error message
```

## Contributing

When adding a new agent:

1. Create directory: `packages/agents/src/agents/your-agent/`
2. Implement agent extending `BaseAgent`
3. Add index.ts exporting the agent
4. Update this README
5. Follow the agent interface

## License

MIT
