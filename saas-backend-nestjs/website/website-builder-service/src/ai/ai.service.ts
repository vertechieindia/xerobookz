import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@xerobookz/shared-database';
import { GenerateContentDto, AIGenerationType } from './dto/generate-content.dto';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async generateContent(tenantId: string, dto: GenerateContentDto) {
    if (!this.openai) {
      // Fallback to template-based generation if OpenAI not configured
      return this.generateFromTemplate(dto);
    }

    try {
      let result: any;

      switch (dto.type) {
        case AIGenerationType.LAYOUT:
          result = await this.generateLayout(dto);
          break;
        case AIGenerationType.CONTENT:
          result = await this.generateTextContent(dto);
          break;
        case AIGenerationType.SEO:
          result = await this.generateSEO(dto);
          break;
        default:
          result = await this.generateTextContent(dto);
      }

      // Save generation history
      await this.prisma.aIGeneration.create({
        data: {
          tenantId,
          websiteId: dto.websiteId,
          type: dto.type,
          prompt: dto.prompt,
          result,
          model: 'gpt-4',
        },
      });

      return result;
    } catch (error) {
      // Fallback to template-based generation
      return this.generateFromTemplate(dto);
    }
  }

  private async generateLayout(dto: GenerateContentDto) {
    const prompt = `Generate a website layout structure in JSON format for: ${dto.prompt}. 
    Include sections like hero, features, testimonials, CTA. Return only valid JSON.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a website design expert. Generate clean, modern website layouts in JSON format.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  private async generateTextContent(dto: GenerateContentDto) {
    const prompt = `Write professional website content for: ${dto.prompt}. 
    Include headings, subheadings, and body text. Return as JSON with structure: {heading, subheading, body}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional copywriter. Write engaging, SEO-friendly website content.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  private async generateSEO(dto: GenerateContentDto) {
    const prompt = `Generate SEO metadata for: ${dto.prompt}. 
    Return JSON with: {title, description, keywords}`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an SEO expert. Generate optimized meta titles, descriptions, and keywords.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content);
  }

  private generateFromTemplate(dto: GenerateContentDto): any {
    // Template-based fallback
    const templates: Record<string, any> = {
      layout: {
        sections: [
          {
            type: 'hero',
            title: 'Welcome to Our Business',
            subtitle: 'We provide exceptional services',
            cta: { text: 'Get Started', link: '/contact' },
          },
          {
            type: 'features',
            title: 'Our Features',
            items: [
              { title: 'Feature 1', description: 'Description 1' },
              { title: 'Feature 2', description: 'Description 2' },
            ],
          },
        ],
      },
      content: {
        heading: 'Professional Content',
        subheading: 'Engaging and informative',
        body: 'This is professional website content tailored to your needs.',
      },
      seo: {
        title: 'Professional Website | XeroBookz',
        description: 'Create your professional website with XeroBookz',
        keywords: 'website, business, professional',
      },
    };

    return templates[dto.type] || templates.content;
  }

  async suggestLayout(industry: string, businessType: string) {
    if (!this.openai) {
      return this.getDefaultLayout(industry);
    }

    try {
      const prompt = `Suggest a website layout structure for a ${businessType} in the ${industry} industry. 
      Return JSON with recommended sections and their order.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a website design consultant. Suggest optimal layouts based on industry and business type.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch {
      return this.getDefaultLayout(industry);
    }
  }

  private getDefaultLayout(industry: string): any {
    return {
      sections: [
        { type: 'hero', order: 1 },
        { type: 'features', order: 2 },
        { type: 'testimonials', order: 3 },
        { type: 'cta', order: 4 },
      ],
    };
  }
}
