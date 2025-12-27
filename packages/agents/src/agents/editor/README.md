# EditorAgent

Applies cuts, transitions, and effects for target platforms.

## Purpose

The Editor agent tailors videos to specific platforms by applying appropriate cuts, transitions, text overlays, and effects that match each platform's best practices.

## Input

```typescript
interface EditingInput {
  composedVideo: string;              // From ComposerAgent
  targetPlatform: 'youtube' | 'tiktok' | 'instagram';
  cuts?: VideoCut[];                 // Optional custom cuts
  effects?: VideoEffect[];            // Optional custom effects
}

interface VideoCut {
  startTime: number;         // Start time (seconds)
  endTime: number;           // End time (seconds)
  type: 'cut' | 'fade' | 'dissolve' | 'wipe';
}

interface VideoEffect {
  type: 'transition' | 'filter' | 'overlay' | 'text';
  startTime: number;         // Start time (seconds)
  duration: number;          // Duration (seconds)
  params: Record<string, any>;
}
```

## Output

```typescript
interface EditingOutput {
  editedVideo: string;       // Path to edited video
  metadata: EditingMetadata;
}

interface EditingMetadata {
  originalDuration: number;       // Original duration (seconds)
  editedDuration: number;         // Edited duration (seconds)
  cutsCount: number;             // Number of cuts applied
  effectsCount: number;           // Number of effects applied
  platform: string;              // Target platform
}
```

## Example Usage

```typescript
import { EditorAgent } from '@idonthinkinc/agents';

const agent = new EditorAgent();

const input = {
  composedVideo: 'storage/videos/composed/video-123.mp4',
  targetPlatform: 'youtube'
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Edited video: ${output.editedVideo}`);
  console.log(`Platform: ${output.metadata.platform}`);
  console.log(`Cuts: ${output.metadata.cutsCount}`);
  console.log(`Effects: ${output.metadata.effectsCount}`);
}
```

## Platform-Specific Editing

### YouTube

**Aspect Ratio**: 16:9 (1920x1080)
**Video Length**: 10-20 minutes recommended
**Cuts**: Every 60 seconds
**Effects**:
- "Subscribe!" text overlay (bottom-right)
- Fade transitions
- Logo overlay
- Chapter markers

### TikTok

**Aspect Ratio**: 9:16 (1080x1920)
**Video Length**: 15-60 seconds recommended
**Cuts**: Every 15 seconds
**Effects**:
- #fyp #trending hashtag overlay (bottom)
- Cut transitions (fast cuts)
- Vibrant filter
- Auto-captions

### Instagram

**Aspect Ratio**: 1:1 (1080x1080) or 9:16 for stories
**Video Length**: 30-60 seconds recommended
**Cuts**: Every 30 seconds
**Effects**:
- @username tag (bottom-center)
- Dissolve transitions
- Story stickers
- Music visualization

## Cut Types

### Cut
- Instant switch between scenes
- Most common on TikTok
- Keeps energy high

### Fade
- Smooth fade out/in between scenes
- Good for YouTube
- Professional feel

### Dissolve
- Overlapping fade between scenes
- Good for Instagram
- Elegant transition

### Wipe
- Wipe effect from one scene to another
- Less common
- Dramatic effect

## Effect Types

### Transition
- Change between scenes
- Styles: cut, fade, dissolve, wipe

### Filter
- Color grading and visual effects
- Styles: vibrant, muted, cinematic, B&W

### Overlay
- Additional graphics or images
- Types: logo, watermark, sticker, story-sticker

### Text
- Text overlays on video
- Positions: top, bottom, center, top-left, bottom-right

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 300000ms (5 min)
- **Max Retries**: 2

## Dependencies

- FFmpeg for video editing
- Composed video from ComposerAgent

## Storage Structure

```
storage/videos/edited/
├── youtube/
│   └── edited-youtube-1704067200.mp4
├── tiktok/
│   └── edited-tiktok-1704067200.mp4
└── instagram/
    └── edited-instagram-1704067200.mp4
```

## FFmpeg Commands Used

```bash
# Apply cuts
ffmpeg -i input.mp4 -ss 0 -t 60 -c copy output.mp4

# Add text overlay
ffmpeg -i input.mp4 -vf \
  "drawtext=text='Subscribe!':x=w-tw-20:y=h-th-20:fontsize=24:fontcolor=white" \
  output.mp4

# Apply filter
ffmpeg -i input.mp4 -vf "eq=brightness=0.1:saturation=1.2" output.mp4

# Add transition (fade)
ffmpeg -i part1.mp4 -i part2.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=59" \
  output.mp4
```

## Logging

```
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Editing video for platform: youtube
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Generating cuts for video
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Generated 5 cuts for youtube
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Generating effects for video
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Generated 3 effects for youtube
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Editing video with 5 cuts and 3 effects
[2024-01-01T00:00:00.000Z] [Editor] [INFO] Edited video created: edited-youtube-1704067200.mp4
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('composedVideo')) {
    console.error('Invalid video file');
  }
}
```

## Best Practices

1. **Platform Awareness**: Tailor content to each platform's specs
2. **Pacing**: Match cut frequency to platform audience
3. **Text Readability**: Ensure overlays are readable
4. **Effect Balance**: Don't overuse effects
5. **Aspect Ratio**: Always match target platform ratio

## Custom Cuts and Effects

You can provide custom cuts and effects:

```typescript
const customCuts = [
  { startTime: 0, endTime: 30, type: 'cut' },
  { startTime: 30, endTime: 60, type: 'fade' },
  { startTime: 60, endTime: 90, type: 'cut' }
];

const customEffects = [
  {
    type: 'text',
    startTime: 0,
    duration: 5,
    params: { text: 'Welcome!', position: 'center' }
  }
];

const input = {
  composedVideo: 'video.mp4',
  targetPlatform: 'youtube',
  cuts: customCuts,
  effects: customEffects
};
```

## Development

```bash
# Run agent in development mode
npm run dev:agent:editor

# Run tests
npm run test:agent:editor

# Type check
npm run typecheck
```

## Next Steps

After editing, workflow continues to:

**QualityCriticAgent** - Rates video quality
