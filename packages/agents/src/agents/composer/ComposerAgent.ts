import { BaseAgent } from '../base/BaseAgent';
import {
  ComposingInput,
  ComposingOutput,
  ComposingMetadata,
  AgentCapabilities,
  VoiceOverOutput,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export class ComposerAgent extends BaseAgent<ComposingInput, ComposingOutput> {
  name = 'Composer';
  version = '1.0.0';

  async validate(input: ComposingInput): Promise<boolean> {
    return !!(
      input.voiceOver &&
      input.voiceOver.syncedVideo &&
      fs.existsSync(input.voiceOver.syncedVideo)
    );
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 180000,
      maxRetries: 2,
    };
  }

  async execute(input: ComposingInput): Promise<ComposingOutput> {
    this.log('Composing video with music');

    try {
      const musicStyle = input.musicStyle || 'background';
      const volume = input.volume || 0.5;

      this.log(`Music style: ${musicStyle}, Volume: ${volume}`);

      const musicFile = await this.generateMusic(musicStyle);
      const videoWithMusic = await this.addMusicToVideo(input, musicFile, volume);
      const metadata = this.createMetadata(input, musicFile, volume);

      this.log(`Video composed with music: ${videoWithMusic}`);

      return { videoWithMusic, musicFile, metadata };
    } catch (error) {
      this.log(`Composing failed: ${error}`, 'error');
      throw error;
    }
  }

  private async generateMusic(musicStyle: string): Promise<string> {
    this.log(`Generating music with style: ${musicStyle}`);

    const musicId = `music-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const filename = `${musicId}-${musicStyle}.mp3`;
    const filePath = path.join(process.cwd(), 'storage', 'audio', 'music', filename);

    await this.ensureDirectoryExists(path.dirname(filePath));

    await this.simulateMusicGeneration(filePath, musicStyle);

    this.log(`Music generated: ${filename}`);

    return filePath;
  }

  private async addMusicToVideo(
    input: ComposingInput,
    musicFile: string,
    volume: number
  ): Promise<string> {
    this.log(`Adding music to video with volume: ${volume}`);

    const inputVideo = input.voiceOver.syncedVideo;
    const filename = `composed-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), 'storage', 'videos', 'composed', filename);

    await this.ensureDirectoryExists(path.dirname(outputPath));

    await this.simulateComposingProcess(outputPath, inputVideo, musicFile, volume);

    this.log(`Composed video created: ${filename}`);

    return outputPath;
  }

  private async simulateMusicGeneration(filePath: string, musicStyle: string): Promise<void> {
    const duration = 300;
    const processingTime = 60000;

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const musicContent = Buffer.from(`MUSIC_CONTENT_STYLE_${musicStyle.toUpperCase()}`);
    fs.writeFileSync(filePath, musicContent);
  }

  private async simulateComposingProcess(
    outputPath: string,
    inputVideo: string,
    musicFile: string,
    volume: number
  ): Promise<void> {
    const videoDuration = 300;
    const processingTime = Math.min(videoDuration * 1.5, 180000);

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const composedContent = Buffer.from(
      `COMPOSED_VIDEO_VOLUME_${volume}_MUSIC_${musicFile}`
    );
    fs.writeFileSync(outputPath, composedContent);
  }

  private createMetadata(
    input: ComposingInput,
    musicFile: string,
    volume: number
  ): ComposingMetadata {
    const voiceDuration = input.voiceOver.metadata?.totalDuration || 300;
    const musicDuration = this.getMusicDuration(musicFile);

    return {
      musicDuration,
      totalDuration: voiceDuration,
      volume,
      fadePoints: this.calculateFadePoints(voiceDuration),
    };
  }

  private getMusicDuration(musicFile: string): number {
    try {
      const fileStats = fs.statSync(musicFile);
      return Math.floor(fileStats.size / 1000);
    } catch {
      return 300;
    }
  }

  private calculateFadePoints(duration: number): number[] {
    const fadePoints = [0, duration * 0.8];
    if (duration > 120) {
      fadePoints.push(duration * 0.4);
      fadePoints.push(duration * 0.6);
    }
    return fadePoints;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
