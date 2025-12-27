import { BaseAgent } from '../base/BaseAgent';
import {
  VoiceActingInput,
  VoiceActingOutput,
  VoiceMetadata,
  AgentCapabilities,
  Script,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export class VoiceActorAgent extends BaseAgent<VoiceActingInput, VoiceActingOutput> {
  name = 'VoiceActor';
  version = '1.0.0';

  async validate(input: VoiceActingInput): Promise<boolean> {
    return !!(input.script && input.script.id && input.script.content);
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 180000,
      maxRetries: 3,
    };
  }

  async execute(input: VoiceActingInput): Promise<VoiceActingOutput> {
    this.log(`Generating voice acting for script: ${input.script.id}`);

    try {
      const voiceType = input.voiceType || 'neutral';
      const emotion = input.emotion || 'enthusiastic';
      const speed = input.speed || 1.0;

      this.log(`Voice settings - Type: ${voiceType}, Emotion: ${emotion}, Speed: ${speed}`);

      const audioFile = await this.generateVoice(input);
      const duration = await this.getAudioDuration(audioFile);
      const metadata = this.createMetadata(input);

      this.log(`Voice acting generated: ${audioFile} (${duration}s)`);

      return {
        audioFile,
        duration,
        format: 'mp3',
        sampleRate: 44100,
        metadata,
      };
    } catch (error) {
      this.log(`Voice acting failed: ${error}`, 'error');
      throw error;
    }
  }

  private async generateVoice(input: VoiceActingInput): Promise<string> {
    const voiceType = input.voiceType || 'neutral';
    const emotion = input.emotion || 'enthusiastic';

    this.log(`Generating voice with type: ${voiceType}, emotion: ${emotion}`);

    const scriptId = input.script.id;
    const filename = `${scriptId}-voice-${voiceType}-${emotion}.mp3`;
    const filePath = path.join(process.cwd(), 'storage', 'audio', filename);

    await this.ensureDirectoryExists(path.dirname(filePath));

    await this.simulateVoiceGeneration(filePath, input);

    this.log(`Voice file generated: ${filename}`);

    return filePath;
  }

  private async simulateVoiceGeneration(
    filePath: string,
    input: VoiceActingInput
  ): Promise<void> {
    const estimatedDuration = input.script.estimatedDuration || 300;
    const processingTime = Math.min(estimatedDuration * 10, 120000);

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const dummyContent = Buffer.from('DUMMY_AUDIO_CONTENT');
    fs.writeFileSync(filePath, dummyContent);
  }

  private async getAudioDuration(audioFile: string): Promise<number> {
    this.log(`Calculating duration for: ${audioFile}`);

    const fileStats = fs.statSync(audioFile);
    const estimatedDuration = Math.floor(fileStats.size / 1000);

    return Math.max(estimatedDuration, 60);
  }

  private createMetadata(input: VoiceActingInput): VoiceMetadata {
    const voiceType = input.voiceType || 'neutral';
    const emotion = input.emotion || 'enthusiastic';
    const speed = input.speed || 1.0;

    return {
      voiceId: `${voiceType}-${emotion}`,
      model: 'elevenlabs-turbo-v2',
      emotion,
      speed,
      generatedAt: new Date(),
    };
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateId(): string {
    return `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
