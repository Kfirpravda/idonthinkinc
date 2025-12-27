# FootageCreatorAgent

Creates video footage for script scenes using various methods.

## Purpose

The Footage Creator agent generates video content for each scene in the script, supporting multiple creation methods including AI generation, stock footage, screen recording, and animation.

## Input

```typescript
interface FootageCreationInput {
  script: Script;                           // Script from ScripterAgent
  footageType?: 'screen-recording' | 'ai-generated' | 'stock' | 'animated';
  quality?: '720p' | '1080p' | '4k';
}
```

## Output

```typescript
interface FootageCreationOutput {
  footage: Footage;
  status: 'pending' | 'in-progress' | 'completed' | 'requires-human-review';
}

interface Footage {
  id: string;
  scriptId: string;
  scenes: FootageScene[];
  totalDuration: number;
  format: string;
  resolution: string;
  filePath?: string;
  createdAt: Date;
}

interface FootageScene {
  sceneNumber: number;
  duration: number;
  filePath?: string;
  type: string;
  description: string;
}
```

## Example Usage

```typescript
import { FootageCreatorAgent } from '@idonthinkinc/agents';

const agent = new FootageCreatorAgent();

const input = {
  script: {
    id: 'script-123',
    scenes: [
      {
        id: 'scene-1',
        number: 1,
        dialogue: 'Welcome to the video',
        visualNotes: 'Dynamic text overlay',
        duration: 15
      }
    ]
  },
  footageType: 'ai-generated',
  quality: '1080p'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Created ${output.footage.scenes.length} scenes`);
  console.log(`Total duration: ${output.footage.totalDuration}s`);
}
```

## Footage Types

### AI-Generated
- Uses AI video generation (e.g., Runway ML)
- Creates custom visuals from scene descriptions
- Processing time: ~3-5 min per scene

### Stock Footage
- Searches stock footage libraries
- Finds relevant existing clips
- Processing time: ~2-3 min per scene

### Screen Recording
- Captures screen demonstrations
- Ideal for tutorials and software
- Processing time: ~10 min (real-time recording)

### Animated
- Creates animated graphics and text
- Uses motion graphics tools
- Processing time: ~5 min per scene

## Quality Settings

- **720p** - HD, good for social media
- **1080p** - Full HD, recommended for YouTube (default)
- **4k** - Ultra HD, high-end content

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: Yes (after creation)
- **Estimated Execution Time**: 600000ms (10 min)
- **Max Retries**: 2

## Dependencies

- FFmpeg for video processing
- Video generation APIs (planned: Runway ML, Pexels)
- Script data from ScripterAgent

## Storage Structure

```
storage/videos/
├── scene-1-ai-generated.mp4
├── scene-2-ai-generated.mp4
├── scene-3-stock.mp4
└── ...
```

## Human Approval Workflow

After footage creation:

1. Review each scene
2. Approve or regenerate specific scenes
3. Can switch footage type for individual scenes
4. Add custom notes for improvements

## Logging

```
[2024-01-01T00:00:00.000Z] [FootageCreator] [INFO] Creating footage for script: script-123
[2024-01-01T00:00:00.000Z] [FootageCreator] [INFO] Creating footage with type: ai-generated, quality: 1080p
[2024-01-01T00:00:00.000Z] [FootageCreator] [INFO] Generating AI video for scene 1
[2024-01-01T00:00:00.000Z] [FootageCreator] [INFO] Footage created: 9 scenes, 255s
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('script')) {
    console.error('Invalid script data');
  }
}
```

## Development

```bash
# Run agent in development mode
npm run dev:agent:footage-creator

# Run tests
npm run test:agent:footage-creator

# Type check
npm run typecheck
```

## Next Steps

After footage approval, workflow continues to:

**VoiceActorAgent** - Generates voiceover for the script
