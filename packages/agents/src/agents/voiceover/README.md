# VoiceOverAgent

Synchronizes audio with video footage using FFmpeg.

## Purpose

The VoiceOver agent takes separately generated video footage and audio, then precisely syncs them together, creating a unified video with perfect audio-video alignment.

## Input

```typescript
interface VoiceOverInput {
  footage: Footage;                    // From FootageCreatorAgent
  voiceAudio: VoiceActingOutput;        // From VoiceActorAgent
  timing?: VoiceOverTiming[];           // Optional custom timing
}

interface VoiceOverTiming {
  sceneNumber: number;
  startTime: number;       // Start time in video (seconds)
  endTime: number;         // End time in video (seconds)
  audioSegment: string;    // Audio segment identifier
}
```

## Output

```typescript
interface VoiceOverOutput {
  syncedVideo: string;      // Path to synced video file
  metadata: VoiceOverMetadata;
}

interface VoiceOverMetadata {
  syncAccuracy: number;      // 0-100, sync precision
  totalDuration: number;      // Total video duration (seconds)
  audioSegments: number;      // Number of audio segments
}
```

## Example Usage

```typescript
import { VoiceOverAgent } from '@idonthinkinc/agents';

const agent = new VoiceOverAgent();

const input = {
  footage: {
    id: 'footage-123',
    scenes: [
      { sceneNumber: 1, duration: 30 },
      { sceneNumber: 2, duration: 45 }
    ],
    totalDuration: 75
  },
  voiceAudio: {
    audioFile: 'storage/audio/script-123.mp3',
    duration: 75
  }
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Synced video: ${output.syncedVideo}`);
  console.log(`Sync accuracy: ${output.metadata.syncAccuracy}%`);
}
```

## Synchronization Process

1. **Analyze Durations**
   - Calculate total video duration
   - Calculate total audio duration

2. **Generate Timing** (if not provided)
   - Divide audio into segments by scene
   - Calculate start/end times for each segment

3. **Sync with FFmpeg**
   - Overlay audio onto video
   - Apply timing adjustments
   - Ensure smooth transitions

4. **Verify Sync**
   - Calculate sync accuracy
   - Check for timing mismatches

## Timing Generation

If no custom timing is provided, the agent automatically generates timing:

```typescript
// Example: 3 scenes, 75 second video
Scene 1: 0s - 30s
Scene 2: 30s - 45s
Scene 3: 45s - 75s
```

## Sync Accuracy

Sync accuracy is calculated as:

```
accuracy = 100 - (|videoDuration - audioDuration| / videoDuration * 100)
```

- **95-100**: Excellent sync
- **85-94**: Good sync
- **75-84**: Acceptable sync
- **< 75**: Poor sync, manual adjustment needed

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 240000ms (4 min)
- **Max Retries**: 2

## Dependencies

- FFmpeg for video/audio processing
- Footage from FootageCreatorAgent
- Audio from VoiceActorAgent

## Storage Structure

```
storage/videos/
└── footage-123-voiceover-synced.mp4
```

## FFmpeg Commands Used

```bash
# Basic sync
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac output.mp4

# With timing adjustments
ffmpeg -i video.mp4 -i audio.mp3 -filter_complex \
  "[1:a]atempo=1.0[audio];[0:v][audio]concat=n=1:v=1:a=1" \
  output.mp4
```

## Logging

```
[2024-01-01T00:00:00.000Z] [VoiceOver] [INFO] Syncing voiceover for footage: footage-123
[2024-01-01T00:00:00.000Z] [VoiceOver] [INFO] Generating timing for voiceover
[2024-01-01T00:00:00.000Z] [VoiceOver] [INFO] Generated 3 timing segments
[2024-01-01T00:00:00.000Z] [VoiceOver] [INFO] Syncing audio with video using FFmpeg
[2024-01-01T00:00:00.000Z] [VoiceOver] [INFO] Synced video created: footage-123-voiceover-synced.mp4
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('footage')) {
    console.error('Invalid footage data');
  }
}
```

## Common Issues

### Audio Too Short
- Solution: Extend audio or shorten video
- Consider using background music

### Audio Too Long
- Solution: Trim audio or extend video
- Add additional scenes

### Out of Sync
- Solution: Provide custom timing
- Adjust scene durations

## Development

```bash
# Run agent in development mode
npm run dev:agent:voiceover

# Run tests
npm run test:agent:voiceover

# Type check
npm run typecheck
```

## Next Steps

After voiceover sync, workflow continues to:

**ComposerAgent** - Adds background music to video
