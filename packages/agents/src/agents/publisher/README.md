# PublisherAgent

Uploads videos to multiple platforms.

## Purpose

The Publisher agent uploads final edited videos to target platforms including YouTube, TikTok, and Instagram, handling authentication, metadata, and scheduling.

## Input

```typescript
interface UploadInput {
  video: string;               // From QualityCriticAgent
  platform: 'youtube' | 'tiktok' | 'instagram';
  metadata: VideoMetadata;
}

interface VideoMetadata {
  title: string;
  description: string;
  tags: string[];
  thumbnail?: string;
  privacy: 'public' | 'unlisted' | 'private';
  scheduledFor?: Date;      // Optional schedule date
}
```

## Output

```typescript
interface UploadOutput {
  videoId: string;          // Platform-specific video ID
  platform: string;
  url: string;              // Public video URL
  status: 'uploaded' | 'scheduled';
  publishedAt?: Date;        // Published date if scheduled
}
```

## Example Usage

```typescript
import { PublisherAgent } from '@idonthinkinc/agents';

const agent = new PublisherAgent();

const input = {
  video: 'storage/videos/edited/youtube/video-123.mp4',
  platform: 'youtube',
  metadata: {
    title: 'The Ultimate Guide to AI in Content Creation',
    description: 'Learn how AI is transforming content creation...',
    tags: ['AI', 'content creation', 'automation', 'technology'],
    thumbnail: 'storage/thumbnails/video-123.jpg',
    privacy: 'public',
    scheduledFor: new Date('2024-01-15T10:00:00Z')
  }
};

const isValid = await agent.validate(input);
if (isValid) {
  const output = await agent.execute(input);

  console.log(`Uploaded: ${output.url}`);
  console.log(`Video ID: ${output.videoId}`);
  console.log(`Status: ${output.status}`);
}
```

## Supported Platforms

### YouTube

**Video Requirements**:
- Format: MP4, MOV, AVI
- Resolution: 360p - 4K
- Duration: 15 min max (standard), 12 hrs max (verified)
- File size: 256 GB max

**Metadata**:
- Title: 100 chars max
- Description: 5000 chars max
- Tags: 500 chars max total
- Thumbnail: 1280x720 recommended

**Privacy Options**:
- **public**: Visible to everyone
- **unlisted**: Only accessible with link
- **private**: Only you can see

**Authentication**: OAuth 2.0

### TikTok

**Video Requirements**:
- Format: MP4, WebM, MOV
- Resolution: 540p - 1080p
- Duration: 15s - 3min
- Aspect Ratio: 9:16 (vertical)

**Metadata**:
- Title: 100-150 chars
- Description: 150-2200 chars
- Hashtags: Up to 5

**Privacy Options**:
- **public**: Visible on For You feed
- **private**: Only you can see

**Authentication**: OAuth 2.0 + API Key

### Instagram

**Video Requirements**:
- Format: MP4, MOV
- Resolution: 1080x1080 (square), 1080x1920 (portrait)
- Duration: 15s - 60s (Reels)
- File size: 4 GB max

**Metadata**:
- Caption: 2200 chars max
- Hashtags: Up to 30

**Privacy Options**:
- **public**: Visible to followers and public
- **private**: Only you can see

**Authentication**: OAuth 2.0 + API Key

## Capabilities

- **Can Handle Async**: Yes
- **Requires Human Approval**: No
- **Estimated Execution Time**: 300000ms (5 min)
- **Max Retries**: 3

## Dependencies

- YouTube Data API v3
- TikTok API (via unofficial wrapper)
- Instagram Graph API
- Edited video from QualityCriticAgent

## Upload Process

### 1. Authentication
- Authenticate with platform OAuth
- Verify permissions
- Generate access token

### 2. Upload Video
- Upload video file
- Track upload progress
- Handle retries on failure

### 3. Add Metadata
- Set title, description, tags
- Upload thumbnail (if provided)
- Configure privacy settings

### 4. Schedule or Publish
- Schedule for future date (if specified)
- Publish immediately (if not scheduled)

### 5. Return Result
- Platform-specific video ID
- Public URL
- Publication status

## Upload Progress

Estimated upload times based on file size:

| File Size | YouTube | TikTok | Instagram |
|-----------|----------|----------|-----------|
| 50 MB     | 2-3 min  | 1-2 min  | 2-3 min   |
| 100 MB    | 4-6 min  | 3-4 min  | 4-6 min   |
| 250 MB    | 10-15 min | 8-10 min | 10-15 min  |
| 500 MB    | 20-30 min | N/A      | N/A        |

## Error Handling

The agent automatically retries up to 3 times on failures:

### Common Errors

- **Authentication Failed**: Invalid or expired token
  - Solution: Refresh OAuth token

- **Upload Timeout**: Network issues
  - Solution: Retry with exponential backoff

- **Invalid Format**: Unsupported video format
  - Solution: Convert to MP4

- **Size Limit**: File too large
  - Solution: Compress video

## Video URLs

### YouTube
```
https://youtube.com/watch?v={videoId}
https://youtu.be/{videoId}
```

### TikTok
```
https://tiktok.com/@username/video/{videoId}
```

### Instagram
```
https://instagram.com/p/{videoId}
```

## Logging

```
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Uploading video to youtube
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Video: storage/videos/edited/youtube/video-123.mp4
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Title: The Ultimate Guide to AI in Content Creation
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Privacy: public
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Uploading to YouTube
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] File size: 250.35MB
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Estimated upload time: 180s
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Upload to YouTube completed
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] YouTube upload complete: yt_1704067200_x9k2m
[2024-01-01T00:00:00.000Z] [Publisher] [INFO] Video uploaded successfully: https://youtube.com/watch?v=yt_1704067200_x9k2m
```

## Batch Uploads

Upload to multiple platforms in parallel:

```typescript
import { PublisherAgent } from '@idonthinkinc/agents';

const agent = new PublisherAgent();

const videoFile = 'storage/videos/edited/video-123.mp4';
const metadata = {
  title: 'AI in Content Creation',
  description: '...',
  tags: ['AI', 'content'],
  privacy: 'public'
};

// Upload to multiple platforms
const [youtube, tiktok, instagram] = await Promise.all([
  agent.execute({ video: videoFile, platform: 'youtube', metadata }),
  agent.execute({ video: videoFile, platform: 'tiktok', metadata }),
  agent.execute({ video: videoFile, platform: 'instagram', metadata })
]);

console.log(`YouTube: ${youtube.url}`);
console.log(`TikTok: ${tiktok.url}`);
console.log(`Instagram: ${instagram.url}`);
```

## Scheduled Uploads

Schedule videos for future publication:

```typescript
const input = {
  video: 'video.mp4',
  platform: 'youtube',
  metadata: {
    title: 'Scheduled Video',
    description: '...',
    tags: ['tags'],
    privacy: 'public',
    scheduledFor: new Date('2024-01-15T10:00:00Z')  // Schedule for Jan 15
  }
};

const output = await agent.execute(input);
// output.status === 'scheduled'
// output.publishedAt === scheduledFor
```

## Development

```bash
# Run agent in development mode
npm run dev:agent:publisher

# Run tests
npm run test:agent:publisher

# Type check
npm run typecheck
```

## Best Practices

1. **Test Uploads**: Start with 'private' or 'unlisted' for testing
2. **Thumbnail Quality**: Use high-quality custom thumbnails
3. **SEO Optimization**: Research and include relevant tags
4. **Description**: Include links and calls-to-action
5. **Schedule Wisely**: Post during peak engagement hours
6. **Monitor Performance**: Track analytics after upload

## Platform-Specific Best Practices

### YouTube
- Use custom thumbnails (1280x720)
- First 48 characters of title are most important
- Include keywords in description
- Add chapters/timestamps in description

### TikTok
- Use trending hashtags
- Hook viewers in first 3 seconds
- Use vertical format (9:16)
- Post during peak hours (7-9 PM local time)

### Instagram
- Use square (1:1) or portrait (9:16) format
- Include call-to-action in caption
- Use relevant hashtags (3-5 recommended)
- Tag relevant accounts

## Complete Workflow

After successful upload, the content creation workflow is **complete**! 🎉

You can now:
- Monitor performance analytics
- Schedule future content
- Iterate based on feedback
- Start new content creation cycle
