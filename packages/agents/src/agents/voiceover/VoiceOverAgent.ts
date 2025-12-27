import { BaseAgent } from '../base/BaseAgent';
import {
  VoiceOverInput,
  VoiceOverOutput,
  VoiceOverMetadata,
  AgentCapabilities,
  Footage,
  VoiceActingOutput,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export class VoiceOverAgent extends BaseAgent<VoiceOverInput, VoiceOverOutput> {
  name = 'VoiceOver';
  version = '1.0.0';

  async validate(input: VoiceOverInput): Promise<boolean> {
    return !!(
      input.footage &&
      input.voiceAudio &&
      input.footage.scenes.length > 0 &&
      input.voiceAudio.audioFile
    );
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 240000,
      maxRetries: 2,
    };
  }

  async execute(input: VoiceOverInput): Promise<VoiceOverOutput> {
    this.log(`Syncing voiceover for footage: ${input.footage.id}`);

    try {
      const timing = input.timing || await this.generateTiming(input);
      const syncedVideo = await this.syncAudioWithVideo(input, timing);
      const metadata = this.createMetadata(input, timing);

      this.log(`Voiceover synced: ${syncedVideo}`);

      return { syncedVideo, metadata };
    } catch (error) {
      this.log(`Voiceover sync failed: ${error}`, 'error');
      throw error;
    }
  }

  private async generateTiming(input: VoiceOverInput): Promise<any[]> {
    this.log('Generating timing for voiceover');

    const timing = [];
    let currentTime = 0;
    const sceneCount = input.footage.scenes.length;

    for (let i = 0; i < sceneCount; i++) {
      const scene = input.footage.scenes[i];
      const sceneDuration = scene.duration || 30;

      timing.push({
        sceneNumber: i + 1,
        startTime: currentTime,
        endTime: currentTime + sceneDuration,
        audioSegment: `segment-${i + 1}`,
      });

      currentTime += sceneDuration;
    }

    this.log(`Generated ${timing.length} timing segments`);

    return timing;
  }

  private async syncAudioWithVideo(
    input: VoiceOverInput,
    timing: any[]
  ): Promise<string> {
    this.log('Syncing audio with video using FFmpeg');

    const footageId = input.footage.id;
    const filename = `${footageId}-voiceover-synced.mp4`;
    const outputPath = path.join(process.cwd(), 'storage', 'videos', filename);

    await this.ensureDirectoryExists(path.dirname(outputPath));

    await this.simulateSyncProcess(outputPath, input);

    this.log(`Synced video created: ${filename}`);

    return outputPath;
  }

  private async simulateSyncProcess(
    outputPath: string,
    input: VoiceOverInput
  ): Promise<void> {
    const totalDuration = input.footage.totalDuration || 300;
    const processingTime = Math.min(totalDuration * 2, 300000);

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const dummyContent = Buffer.from('SYNCED_VIDEO_CONTENT');
    fs.writeFileSync(outputPath, dummyContent);
  }

  private createMetadata(input: VoiceOverInput, timing: any[]): VoiceOverMetadata {
    const totalDuration = input.footage.totalDuration || 300;
    const audioDuration = input.voiceAudio.duration || 300;
    const syncAccuracy = this.calculateSyncAccuracy(totalDuration, audioDuration);

    return {
      syncAccuracy,
      totalDuration,
      audioSegments: timing.length,
    };
  }

  private calculateSyncAccuracy(videoDuration: number, audioDuration: number): number {
    const diff = Math.abs(videoDuration - audioDuration);
    const accuracy = Math.max(0, 100 - (diff / videoDuration) * 100);
    return Math.round(accuracy * 100) / 100;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private generateId(): string {
    return `voiceover-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
