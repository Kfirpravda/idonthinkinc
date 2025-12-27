# VoiceActorAgent

Generates high-quality voiceover audio using text-to-speech.

## Purpose

The Voice Actor agent converts script dialogue into natural-sounding audio using TTS (text-to-speech) technology with various voice styles and emotions.

## Input

```typescript
interface VoiceActingInput {
  script: Script;                                    // Script from ScripterAgent
  voiceType?: 'male' | 'female' | 'neutral';        // Voice gender/type
  emotion?: 'happy' | 'sad' | 'excited' | 'calm' | 'serious';
  speed?: number;                                      // Playback speed (0.5 - 2.0)
}
```

## Output

```typescript
interface VoiceActingOutput {
  audioFile: string;        // Path to generated audio file
  duration: number;         // Audio duration in seconds
  format: string;          // Audio format (mp3, wav)
  sampleRate: number;      // Sample rate (Hz)
  metadata: VoiceMetadata;
}

interface VoiceMetadata {
  voiceId: string;
  model: string;
  emotion: string;
  speed: number;
  generatedAt: Date;
}
```

## Example Usage

```typescript
import { VoiceActorAgent } from '@idonthinkinc/agents';

const agent = new VoiceActorAgent();

const input = {
  script: {
    id: 'script-123',
    content: 'Welcome to our video about AI...',
    estimatedDuration: 300
  },
  voiceType: 'neutral',
  emotion: 'enthusiastic',
  speed: 1.0
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Voice generated: ${output.audioFile}`);
  console.log(`Duration: ${output.duration}s`);
}
```

## Voice Types

- **male** - Male voice
- **female** - Female voice
- **neutral** - Gender-neutral voice (default)

## Emotions

- **happy** - Cheerful and upbeat
- **sad** - Somber and reflective
- **excited** - High energy and enthusiastic (default)
- **calm** - Relaxed and peaceful
- **serious** - Professional and authoritative

## Speed Settings

- **0.5** - Very slow
- **0.75** - Slow
- **1.0** - Normal (default)
- **1.25** - Fast
- **1.5** - Very fast
- **2.0** - Extremely fast

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 180000ms (3 min)
- **Max Retries**: 3

## Dependencies

- ElevenLabs API for TTS
- Script data from ScripterAgent

## Audio Quality

- **Format**: MP3
- **Sample Rate**: 44.1 kHz (CD quality)
- **Bitrate**: 192 kbps (high quality)

## Storage Structure

```
storage/audio/
├── script-123-voice-neutral-enthusiastic.mp3
└── ...
```

## Processing Time

Estimated processing time: `scriptDuration * 0.4` seconds (max 2 min)

Example:
- 5 min script = ~2 min processing
- 3 min script = ~1.2 min processing

## Logging

```
[2024-01-01T00:00:00.000Z] [VoiceActor] [INFO] Generating voice acting for script: script-123
[2024-01-01T00:00:00.000Z] [VoiceActor] [INFO] Voice settings - Type: neutral, Emotion: enthusiastic, Speed: 1
[2024-01-01T00:00:00.000Z] [VoiceActor] [INFO] Voice acting generated: storage/audio/script-123-voice-neutral-enthusiastic.mp3 (300s)
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
npm run dev:agent:voice-actor

# Run tests
npm run test:agent:voice-actor

# Type check
npm run typecheck
```

## Next Steps

After voice generation, workflow continues to:

**VoiceOverAgent** - Syncs audio with video footage
