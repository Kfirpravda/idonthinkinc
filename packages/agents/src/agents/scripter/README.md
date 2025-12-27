# ScripterAgent

Generates video scripts based on trending topics using AI.

## Purpose

The Scripter agent creates engaging video scripts from trend research data, tailored to specific platforms and target durations.

## Input

```typescript
interface ScriptingInput {
  trend: Trend;                  // Selected trend from research
  targetDuration: number;          // Target video duration in seconds
  tone?: 'serious' | 'casual' | 'enthusiastic' | 'professional';
  format?: 'youtube' | 'tiktok' | 'instagram' | 'twitter';
}
```

## Output

```typescript
interface ScriptingOutput {
  script: Script;
  metadata: ScriptMetadata;
}

interface Script {
  id: string;
  title: string;
  content: string;
  estimatedDuration: number;
  scenes: Scene[];
  tone: string;
  format: string;
  createdAt: Date;
}

interface Scene {
  id: string;
  number: number;
  description: string;
  dialogue: string;
  visualNotes: string;
  duration: number;
}
```

## Example Usage

```typescript
import { ScripterAgent } from '@idonthinkinc/agents';

const agent = new ScripterAgent();

const input = {
  trend: {
    id: 'trend-1',
    topic: 'AI in Content Creation',
    confidence: 0.85,
    relevanceScore: 0.9,
    keywords: ['AI', 'content creation'],
    estimatedAudience: 50000
  },
  targetDuration: 300,
  tone: 'enthusiastic',
  format: 'youtube'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Script: ${output.script.title}`);
  console.log(`Duration: ${output.script.duration}s`);
  console.log(`Scenes: ${output.script.scenes.length}`);
}
```

## Script Generation Process

1. Analyze trend and keywords
2. Generate engaging title
3. Create scene structure (3-9 scenes based on duration)
4. Write dialogue for each scene
5. Add visual notes for footage creation
6. Compile final script

## Tones Available

- **serious** - Professional, authoritative
- **casual** - Relaxed, conversational
- **enthusiastic** - High energy, exciting (default)
- **professional** - Business-focused, informative

## Platform Formats

- **youtube** - Longer form, detailed explanations
- **tiktok** - Short, fast-paced, 15-60s
- **instagram** - Medium length, visually focused
- **twitter** - Short, impactful statements

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 120000ms (2 min)
- **Max Retries**: 3

## Dependencies

- OpenAI API (GPT-4) for script generation
- Trend research data from TrendResearcherAgent

## Scene Structure

### Opening Hook (15s)
- Engaging visual with dynamic text
- Introduce topic

### Introduction (30s)
- Background on trend
- Why it matters

### Deep Dive (45s)
- Detailed explanation
- Examples and use cases

### Benefits (30s)
- Key advantages
- Applications

### Real-World Example (40s)
- Case study or demo
- Practical demonstration

### Common Mistakes (25s)
- Pitfalls to avoid
- Warning signs

### Tips for Success (20s)
- Best practices
- Quick wins

### Advanced Techniques (35s)
- Expert-level content
- Next-level strategies

### Call to Action (15s)
- Engagement prompt
- Subscribe reminder

## Logging

```
[2024-01-01T00:00:00.000Z] [Scripter] [INFO] Generating script for trend: AI in Content Creation
[2024-01-01T00:00:00.000Z] [Scripter] [INFO] Generating script with tone: enthusiastic, format: youtube
[2024-01-01T00:00:00.000Z] [Scripter] [INFO] Script generated: The Ultimate Guide to AI in Content Creation (9 scenes)
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('trend')) {
    console.error('Invalid trend data');
  }
}
```

## Development

```bash
# Run agent in development mode
npm run dev:agent:scripter

# Run tests
npm run test:agent:scripter

# Type check
npm run typecheck
```

## Next Steps

After script generation, workflow continues to:

**FootageCreatorAgent** - Creates video footage based on script scenes
