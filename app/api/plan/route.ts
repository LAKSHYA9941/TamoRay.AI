// Force Node.js runtime (required for Prisma & streaming)
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Agent, run, webSearchTool } from "@openai/agents";

// Request validation schema
const planRequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  options: z.object({
    researchDepth: z.enum(["basic", "detailed", "comprehensive"]).optional(),
    maxSources: z.number().min(1).max(10).optional(),
    includeWebSearch: z.boolean().optional(),
  }).optional(),
});

// Initialize Agent
const agent = new Agent({
  name: "thumbnail-planner",
  instructions:
    "You are an expert creative director specializing in thumbnail design. Provide detailed, actionable plans with specific recommendations.",
  model: "gpt-4o-mini",
  tools: [webSearchTool()],
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = planRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.errors },
        { status: 400 }
      );
    }

    const { prompt, options } = parsed.data;
    const includeWebSearch = options?.includeWebSearch !== false;

    // Build the planning prompt
    let planningPrompt = `You are a creative planning assistant for thumbnail creation.
User Request: ${prompt}

Please create a detailed but concise (max 750 characters) plan for this thumbnail concept.`;

    if (includeWebSearch) {
      planningPrompt += `
IMPORTANT: You have access to a web search tool. You MUST use the web search tool to find real, current design trends and successful examples related to "${prompt}" BEFORE generating the plan. Cite these sources in your thinking.`;
    }

    planningPrompt += `
Include:
1. Main concept and theme
2. Visual elements and composition
3. Color palette suggestions
4. Text/typography recommendations
5. Style and mood
${includeWebSearch ? "6. Specific insights from your web research on current trends" : ""}
7. add a title for the thumbnail too

IMPORTANT FORMATTING RULES:
- Use plain text only, NO markdown (** ## _ etc)
- Use simple numbered lists (1., 2., 3.)
- Use bullet points with dashes (-)
- Avoid special characters
- Clear and readable`;

    // Create streaming SSE response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        let finalText = "";
        const collectedSources: any[] = [];

        try {
          // Debug: send connection confirmation
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'debug', event: 'Connection started' })}\n\n`));

          // The run(...) call returns an async-iterable stream for older/newer agent libs.
          // Cast to unknown then to AsyncIterable<any> so TypeScript doesn't try to enforce
          // incorrect internal event union types from the installed library.
          const iterator = (await run(agent, planningPrompt, {
            stream: true,
          })) as unknown as AsyncIterable<any>;

          // Iterate the stream events
          for await (const rawEvent of iterator) {
            const event = rawEvent as any; // explicit any to avoid union type mismatches

          // Debug: Send the event structure to frontend once (or occasionally)
          // controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'debug', event: JSON.stringify(event).slice(0, 200) })}\n\n`));

            // Partial text chunk from the agent
            // Check for various delta locations just in case
            const delta = event?.delta || event?.data?.delta || (event?.type === "response.output_text.delta" ? event.delta : null);

            if (typeof delta === "string") {
              finalText += delta;

              const chunk = {
                type: "text",
                content: delta,
              };

              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            } else if (event?.choices?.[0]?.delta?.content) {
              // OpenAI Chat Completion style fallback
              const content = event.choices[0].delta.content;
              finalText += content;
              const chunk = {
                type: "text",
                content: content,
              };
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`));
            }

            // Capture any step/tool outputs as sources (optional)
            if (event?.type === "step.completed") {
              if (event.step?.output) {
                collectedSources.push(event.step.output);

                // Also stream this update to frontend
                const toolChunk = {
                  type: "tool_result",
                  result: event.step.output
                };
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(toolChunk)}\n\n`));
              }
            }
          }

          // When iteration completes, send final payload
          const finalPayload = {
            type: "complete",
            response: finalText,
            sources: collectedSources,
          };

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(finalPayload)}\n\n`));
          controller.close();
        } catch (err) {
          console.error("Streaming error:", err);
          const errorPayload = {
            type: "error",
            error: err instanceof Error ? err.message : "Unknown error",
          };
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorPayload)}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Planning API error:", err);
    return NextResponse.json(
      {
        error: "Failed to create plan",
        message: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
