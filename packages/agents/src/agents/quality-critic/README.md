# QualityCriticAgent

Rates video quality across multiple dimensions.

## Purpose

The Quality Critic agent evaluates videos based on audio quality, video quality, content engagement, and technical execution, providing an overall quality score and actionable feedback.

## Input

```typescript
interface QualityRatingInput {
  editedVideo: string;              // From EditorAgent
  script: Script;                   // Original script for context
  criteria?: QualityCriteria;         // Optional custom criteria
}

interface QualityCriteria {
  audioQuality: number;      // 0-100, target audio quality
  videoQuality: number;      // 0-100, target video quality
  contentQuality: number;    // 0-100, target content quality
  technicalQuality: number;   // 0-100, target technical quality
}
```

## Output

```typescript
interface QualityRatingOutput {
  overallScore: number;      // 0-100, overall quality score
  ratings: QualityRatings;
  feedback: string[];       // Feedback messages
  issues: QualityIssue[];
  recommendation: 'approve' | 'needs-improvement' | 'reject';
}

interface QualityRatings {
  audioQuality: number;
  videoQuality: number;
  contentQuality: number;
  technicalQuality: number;
}

interface QualityIssue {
  category: 'audio' | 'video' | 'content' | 'technical';
  severity: 'low' | 'medium' | 'high';
  description: string;
  timestamp?: number;        // Optional timestamp in video
}
```

## Example Usage

```typescript
import { QualityCriticAgent } from '@idonthinkinc/agents';

const agent = new QualityCriticAgent();

const input = {
  editedVideo: 'storage/videos/edited/youtube/video-123.mp4',
  script: {
    id: 'script-123',
    scenes: [
      { id: 'scene-1', duration: 30 },
      { id: 'scene-2', duration: 45 }
    ],
    estimatedDuration: 300
  },
  criteria: {
    audioQuality: 85,
    videoQuality: 85,
    contentQuality: 80,
    technicalQuality: 85
  }
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Overall Score: ${output.overallScore}/100`);
  console.log(`Recommendation: ${output.recommendation}`);

  output.feedback.forEach(msg => {
    console.log(`Feedback: ${msg}`);
  });

  output.issues.forEach(issue => {
    console.log(`Issue: ${issue.category} - ${issue.description} (${issue.severity})`);
  });
}
```

## Quality Dimensions

### Audio Quality (25% weight)

Evaluates:
- Audio clarity and fidelity
- Background noise levels
- Volume consistency
- Voice intelligibility

**Rating Scale**:
- 90-100: Excellent, professional quality
- 80-89: Good, minor improvements needed
- 70-79: Acceptable, moderate improvements needed
- < 70: Poor, significant improvements needed

### Video Quality (25% weight)

Evaluates:
- Resolution and clarity
- Color grading and exposure
- Frame rate and motion smoothness
- Composition and framing

**Rating Scale**:
- 90-100: Stunning, cinema-quality
- 80-89: Good, well-produced
- 70-79: Acceptable, some issues
- < 70: Poor, needs work

### Content Quality (30% weight)

Evaluates:
- Script engagement and flow
- Visual variety and interest
- Relevance to target audience
- Informational value

**Rating Scale**:
- 85-100: Highly engaging, excellent flow
- 75-84: Good content, minor improvements
- 60-74: Average, needs more engagement
- < 60: Poor, content needs major overhaul

### Technical Quality (20% weight)

Evaluates:
- Transition quality
- Effect implementation
- Audio-video synchronization
- Overall production polish

**Rating Scale**:
- 90-100: Flawless execution
- 80-89: Good, minor technical issues
- 70-79: Acceptable, some rough edges
- < 70: Poor, significant technical issues

## Overall Score Calculation

```
overallScore =
  (audioQuality * 0.25) +
  (videoQuality * 0.25) +
  (contentQuality * 0.30) +
  (technicalQuality * 0.20)
```

## Recommendations

### Approve (85+ points)
- Ready for upload
- Minor improvements optional
- Proceed to PublisherAgent

### Needs Improvement (70-84 points)
- Good foundation
- Address identified issues
- Re-evaluate after changes

### Reject (< 70 points)
- Significant problems
- Major rework required
- Do not upload

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: Yes (after rating)
- **Estimated Execution Time**: 120000ms (2 min)
- **Max Retries**: 1

## Dependencies

- FFmpeg for video analysis
- Edited video from EditorAgent
- Original script for context

## Feedback Examples

### Positive Feedback
- "Audio quality is excellent - clear and professional"
- "Video quality is outstanding - crisp and well-composed"
- "Content is engaging and well-structured"
- "Technical execution is flawless - smooth transitions and effects"

### Improvement Feedback
- "Audio quality could be improved - consider noise reduction"
- "Video quality needs improvement - check resolution and bitrate"
- "Content could be more engaging - add more visual variety"
- "Technical aspects need attention - check transitions and effects"

## Issue Severity

### High
- Requires immediate attention
- Blocks publication
- Must be fixed before upload

### Medium
- Should be addressed
- Impacts viewer experience
- Fix recommended

### Low
- Minor issue
- Nice to fix but not critical
- Can defer to future iteration

## Default Criteria

If no custom criteria provided, uses these defaults:

```typescript
{
  audioQuality: 85,
  videoQuality: 85,
  contentQuality: 80,
  technicalQuality: 85
}
```

## Logging

```
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating quality for video: storage/videos/edited/youtube/video-123.mp4
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating video across multiple dimensions
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating audio quality
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Audio quality rating: 87/100
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating video quality
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Video quality rating: 89/100
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating content quality
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Content quality rating: 82/100
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Rating technical quality
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Technical quality rating: 85/100
[2024-01-01T00:00:00.000Z] [QualityCritic] [INFO] Quality rating complete: 85.75/100
```

## Error Handling

```typescript
try {
  const output = await agent.execute(input);
} catch (error) {
  if (error.message.includes('editedVideo')) {
    console.error('Invalid video file');
  }
}
```

## Human Approval Workflow

After quality rating:

1. Review overall score and recommendations
2. Check detailed ratings for each dimension
3. Review feedback and issues
4. Make decision:

### Approve
- Video meets quality standards
- Proceed to upload

### Request Changes
- Identify specific issues to fix
- Restart workflow from appropriate agent

### Adjust Criteria
- Modify target criteria
- Re-rate video

## Development

```bash
# Run agent in development mode
npm run dev:agent:quality-critic

# Run tests
npm run test:agent:quality-critic

# Type check
npm run typecheck
```

## Next Steps

After quality approval, workflow continues to:

**PublisherAgent** - Uploads video to target platforms
