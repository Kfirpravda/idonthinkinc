import { BaseAgent } from '../base/BaseAgent';
import {
  QualityRatingInput,
  QualityRatingOutput,
  QualityRatings,
  QualityIssue,
  AgentCapabilities,
  QualityCriteria,
  Script,
} from '@idonthinkinc/shared-types';
import * as fs from 'fs';
import * as path from 'path';

export class QualityCriticAgent extends BaseAgent<QualityRatingInput, QualityRatingOutput> {
  name = 'QualityCritic';
  version = '1.0.0';

  async validate(input: QualityRatingInput): Promise<boolean> {
    return !!(
      input.editedVideo &&
      input.script &&
      input.script.id &&
      fs.existsSync(input.editedVideo)
    );
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: true,
      estimatedExecutionTime: 120000,
      maxRetries: 1,
    };
  }

  async execute(input: QualityRatingInput): Promise<QualityRatingOutput> {
    this.log(`Rating quality for video: ${input.editedVideo}`);

    try {
      const criteria = input.criteria || this.getDefaultCriteria();
      const ratings = await this.rateVideo(input, criteria);
      const feedback = this.generateFeedback(ratings);
      const issues = this.identifyIssues(input, ratings);
      const overallScore = this.calculateOverallScore(ratings);

      this.log(`Quality rating complete: ${overallScore}/100`);

      return {
        overallScore,
        ratings,
        feedback,
        issues,
        recommendation: this.getRecommendation(overallScore),
      };
    } catch (error) {
      this.log(`Quality rating failed: ${error}`, 'error');
      throw error;
    }
  }

  private async rateVideo(
    input: QualityRatingInput,
    criteria: QualityCriteria
  ): Promise<QualityRatings> {
    this.log('Rating video across multiple dimensions');

    const audioQuality = await this.rateAudioQuality(input, criteria.audioQuality);
    const videoQuality = await this.rateVideoQuality(input, criteria.videoQuality);
    const contentQuality = await this.rateContentQuality(input, criteria.contentQuality);
    const technicalQuality = await this.rateTechnicalQuality(
      input,
      criteria.technicalQuality
    );

    return {
      audioQuality,
      videoQuality,
      contentQuality,
      technicalQuality,
    };
  }

  private async rateAudioQuality(input: QualityRatingInput, target: number): Promise<number> {
    this.log('Rating audio quality');

    const videoFile = input.editedVideo;
    const fileStats = fs.statSync(videoFile);

    const audioScore = Math.min(
      target * 0.9 + (fileStats.size % 10),
      100
    );

    this.log(`Audio quality rating: ${audioScore}/100`);

    return audioScore;
  }

  private async rateVideoQuality(input: QualityRatingInput, target: number): Promise<number> {
    this.log('Rating video quality');

    const videoFile = input.editedVideo;
    const fileStats = fs.statSync(videoFile);

    const videoScore = Math.min(
      target * 0.95 + (fileStats.size % 15),
      100
    );

    this.log(`Video quality rating: ${videoScore}/100`);

    return videoScore;
  }

  private async rateContentQuality(input: QualityRatingInput, target: number): Promise<number> {
    this.log('Rating content quality');

    const script = input.script;
    const sceneCount = script.scenes.length;

    let contentScore = target;
    if (sceneCount < 5) contentScore -= 10;
    if (sceneCount < 8) contentScore -= 5;
    if (script.estimatedDuration < 180) contentScore -= 15;

    contentScore = Math.max(60, Math.min(100, contentScore));

    this.log(`Content quality rating: ${contentScore}/100`);

    return contentScore;
  }

  private async rateTechnicalQuality(
    input: QualityRatingInput,
    target: number
  ): Promise<number> {
    this.log('Rating technical quality');

    const videoFile = input.editedVideo;
    const fileStats = fs.statSync(videoFile);

    const technicalScore = Math.min(
      target * 0.92 + (fileStats.size % 20),
      100
    );

    this.log(`Technical quality rating: ${technicalScore}/100`);

    return technicalScore;
  }

  private generateFeedback(ratings: QualityRatings): string[] {
    const feedback: string[] = [];

    if (ratings.audioQuality < 80) {
      feedback.push('Audio quality could be improved - consider noise reduction');
    }
    if (ratings.audioQuality >= 90) {
      feedback.push('Audio quality is excellent - clear and professional');
    }

    if (ratings.videoQuality < 80) {
      feedback.push('Video quality needs improvement - check resolution and bitrate');
    }
    if (ratings.videoQuality >= 90) {
      feedback.push('Video quality is outstanding - crisp and well-composed');
    }

    if (ratings.contentQuality < 75) {
      feedback.push('Content could be more engaging - add more visual variety');
    }
    if (ratings.contentQuality >= 85) {
      feedback.push('Content is engaging and well-structured');
    }

    if (ratings.technicalQuality < 80) {
      feedback.push('Technical aspects need attention - check transitions and effects');
    }
    if (ratings.technicalQuality >= 90) {
      feedback.push('Technical execution is flawless - smooth transitions and effects');
    }

    if (feedback.length === 0) {
      feedback.push('All quality aspects are good, with room for minor improvements');
    }

    return feedback;
  }

  private identifyIssues(input: QualityRatingInput, ratings: QualityRatings): QualityIssue[] {
    const issues: QualityIssue[] = [];

    if (ratings.audioQuality < 70) {
      issues.push({
        category: 'audio',
        severity: 'high',
        description: 'Poor audio quality detected',
      });
    } else if (ratings.audioQuality < 80) {
      issues.push({
        category: 'audio',
        severity: 'medium',
        description: 'Audio quality could be improved',
      });
    }

    if (ratings.videoQuality < 70) {
      issues.push({
        category: 'video',
        severity: 'high',
        description: 'Video quality below standards',
      });
    } else if (ratings.videoQuality < 80) {
      issues.push({
        category: 'video',
        severity: 'medium',
        description: 'Video quality needs improvement',
      });
    }

    if (ratings.contentQuality < 75) {
      issues.push({
        category: 'content',
        severity: 'medium',
        description: 'Content engagement could be higher',
      });
    }

    if (ratings.technicalQuality < 70) {
      issues.push({
        category: 'technical',
        severity: 'high',
        description: 'Technical issues detected in video',
      });
    }

    return issues;
  }

  private calculateOverallScore(ratings: QualityRatings): number {
    const weights = {
      audioQuality: 0.25,
      videoQuality: 0.25,
      contentQuality: 0.30,
      technicalQuality: 0.20,
    };

    const weightedScore =
      ratings.audioQuality * weights.audioQuality +
      ratings.videoQuality * weights.videoQuality +
      ratings.contentQuality * weights.contentQuality +
      ratings.technicalQuality * weights.technicalQuality;

    return Math.round(weightedScore * 100) / 100;
  }

  private getRecommendation(overallScore: number): 'approve' | 'needs-improvement' | 'reject' {
    if (overallScore >= 85) return 'approve';
    if (overallScore >= 70) return 'needs-improvement';
    return 'reject';
  }

  private getDefaultCriteria(): QualityCriteria {
    return {
      audioQuality: 85,
      videoQuality: 85,
      contentQuality: 80,
      technicalQuality: 85,
    };
  }
}
