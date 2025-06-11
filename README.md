# AltNews

<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_59_109)">
<rect width="32" height="32" fill="white"/>
<path d="M4.35294 16C9.30292 6.65003 22.6971 6.65003 27.6471 16V16V16C22.6971 25.35 9.30293 25.35 4.35294 16V16V16Z" fill="black"/>
<circle cx="16" cy="16" r="4.125" fill="white"/>
</g>
<defs>
<clipPath id="clip0_59_109">
<rect width="32" height="32" fill="white"/>
</clipPath>
</defs>
</svg>

An interactive web application that generates fictional news articles from alternate timelines with vintage styling and Indian context.

## Features

**Dynamic Content Generation**
- Custom "What If" scenarios with AI-powered content
- Realistic AI-generated images matching article content
- Era-appropriate newspaper names, dates, and journalistic style

**Multiple Design Themes**
- Vintage (1940s-1950s newspaper styling)
- Retro (1960s-1970s aesthetic)
- Modern (Contemporary clean design)
- Futuristic (Sci-fi inspired layout)

**Advanced Functionality**
- High-quality PDF generation with proper formatting
- Mobile responsive design optimized for all devices
- Article history management with local storage
- Streaming API responses for better performance

## Live Demo

Visit the live application: [AltNews](https://heyadrsh.github.io/alternate-reality-news-generator)

## Technology Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive design with mobile-first approach
- Local Storage for data persistence

**AI Integration**
- Google Gemini 2.0 Flash Lite for text generation
- Google Gemini 2.0 Flash Preview Image Generation for AI imagery
- Official @google/genai SDK with streaming support

**Backend & Deployment**
- Vercel serverless functions
- Environment variable management
- CORS-enabled API endpoints

**Additional Libraries**
- jsPDF and html2canvas for PDF generation

## Getting Started

### Prerequisites

- Node.js 18+ (for local development)
- A Google AI Studio API key (free tier available)
- Vercel account (for deployment)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/heyadrsh/alternate-reality-news-generator.git
   cd alternate-reality-news-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Get your API key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the API key

4. **Configure environment variables:**
   - Copy `env.example` to `.env.local`
   - Add your API key:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```

5. **Start development server:**
   ```bash
   vercel dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables:**
   - Via Vercel dashboard or CLI
   - Add `GEMINI_API_KEY` with your API key value

### Alternative Static Hosting

For static hosting (GitHub Pages, Netlify), you'll need to modify the API calls to use direct endpoints or implement your own backend.

## Architecture

### AI-Powered Content Generation

The application leverages Google's latest Gemini models for content creation:

**Text Generation**
- Uses Gemini 2.0 Flash Lite for article content
- Streaming responses for better user experience
- Context-aware prompts for era-appropriate content

**Image Generation**
- Gemini 2.0 Flash Preview Image Generation for visuals
- Prompt engineering based on article themes
- Fallback mechanisms for API limits

### Serverless Architecture

**API Routes**
- `/api/generate.js` - Text generation endpoint
- `/api/image.js` - Image generation endpoint
- Environment variable management for security

**Security Features**
- API keys stored server-side only
- CORS-enabled endpoints
- Rate limiting and error handling

## Recent Updates

**Version 2.0 (Latest)**
- Migrated to secure serverless architecture
- Updated to latest Gemini 2.0 models
- Implemented streaming API responses
- Added professional "AltNews" branding
- Enhanced mobile responsiveness

**Previous Updates**
- Vintage dating system (1940-2000) with era-appropriate styling
- Improved PDF layout with better content flow
- Enhanced image handling with optimized backgrounds
- Era-specific newspaper names and formatting
- Optimized localStorage usage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Gemini 2.0 AI models for content generation
- Indian news media for authentic styling inspiration  
- jsPDF and html2canvas libraries for PDF functionality
- Vercel for serverless hosting platform 