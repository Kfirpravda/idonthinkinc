# ComposerAgent

Adds background music and composes final video.

## Purpose

The Composer agent adds background music to videos, applying appropriate styles, volume levels, and fade points to create a polished final product.

## Input

```typescript
interface ComposingInput {
  voiceOver: VoiceOverOutput;            // From VoiceOverAgent
  musicStyle?: 'upbeat' | 'calm' | 'dramatic' | 'background';
  volume?: number;                        // Music volume (0.0 - 1.0)
}
```

## Output

```typescript
interface ComposingOutput {
  videoWithMusic: string;     // Path to composed video
  musicFile: string;          // Path to generated music
  metadata: ComposingMetadata;
}

interface ComposingMetadata {
  musicDuration: number;       // Music duration (seconds)
  totalDuration: number;       // Total video duration (seconds)
  volume: number;             // Music volume (0.0 - 1.0)
  fadePoints: number[];       // Fade-in/out timestamps (seconds)
}
```

## Example Usage

```typescript
import { ComposerAgent } from '@idonthinkinc/agents';

const agent = new ComposerAgent();

const input = {
  voiceOver: {
    syncedVideo: 'storage/videos/footage-123-voiceover.mp4',
    metadata: {
      syncAccuracy: 98.5,
      totalDuration: 300,
      audioSegments: 3
    }
  },
  musicStyle: 'upbeat',
  volume: 0.5
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Composed video: ${output.videoWithMusic}`);
  console.log(`Music: ${output.musicFile}`);
  console.log(`Volume: ${output.metadata.volume}`);
}
```

## Music Styles

### Upbeat
- Energetic and motivating
- Good for tutorials, how-to content
- Fast tempo, major key

### Calm
- Relaxed and peaceful
- Good for educational content
- Slow tempo, ambient sounds

### Dramatic
- Intense and emotional
- Good for storytelling, reviews
- Orchestral, crescendo builds

### Background (Default)
- Subtle and unobtrusive
- Works for most content types
- Neutral mood, minimal melody

## Volume Settings

- **0.0** - Music muted
- **0.3** - Very subtle (background only)
- **0.5** - Balanced (default)
- **0.7** - Prominent
- **1.0** - Music dominates (not recommended)

## Fade Points

Fade points are automatically calculated based on video duration:

**Short videos (< 120s)**:
- Fade in: 0s
- Fade out: 80% duration

**Medium videos (120-300s)**:
- Fade in: 0s
- Fade points: 40%, 60%
- Fade out: 80% duration

**Long videos (> 300s)**:
- Fade in: 0s
- Multiple fade points at 30% intervals
- Fade out: 95% duration

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 180000ms (3 min)
- **Max Retries**: 2

## Dependencies

- FFmpeg for audio mixing
- Music generation API (planned: AI music generation)
- Synced video from VoiceOverAgent

## Storage Structure

```
storage/audio/music/
└── music-1704067200-x9k2m.mp3

storage/videos/composed/
└── composed-1704067200.mp4
```

## Processing Flow

1. **Generate Music**
   - Create music matching style
   - Match video duration
   - Apply fade effects

2. **Mix with Video**
   - Overlay music onto video
   - Set volume level
   - Ensure smooth transitions

3. **Verify Output**
   - Check audio levels
   - Validate composition

## FFmpeg Commands Used

```bash
# Add music with volume
ffmpeg -i video.mp4 -i music.mp3 -filter_complex \
  "[1:a]volume=0.5[audio];[0:a][audio]amix=inputs=2:duration=first" \
  output.mp4

# With fade in/out
ffmpeg -i video.mp4 -i music.mp3 -filter_complex \
  "[1:a]afade=t=in:st=0:d=2,afade=t=out:st=120:d=4,volume=0.5[audio];[0:a][audio]amix=inputs=2" \
  output.mp4
```

## Logging

```
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Composing video with music
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Music style: upbeat, Volume: 0.5
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Generating music with style: upbeat
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Music generated: music-1704067200-upbeat.mp3
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Adding music to video with volume: 0.5
[2024-01-01T00:00:00.000Z] [Composer] [INFO] Composed video created: composed-1704067200.mp4
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('voiceOver')) {
    console.error('Invalid voiceover data');
  }
}
```

## Best Practices

1. **Volume Balance**: Keep music between 0.3-0.6 for most content
2. **Style Matching**: Match music style to content tone
3. **Fade Points**: Use fades to avoid abrupt music starts/stops
4. **Copyright**: Ensure music is properly licensed

## Development

```bash
# Run agent in development mode
npm run dev:agent:composer

# Run tests
npm run test:agent:composer

# Type check
npm run typecheck
```

## Next Steps

After composition, workflow continues to:

**EditorAgent** - Applies cuts and effects for target platform
