import { BaseAgent } from '../base/BaseAgent';
import {
  ScriptingInput,
  ScriptingOutput,
  Script,
  Scene,
  ScriptMetadata,
  AgentCapabilities,
  Trend,
} from '@idonthinkinc/shared-types';

export class ScripterAgent extends BaseAgent<ScriptingInput, ScriptingOutput> {
  name = 'Scripter';
  version = '1.0.0';

  async validate(input: ScriptingInput): Promise<boolean> {
    return !!(input.trend && input.trend.topic && input.targetDuration > 0);
  }

  getCapabilities(): AgentCapabilities {
    return {
      canHandleAsync: true,
      requiresHumanApproval: false,
      estimatedExecutionTime: 120000,
      maxRetries: 3,
    };
  }

  async execute(input: ScriptingInput): Promise<ScriptingOutput> {
    this.log(`Generating script for trend: ${input.trend.topic}`);

    try {
      const script = await this.generateScript(input);
      const metadata = this.createMetadata(script, input);

      this.log(`Script generated: ${script.title} (${script.scenes.length} scenes)`);

      return { script, metadata };
    } catch (error) {
      this.log(`Script generation failed: ${error}`, 'error');
      throw error;
    }
  }

  private async generateScript(input: ScriptingInput): Promise<Script> {
    const tone = input.tone || 'enthusiastic';
    const format = input.format || 'youtube';

    this.log(`Generating script with tone: ${tone}, format: ${format}`);

    const scriptId = this.generateId();
    const title = this.generateTitle(input.trend.topic);
    const scenes = await this.generateScenes(input);

    const script: Script = {
      id: scriptId,
      title,
      content: this.compileScenesText(scenes),
      estimatedDuration: scenes.reduce((sum, scene) => sum + scene.duration, 0),
      scenes,
      tone,
      format,
      createdAt: new Date(),
    };

    return script;
  }

  private async generateScenes(input: ScriptingInput): Promise<Scene[]> {
    const sceneCount = Math.ceil(input.targetDuration / 30);
    const scenes: Scene[] = [];

    const sceneTemplates = [
      {
        description: 'Opening hook with engaging visual',
        dialogue: `Welcome! Today we're diving into ${input.trend.topic}. This is something that's changing the game in incredible ways.`,
        visualNotes: 'Dynamic text overlay, quick cuts',
        duration: 15,
      },
      {
        description: 'Introduction to the topic',
        dialogue: `Here's what makes ${input.trend.topic} so special. It's not just another trend - it's a fundamental shift in how we approach content creation.`,
        visualNotes: 'Screen recording or stock footage',
        duration: 30,
      },
      {
        description: 'Deep dive with examples',
        dialogue: `Let me show you exactly how ${input.trend.topic} works in practice. The key insights here are game-changing.`,
        visualNotes: 'Step-by-step demonstration',
        duration: 45,
      },
      {
        description: 'Benefits and applications',
        dialogue: `The applications are endless. ${input.trend.keywords.slice(0, 3).join(', ')} - these are just the beginning of what's possible.`,
        visualNotes: 'Infographic or animated diagram',
        duration: 30,
      },
      {
        description: 'Real-world example',
        dialogue: `Here's a real example of ${input.trend.topic} in action. Watch how this transforms the entire workflow.`,
        visualNotes: 'Case study or demo video',
        duration: 40,
      },
      {
        description: 'Common mistakes to avoid',
        dialogue: `Now, here's what most people get wrong with ${input.trend.topic}. Avoid these pitfalls to maximize your results.`,
        visualNotes: 'Red X overlays, warning signs',
        duration: 25,
      },
      {
        description: 'Tips for success',
        dialogue: `Pro tip: Start with ${input.trend.keywords[0]} and build from there. Small wins lead to massive results.`,
        visualNotes: 'Checklist or bullet points',
        duration: 20,
      },
      {
        description: 'Advanced techniques',
        dialogue: `Ready for advanced strategies? Here's how experts leverage ${input.trend.topic} to stay ahead of the curve.`,
        visualNotes: 'Advanced interface or complex workflow',
        duration: 35,
      },
      {
        description: 'Call to action',
        dialogue: `That's ${input.trend.topic} in a nutshell. Drop a comment below with your thoughts, and don't forget to subscribe for more content like this!`,
        visualNotes: 'Subscribe button animation',
        duration: 15,
      },
    ];

    for (let i = 0; i < Math.min(sceneCount, sceneTemplates.length); i++) {
      const template = sceneTemplates[i];
      scenes.push({
        id: `scene-${i + 1}`,
        number: i + 1,
        description: template.description,
        dialogue: template.dialogue,
        visualNotes: template.visualNotes,
        duration: template.duration,
      });
    }

    return scenes;
  }

  private compileScenesText(scenes: Scene[]): string {
    return scenes.map((scene) => `[Scene ${scene.number}] ${scene.dialogue}`).join('\n\n');
  }

  private generateTitle(topic: string): string {
    const templates = [
      `The Ultimate Guide to ${topic}`,
      `How ${topic} Is Changing Everything`,
      `${topic} Explained: What You Need to Know`,
      `Mastering ${topic} in 2024`,
      `Why ${topic} Matters Right Now`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  private createMetadata(script: Script, input: ScriptingInput): ScriptMetadata {
    const wordCount = script.content.split(/\s+/).length;
    const wordsPerMinute = 150;
    const estimatedReadTime = Math.ceil(wordCount / wordsPerMinute);

    return {
      generatedFrom: input.trend.id,
      model: 'openai-gpt-4',
      wordCount,
      estimatedReadTime,
    };
  }

  private generateId(): string {
    return `script-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
