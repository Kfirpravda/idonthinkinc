# idonthinkinc

Multi-agent AI content creation system with automated video production workflow.

## Overview

A Node.js-based system using multiple AI agents to create content based on competitor website analysis. The system automates the entire video production pipeline from trend research to final upload.

## Architecture

```
Manager
├── Research Agent (Trend Spotter)
├── Scripting Agent (Screenwriter)
├── Footage Creation Agent (Actor)
├── Voice Actor Agent
├── VoiceOver Agent
├── Composing Agent (Composer)
├── Editing Agent (Editor)
├── Quality Rating Agent (Critic)
└── Upload Agent (Publisher)

Human in the loop:
├── After trend research
├── After gameplay creation
└── After review
```

## Tech Stack

- **Backend**: Node.js, TypeScript
- **Frontend**: Next.js 16, React 19
- **Orchestration**: LangGraph.js
- **Video Editing**: FFmpeg, Editly
- **Storage**: Local filesystem
- **Deployment**: Local machine

## Project Structure

```
idonthinkinc/
├── apps/
│   ├── dashboard/          # Next.js web UI for human approvals
│   ├── api-server/         # Express backend API
│   └── worker/             # Background job processor
├── packages/
│   ├── agents/             # Agent implementations
│   ├── shared-types/       # Shared TypeScript types
│   ├── workflow-engine/    # Orchestration logic
│   ├── storage/            # File system/storage abstractions
│   └── config/             # Shared configurations
└── services/               # External service wrappers
    ├── openai/
    ├── elevenlabs/
    ├── youtube/
    └── ffmpeg/
```

## Getting Started

### Prerequisites

- Node.js 18+
- FFmpeg installed and available in PATH
- Git
- GitHub CLI (optional, for PRs)

### Initial Setup

1. Clone the repository:
```bash
git clone https://github.com/Kfirpravda/idonthinkinc.git
cd idonthinkinc
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` with your API keys and configuration.

5. Verify agents are working:
```bash
node verify-agents.js
```

This will verify all 9 agents are properly implemented!

6. Start development services:
```bash
npm run dev
```

### Testing Agents

**Quick Verification** (No build required):
```bash
node verify-agents.js
```

**Full Testing** (After installing TypeScript):
```bash
npm install -D typescript ts-node @types/node
npm run build
node packages/agents/test-runner.js
```

See [TESTING_STATUS.md](TESTING_STATUS.md) for complete testing guide.

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your API keys
```

### Development

```bash
# Start all services
npm run dev

# Start dashboard
npm run dev:dashboard

# Start API server
npm run dev:api

# Start worker
npm run dev:worker
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `fix/*` - Bug fixes

### Agent Development

Each agent follows a standardized structure:

```typescript
export interface Agent<Input, Output> {
  name: string;
  execute(input: Input): Promise<Output>;
  validate(input: Input): Promise<boolean>;
}
```

### Collaboration

- Use GitHub Issues for tracking
- PRs require code review
- Weekly sync meetings for coordination

## License

MIT
