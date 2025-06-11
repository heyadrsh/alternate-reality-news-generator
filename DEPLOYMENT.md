# Deployment Guide for Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/heyadrsh/alternate-reality-news-generator)

## Manual Deployment Steps

### 1. Environment Setup

Copy the environment example file:
```bash
cp env.example .env.local
```

Add your API key to `.env.local`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Vercel CLI Deployment

Install Vercel CLI:
```bash
npm install -g vercel
```

Deploy:
```bash
vercel --prod
```

### 3. Environment Variables in Vercel

Set your environment variables in the Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add:
   - `GEMINI_API_KEY` = your Google Gemini API key (used for both text and image generation)

### 4. Domain Configuration

If you have a custom domain, update the `CNAME` file:
```
your-custom-domain.com
```

## API Keys Setup

### Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your environment variables

**Note**: The application now uses:
- **Text Generation**: Google Gemini 2.0 Flash Lite model for improved performance and cost efficiency
- **Image Generation**: Google Gemini 2.0 Flash Preview Image Generation model (the only model that currently supports image generation)
- **SDK**: @google/genai package for better integration and streaming support

### Environment Variables

The application now uses serverless functions that securely handle API keys server-side. Your API keys are never exposed to the client.

## Troubleshooting

- Ensure Node.js version is 18.0.0 or higher
- Make sure environment variables are properly set in Vercel dashboard
- Check function logs in Vercel dashboard for any API errors
- If image generation fails, verify your API key has access to the `gemini-2.0-flash-preview-image-generation` model
- The @google/genai package will be automatically installed during Vercel deployment
- Text generation uses streaming for better performance
- Image generation may take 10-30 seconds depending on complexity

## Features Available After Deployment

- ✅ AI-powered content generation
- ✅ Image generation for articles  
- ✅ Secure API key handling
- ✅ Full mobile responsiveness
- ✅ PDF generation
- ✅ Article history
- ✅ Multiple newspaper themes 