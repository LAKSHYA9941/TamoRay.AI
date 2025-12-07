# OpenAI Agent SDK Setup

## Required Environment Variables

Add the following to your `.env` file:

```env
# OpenAI API Key (Required for planning feature)
OPENAI_API_KEY=your_openai_api_key_here
```

## Getting Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## Important Note About Web Search

The current implementation uses OpenAI's Chat Completions API with streaming for the planning feature. 

**Web Search Integration:**
- The basic planning feature works with GPT-4o-mini without external web search
- For actual web search capabilities, you would need to integrate:
  - OpenAI's Responses API (experimental, requires special access)
  - Or a third-party search API like Tavily, Serper, or Brave Search
  - Or build a custom web scraping solution

The UI is fully prepared for web search results - you just need to integrate a search provider in the API route.

## Testing the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard

3. Test the **Planning** feature:
   - Click the "Plan" tab
   - Enter a description like: "Plan a YouTube thumbnail for a cooking video"
   - The "Web Search" toggle is available but currently uses AI knowledge instead of live search
   - Click "Create Plan"
   - Watch the AI generate a detailed plan with streaming text

4. Test the **Generation** feature:
   - Click the "Generate" tab
   - Enter a description
   - Select a style
   - Click "Generate Thumbnail"
   - Note: This currently returns mock data. Integrate with DALL-E or your image service.

## Features

✅ **Planning with AI**
- OpenAI GPT-4o-mini integration
- Real-time streaming responses
- Detailed, structured plans
- Character counter and validation

✅ **Separate UIs**
- Planning and generation are completely separate
- No shared state between features
- Modular component architecture

✅ **Premium UI**
- shadcn/ui components
- Dark theme with blue (planning) and amber (generation) accents
- Responsive design
- Loading states and error handling

## Adding Web Search (Optional Enhancement)

To add real web search to the planning feature:

### Option 1: Tavily Search API (Recommended)
```bash
npm install tavily
```

Then update `/app/api/plan/route.ts` to call Tavily API before generating the plan.

### Option 2: Serper API
```bash
npm install google-search-results-nodejs
```

### Option 3: Brave Search API
Use the Brave Search API with fetch requests.

## Next Steps

### For Image Generation:
1. Integrate DALL-E API in `/app/api/generate/route.ts`:
   ```typescript
   const image = await openai.images.generate({
     model: "dall-e-3",
     prompt: prompt,
     size: "1792x1024",
     quality: "hd",
   });
   ```

2. Or use Stable Diffusion, Midjourney, or your custom service

The generation API is already set up with proper types and error handling - just replace the mock response with actual generation logic.

## Troubleshooting

**TypeScript Errors:**
- All TypeScript errors have been resolved
- Badge component now supports all variants (success, warning, info)
- OpenAI API uses stable Chat Completions endpoint

**Import Errors:**
- If you see `@/lib/utils` errors, the path aliases are configured in `tsconfig.json`
- Badge component uses relative imports as fallback

**API Errors:**
- Make sure `OPENAI_API_KEY` is set in `.env`
- Restart the dev server after adding environment variables
- Check OpenAI API usage limits and billing
