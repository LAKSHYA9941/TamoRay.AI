import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// Request validation schema
const planRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  options: z.object({
    researchDepth: z.enum(['basic', 'detailed', 'comprehensive']).optional(),
    maxSources: z.number().min(1).max(10).optional(),
    includeWebSearch: z.boolean().optional(),
  }).optional(),
});

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validationResult = planRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { prompt, options } = validationResult.data;
    const includeWebSearch = options?.includeWebSearch !== false;

    // Create planning prompt
    const planningPrompt = `You are a creative planning assistant for thumbnail creation. 

User Request: ${prompt}

Please create a detailed but concise not more than 750 characters plan for this thumbnail concept. Include:
1. Main concept and theme
2. Visual elements and composition
3. Color palette suggestions
4. Text/typography recommendations
5. Style and mood
${includeWebSearch ? '6. Based on current design trends, suggest modern approaches' : ''}

IMPORTANT FORMATTING RULES:
- Use plain text only, NO markdown symbols (no **, ##, _, etc.)
- Use simple numbered lists (1., 2., 3.)
- Use simple bullet points with dashes (-)
- Keep formatting clean and readable
- Avoid special characters and symbols

Provide a structured, actionable plan with specific details.`;

    // Use streaming chat completions
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const chatStream = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an expert creative director specializing in thumbnail design. Provide detailed, actionable plans with specific recommendations.',
              },
              {
                role: 'user',
                content: planningPrompt,
              },
            ],
            stream: true,
            temperature: 0.7,
            max_tokens: 2000,
          });

          let fullResponse = '';

          for await (const chunk of chatStream) {
            const content = chunk.choices[0]?.delta?.content || '';
            
            if (content) {
              fullResponse += content;
              
              // Send incremental update
              const data = JSON.stringify({
                type: 'text',
                content: content,
              });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }

          // Send final response
          const finalData = JSON.stringify({
            type: 'complete',
            response: fullResponse,
            sources: [], // Web search would require additional API integration
          });
          controller.enqueue(new TextEncoder().encode(`data: ${finalData}\n\n`));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          controller.enqueue(new TextEncoder().encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Planning API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create plan', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}