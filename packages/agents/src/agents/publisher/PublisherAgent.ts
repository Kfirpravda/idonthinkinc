import { BaseAgent } from '../base/BaseAgent';
import {
  UploadInput,
  UploadOutput,
  AgentCapabilities,
  VideoMetadata,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';

export class PublisherAgent extends BaseAgent<UploadInput, UploadOutput> {
  name = 'Publisher';
  version = '1.0.0';

  async validate(input: UploadInput): Promise<boolean> {
    return !!(
      input.video &&
      input.platform &&
      input.metadata &&
      input.metadata.title &&
      fs.existsSync(input.video)
    );
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 300000,
      maxRetries: 3,
    };
  }

  async execute(input: UploadInput): Promise<UploadOutput> {
    this.log(`Uploading video to ${input.platform}`);

    try {
      const platform = input.platform;
      const metadata = input.metadata;
      const videoFile = input.video;

      this.log(`Video: ${videoFile}`);
      this.log(`Title: ${metadata.title}`);
      this.log(`Privacy: ${metadata.privacy}`);

      const videoId = await this.uploadToPlatform(platform, videoFile, metadata);
      const url = await this.getVideoUrl(platform, videoId);

      const output: UploadOutput = {
        videoId,
        platform,
        url,
        status: 'uploaded',
      };

      if (metadata.scheduledFor) {
        output.status = 'scheduled';
        output.publishedAt = metadata.scheduledFor;
      }

      this.log(`Video uploaded successfully: ${url}`);

      return output;
    } catch (error) {
      this.log(`Upload failed: ${error}`, 'error');
      throw error;
    }
  }

  private async uploadToPlatform(
    platform: string,
    videoFile: string,
    metadata: VideoMetadata
  ): Promise<string> {
    this.log(`Uploading to ${platform}`);

    switch (platform) {
      case 'youtube':
        return await this.uploadToYouTube(videoFile, metadata);
      case 'tiktok':
        return await this.uploadToTikTok(videoFile, metadata);
      case 'instagram':
        return await this.uploadToInstagram(videoFile, metadata);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  private async uploadToYouTube(videoFile: string, metadata: VideoMetadata): Promise<string> {
    this.log('Uploading to YouTube');

    await this.simulateUpload(videoFile, 'youtube', 120000);

    const videoId = this.generateVideoId('yt');

    this.log(`YouTube upload complete: ${videoId}`);

    return videoId;
  }

  private async uploadToTikTok(videoFile: string, metadata: VideoMetadata): Promise<string> {
    this.log('Uploading to TikTok');

    await this.simulateUpload(videoFile, 'tiktok', 180000);

    const videoId = this.generateVideoId('tt');

    this.log(`TikTok upload complete: ${videoId}`);

    return videoId;
  }

  private async uploadToInstagram(videoFile: string, metadata: VideoMetadata): Promise<string> {
    this.log('Uploading to Instagram');

    await this.simulateUpload(videoFile, 'instagram', 150000);

    const videoId = this.generateVideoId('ig');

    this.log(`Instagram upload complete: ${videoId}`);

    return videoId;
  }

  private async getVideoUrl(platform: string, videoId: string): Promise<string> {
    const urls: Record<string, string> = {
      youtube: `https://youtube.com/watch?v=${videoId}`,
      tiktok: `https://tiktok.com/@user/video/${videoId}`,
      instagram: `https://instagram.com/p/${videoId}`,
    };

    return urls[platform] || '#';
  }

  private async simulateUpload(videoFile: string, platform: string, duration: number): Promise<void> {
    const fileStats = fs.statSync(videoFile);
    const fileSizeMB = (fileStats.size / 1024 / 1024).toFixed(2);

    this.log(`File size: ${fileSizeMB}MB`);
    this.log(`Estimated upload time: ${Math.floor(duration / 1000)}s`);

    await new Promise((resolve) => setTimeout(resolve, duration));

    this.log(`Upload to ${platform} completed`);
  }

  private generateVideoId(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}_${timestamp}_${random}`;
  }

  private generateId(): string {
    return `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
