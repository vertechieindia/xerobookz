import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI | null = null;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async scoreLead(leadData: {
    name?: string;
    company?: string;
    email?: string;
    title?: string;
  }): Promise<number> {
    if (!this.openai) {
      // Fallback scoring
      let score = 0;
      if (leadData.company) score += 20;
      if (leadData.email) score += 15;
      if (leadData.title) score += 10;
      if (leadData.name) score += 5;
      return Math.min(score, 100);
    }

    try {
      const prompt = `Score this lead from 0-100 based on quality indicators:
Name: ${leadData.name || 'N/A'}
Company: ${leadData.company || 'N/A'}
Email: ${leadData.email || 'N/A'}
Title: ${leadData.title || 'N/A'}

Return only a number between 0-100.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a lead scoring expert. Return only a number between 0-100.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 10,
      });

      const score = parseInt(completion.choices[0]?.message?.content || '50', 10);
      return Math.max(0, Math.min(100, score));
    } catch {
      // Fallback
      return 50;
    }
  }
}
