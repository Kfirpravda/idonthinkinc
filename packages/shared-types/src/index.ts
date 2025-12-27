// Core Agent Interface
export interface Agent<Input, Output> {
  name: string;
  version: string;
  execute(input: Input): Promise<Output>;
  validate(input: Input): Promise<boolean>;
  getCapabilities(): AgentCapabilities;
}

export interface AgentCapabilities {
  canHandleAsync: boolean;
  requiresHumanApproval: boolean;
  estimatedExecutionTime: number;
  maxRetries: number;
}

// Workflow State Management
export interface WorkflowState {
  id: string;
  currentStage: WorkflowStage;
  status: WorkflowStatus;
  data: Record<string, any>;
  errors: WorkflowError[];
  createdAt: Date;
  updatedAt: Date;
}

export type WorkflowStage =
  | 'trend-research'
  | 'scripting'
  | 'footage-creation'
  | 'voice-acting'
  | 'voiceover'
  | 'composing'
  | 'editing'
  | 'quality-rating'
  | 'upload'
  | 'complete';

export type WorkflowStatus =
  | 'pending'
  | 'in-progress'
  | 'waiting-approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface WorkflowError {
  stage: WorkflowStage;
  agent: string;
  message: string;
  timestamp: Date;
  retryCount: number;
}

// Human Approval Interface
export interface ApprovalRequest {
  id: string;
  workflowId: string;
  stage: WorkflowStage;
  agent: string;
  content: ApprovalContent;
  status: ApprovalStatus;
  requester: string;
  reviewer?: string;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalContent {
  type: 'text' | 'video' | 'audio' | 'image' | 'script';
  data: any;
  metadata?: Record<string, any>;
}

// Trend Research Agent Types
export interface TrendResearchInput {
  competitorUrl: string;
  timeframe: string;
  depth?: 'basic' | 'comprehensive' | 'deep';
}

export interface Trend {
  id: string;
  topic: string;
  confidence: number;
  relevanceScore: number;
  sourceUrl?: string;
  keywords: string[];
  estimatedAudience: number;
}

export interface TrendResearchOutput {
  trends: Trend[];
  metadata: ResearchMetadata;
}

export interface ResearchMetadata {
  competitorUrl: string;
  analyzedAt: Date;
  timeframe: string;
  totalContentAnalyzed: number;
  topKeywords: string[];
}

// Scripting Agent Types
export interface ScriptingInput {
  trend: Trend;
  targetDuration: number;
  tone?: 'serious' | 'casual' | 'enthusiastic' | 'professional';
  format?: 'youtube' | 'tiktok' | 'instagram' | 'twitter';
}

export interface Script {
  id: string;
  title: string;
  content: string;
  estimatedDuration: number;
  scenes: Scene[];
  tone: string;
  format: string;
  createdAt: Date;
}

export interface Scene {
  id: string;
  number: number;
  description: string;
  dialogue: string;
  visualNotes: string;
  duration: number;
}

export interface ScriptingOutput {
  script: Script;
  metadata: ScriptMetadata;
}

export interface ScriptMetadata {
  generatedFrom: string;
  model: string;
  wordCount: number;
  estimatedReadTime: number;
}

// Footage Creation Agent Types
export interface FootageCreationInput {
  script: Script;
  footageType?: 'screen-recording' | 'ai-generated' | 'stock' | 'animated';
  quality?: '720p' | '1080p' | '4k';
}

export interface Footage {
  id: string;
  scriptId: string;
  scenes: FootageScene[];
  totalDuration: number;
  format: string;
  resolution: string;
  filePath?: string;
  createdAt: Date;
}

export interface FootageScene {
  sceneNumber: number;
  duration: number;
  filePath?: string;
  type: string;
  description: string;
}

export interface FootageCreationOutput {
  footage: Footage;
  status: 'pending' | 'in-progress' | 'completed' | 'requires-human-review';
}

// Voice Acting Agent Types
export interface VoiceActingInput {
  script: Script;
  voiceType?: 'male' | 'female' | 'neutral';
  emotion?: 'happy' | 'sad' | 'excited' | 'calm' | 'serious';
  speed?: number;
}

export interface VoiceActingOutput {
  audioFile: string;
  duration: number;
  format: string;
  sampleRate: number;
  metadata: VoiceMetadata;
}

export interface VoiceMetadata {
  voiceId: string;
  model: string;
  emotion: string;
  speed: number;
  generatedAt: Date;
}

// VoiceOver Agent Types
export interface VoiceOverInput {
  footage: Footage;
  voiceAudio: VoiceActingOutput;
  timing: VoiceOverTiming[];
}

export interface VoiceOverTiming {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  audioSegment: string;
}

export interface VoiceOverOutput {
  syncedVideo: string;
  metadata: VoiceOverMetadata;
}

export interface VoiceOverMetadata {
  syncAccuracy: number;
  totalDuration: number;
  audioSegments: number;
}

// Composing Agent Types
export interface ComposingInput {
  voiceOver: VoiceOverOutput;
  musicStyle?: 'upbeat' | 'calm' | 'dramatic' | 'background';
  volume?: number;
}

export interface ComposingOutput {
  videoWithMusic: string;
  musicFile: string;
  metadata: ComposingMetadata;
}

export interface ComposingMetadata {
  musicDuration: number;
  totalDuration: number;
  volume: number;
  fadePoints: number[];
}

// Editing Agent Types
export interface EditingInput {
  composedVideo: string;
  targetPlatform: 'youtube' | 'tiktok' | 'instagram';
  cuts?: VideoCut[];
  effects?: VideoEffect[];
}

export interface VideoCut {
  startTime: number;
  endTime: number;
  type: 'cut' | 'fade' | 'dissolve' | 'wipe';
}

export interface VideoEffect {
  type: 'transition' | 'filter' | 'overlay' | 'text';
  startTime: number;
  duration: number;
  params: Record<string, any>;
}

export interface EditingOutput {
  editedVideo: string;
  metadata: EditingMetadata;
}

export interface EditingMetadata {
  originalDuration: number;
  editedDuration: number;
  cutsCount: number;
  effectsCount: number;
  platform: string;
}

// Quality Rating Agent Types
export interface QualityRatingInput {
  editedVideo: string;
  script: Script;
  criteria?: QualityCriteria;
}

export interface QualityCriteria {
  audioQuality: number;
  videoQuality: number;
  contentQuality: number;
  technicalQuality: number;
}

export interface QualityRatingOutput {
  overallScore: number;
  ratings: QualityRatings;
  feedback: string[];
  issues: QualityIssue[];
  recommendation: 'approve' | 'needs-improvement' | 'reject';
}

export interface QualityRatings {
  audioQuality: number;
  videoQuality: number;
  contentQuality: number;
  technicalQuality: number;
}

export interface QualityIssue {
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp?: number;
}

// Upload Agent Types
export interface UploadInput {
  video: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  metadata: VideoMetadata;
}

export interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  privacy: 'public' | 'unlisted' | 'private';
  scheduledFor?: Date;
}

export interface UploadOutput {
  videoId: string;
  platform: string;
  url: string;
  status: 'uploaded' | 'scheduled';
  publishedAt?: Date;
}

// Storage Types
export interface StorageConfig {
  basePath: string;
  videosPath: string;
  audioPath: string;
  assetsPath: string;
}

export interface StoredFile {
  id: string;
  path: string;
  type: 'video' | 'audio' | 'image' | 'script' | 'metadata';
  size: number;
  createdAt: Date;
  workflowId: string;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: Date;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Dashboard Types
export interface DashboardWorkflow {
  id: string;
  status: WorkflowStatus;
  currentStage: WorkflowStage;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

export interface DashboardApproval {
  id: string;
  workflowId: string;
  stage: WorkflowStage;
  contentPreview: string;
  status: ApprovalStatus;
  createdAt: Date;
}
