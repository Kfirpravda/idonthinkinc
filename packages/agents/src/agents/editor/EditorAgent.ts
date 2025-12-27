import { BaseAgent } from '../base/BaseAgent';
import {
  EditingInput,
  EditingOutput,
  EditingMetadata,
  AgentCapabilities,
  VideoCut,
  VideoEffect,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export class EditorAgent extends BaseAgent<EditingInput, EditingOutput> {
  name = 'Editor';
  version = '1.0.0';

  async validate(input: EditingInput): Promise<boolean> {
    return !!(
      input.composedVideo &&
      input.targetPlatform &&
      fs.existsSync(input.composedVideo)
    );
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 300000,
      maxRetries: 2,
    };
  }

  async execute(input: EditingInput): Promise<EditingOutput> {
    this.log(`Editing video for platform: ${input.targetPlatform}`);

    try {
      const cuts = input.cuts || await this.generateCuts(input);
      const effects = input.effects || await this.generateEffects(input);

      this.log(`Applying ${cuts.length} cuts and ${effects.length} effects`);

      const editedVideo = await this.editVideo(input, cuts, effects);
      const metadata = this.createMetadata(input, cuts, effects);

      this.log(`Video edited: ${editedVideo}`);

      return { editedVideo, metadata };
    } catch (error) {
      this.log(`Editing failed: ${error}`, 'error');
      throw error;
    }
  }

  private async generateCuts(input: EditingInput): Promise<VideoCut[]> {
    this.log('Generating cuts for video');

    const cuts: VideoCut[] = [];
    const platform = input.targetPlatform;

    let segmentDuration: number;
    switch (platform) {
      case 'tiktok':
        segmentDuration = 15;
        break;
      case 'instagram':
        segmentDuration = 30;
        break;
      case 'youtube':
      default:
        segmentDuration = 60;
    }

    let currentTime = 0;
    let cutCount = 0;
    const maxCuts = Math.floor(300 / segmentDuration);

    while (currentTime < 300 && cutCount < maxCuts) {
      const endTime = Math.min(currentTime + segmentDuration, 300);

      if (currentTime < endTime) {
        cuts.push({
          startTime: currentTime,
          endTime,
          type: cutCount % 2 === 0 ? 'cut' : 'fade',
        });
      }

      currentTime = endTime;
      cutCount++;
    }

    this.log(`Generated ${cuts.length} cuts for ${platform}`);

    return cuts;
  }

  private async generateEffects(input: EditingInput): Promise<VideoEffect[]> {
    this.log('Generating effects for video');

    const effects: VideoEffect[] = [];
    const platform = input.targetPlatform;

    const platformEffects = this.getPlatformEffects(platform);

    for (const effect of platformEffects) {
      effects.push({
        ...effect,
        startTime: Math.random() * 250,
        duration: effect.duration || 5,
      });
    }

    this.log(`Generated ${effects.length} effects for ${platform}`);

    return effects;
  }

  private getPlatformEffects(platform: string): VideoEffect[] {
    const effectTemplates: Record<string, Partial<VideoEffect>[]> = {
      youtube: [
        { type: 'text', params: { text: 'Subscribe!', position: 'bottom-right' } },
        { type: 'transition', params: { style: 'fade' } },
        { type: 'overlay', params: { type: 'logo' } },
      ],
      tiktok: [
        { type: 'text', params: { text: '#fyp #trending', position: 'bottom' } },
        { type: 'transition', params: { style: 'cut' } },
        { type: 'filter', params: { style: 'vibrant' } },
      ],
      instagram: [
        { type: 'text', params: { text: '@username', position: 'bottom-center' } },
        { type: 'transition', params: { style: 'dissolve' } },
        { type: 'overlay', params: { type: 'story-sticker' } },
      ],
    };

    return (effectTemplates[platform] || effectTemplates['youtube']) as VideoEffect[];
  }

  private async editVideo(
    input: EditingInput,
    cuts: VideoCut[],
    effects: VideoEffect[]
  ): Promise<string> {
    this.log(`Editing video with ${cuts.length} cuts and ${effects.length} effects`);

    const inputVideo = input.composedVideo;
    const platform = input.targetPlatform;
    const filename = `edited-${platform}-${Date.now()}.mp4`;
    const outputPath = path.join(process.cwd(), 'storage', 'videos', 'edited', platform, filename);

    await this.ensureDirectoryExists(path.dirname(outputPath));

    await this.simulateEditingProcess(outputPath, inputVideo, cuts, effects, platform);

    this.log(`Edited video created: ${filename}`);

    return outputPath;
  }

  private async simulateEditingProcess(
    outputPath: string,
    inputVideo: string,
    cuts: VideoCut[],
    effects: VideoEffect[],
    platform: string
  ): Promise<void> {
    const processingTime = 300000;

    await new Promise((resolve) => setTimeout(resolve, processingTime));

    const editedContent = Buffer.from(
      `EDITED_VIDEO_PLATFORM_${platform.toUpperCase()}_CUTS_${cuts.length}_EFFECTS_${effects.length}`
    );
    fs.writeFileSync(outputPath, editedContent);
  }

  private createMetadata(
    input: EditingInput,
    cuts: VideoCut[],
    effects: VideoEffect[]
  ): EditingMetadata {
    const originalDuration = 300;
    const editedDuration = this.calculateEditedDuration(cuts);

    return {
      originalDuration,
      editedDuration,
      cutsCount: cuts.length,
      effectsCount: effects.length,
      platform: input.targetPlatform,
    };
  }

  private calculateEditedDuration(cuts: VideoCut[]): number {
    if (cuts.length === 0) return 300;

    const totalDuration = cuts.reduce((sum, cut) => sum + (cut.endTime - cut.startTime), 0);
    return totalDuration;
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}
