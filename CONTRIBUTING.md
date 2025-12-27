# Contributing to idonthinkinc

Thank you for your interest in contributing to the idonthinkinc multi-agent content creation system! This document provides guidelines and workflows for contributors.

## Table of Contents

- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Workflow](#workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Agent Development](#agent-development)

## Development Setup

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

5. Start development services:
```bash
npm run dev
```

## Project Structure

```
idonthinkinc/
├── apps/              # Frontend and backend applications
│   ├── dashboard/     # Next.js dashboard for human approvals
│   ├── api-server/    # Express API server
│   └── worker/        # Background job processor
├── packages/          # Shared libraries
│   ├── agents/        # Agent implementations
│   ├── shared-types/  # TypeScript type definitions
│   ├── workflow-engine/  # Orchestration logic
│   ├── storage/       # File system abstractions
│   └── config/        # Shared configuration
└── services/          # External service integrations
    ├── openai/        # OpenAI API wrapper
    ├── elevenlabs/    # ElevenLabs TTS wrapper
    ├── youtube/       # YouTube API wrapper
    └── ffmpeg/        # FFmpeg operations wrapper
```

## Workflow

### Branching Strategy

We use Git Flow:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features (e.g., `feature/agent-trend-researcher`)
- `fix/*` - Bug fixes (e.g., `fix/youtube-upload-error`)
- `hotfix/*` - Urgent production fixes

### Feature Development Workflow

1. Create a feature branch from `develop`:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. Make your changes and test locally.

3. Commit with clear messages:
```bash
git add .
git commit -m "feat: implement trend research agent"
```

4. Push to remote:
```bash
git push origin feature/your-feature-name
```

5. Create a Pull Request to `develop`.

### Commit Message Conventions

We use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:
```
feat(agent): add trend research agent

Implements the trend research agent that analyzes competitor
websites to identify trending topics.
```

## Coding Standards

### TypeScript

- Use TypeScript for all code
- Enable strict mode
- Use interfaces for type definitions
- Avoid `any` type when possible
- Use proper type annotations

### Code Style

- Use Prettier for formatting (automatic on commit)
- Follow ESLint rules
- Use meaningful variable and function names
- Keep functions focused and small (< 50 lines)
- Add JSDoc comments for public APIs

### Agent Interface

All agents must implement the `Agent` interface:

```typescript
export interface Agent<Input, Output> {
  name: string;
  version: string;
  execute(input: Input): Promise<Output>;
  validate(input: Input): Promise<boolean>;
  getCapabilities(): AgentCapabilities;
}
```

## Testing

### Test Structure

- Unit tests: `src/**/*.test.ts`
- Integration tests: `tests/integration/`
- E2E tests: `tests/e2e/`

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- TrendResearchAgent.test.ts
```

### Test Coverage

Maintain minimum 80% code coverage.

## Pull Request Process

### PR Checklist

Before submitting a PR, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] Commit messages follow conventions
- [ ] No merge conflicts with target branch

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How did you test this change?

## Checklist
- [ ] Tests pass
- [ ] Linting passes
- [ ] Documentation updated
```

### Review Process

1. Automated checks must pass (CI/CD)
2. At least one team member approval required
3. Address all review comments
4. Squash commits if requested
5. Maintainer merges to `develop`

## Agent Development

### Creating a New Agent

1. Use the Makefile:
```bash
make agent:create name=YourAgentName
```

2. Implement the agent in `packages/agents/src/agents/your-agent-name/`

3. Follow the agent interface

4. Add unit tests

5. Update documentation

### Agent Directory Structure

```
packages/agents/src/agents/your-agent/
├── index.ts              # Main agent implementation
├── types.ts              # Agent-specific types
├── utils.ts              # Helper functions
├── index.test.ts         # Unit tests
└── README.md             # Agent documentation
```

### Agent README Template

Each agent should have a README with:

```markdown
# Agent Name

## Purpose
Brief description of what this agent does

## Input
- Field 1: Description
- Field 2: Description

## Output
- Field 1: Description
- Field 2: Description

## Dependencies
- Service: API service used
- Library: Library used

## Usage
Example code

## Development
- Run: `npm run dev:agent:agent-name`
- Test: `npm run test:agent:agent-name`
- Mock: `npm run mock:agent:agent-name`
```

## Documentation

### Code Documentation

- Use JSDoc for public APIs
- Update README when adding features
- Document environment variables

### Architecture Documentation

Update architectural documentation when:
- Adding new agents
- Changing workflow
- Modifying data structures

## Getting Help

- Create an issue for bugs or feature requests
- Join team discussions in designated channels
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
