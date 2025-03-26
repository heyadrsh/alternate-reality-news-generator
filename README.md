# Alternate Reality News Generator

An interactive web application that generates fictional news articles from alternate timelines with vintage styling and Indian context.

## Features

- **Dynamic Scenario Generation**: Custom "What If" scenarios with AI-powered content
- **Realistic Visual Elements**: AI-generated images matching article content
- **Historical Authenticity**: Era-appropriate newspaper names, dates, and journalistic style
- **Multiple Style Options**: Vintage, Retro, Modern, and Futuristic newspaper layouts
- **PDF Generation**: High-quality newspaper PDFs with proper formatting
- **Mobile Responsive**: Optimized for all devices
- **History Management**: Save and retrieve past articles

## Live Demo

Visit the live application: [Alternate Reality News Generator](https://heyadrsh.github.io/alternate-reality-news-generator)

## Technologies Used

- HTML5, CSS3, JavaScript (ES6+)
- Google's Gemini API for text generation
- AI image generation APIs
- Local Storage for persistence
- jsPDF and html2canvas for PDF generation

## Setup and Installation

1. Clone the repository: `git clone https://github.com/heyadrsh/alternate-reality-news-generator.git`
2. Navigate to project directory: `cd alternate-reality-news-generator`
3. Open `index.html` in your browser or use a local server
4. Add your API keys in `script.js`:
   ```javascript
   const GEMINI_API_KEY = 'your-api-key-here';
   const IMAGE_API_KEY = 'your-image-api-key-here';
   ```

## Implementing Image Generation

The application uses AI image generation APIs to create visually matching content for articles:

1. **API Integration**: Connects to image generation services that can produce newspaper-style images
2. **Prompt Engineering**: Extracts key themes from generated articles to create effective image prompts
3. **Caching System**: Stores generated image data for performance optimization
4. **Fallback Mechanism**: Uses placeholder images if API limits are reached
5. **Style Adaptation**: Applies visual filters to match the newspaper's time period

## Recent Updates

- Added vintage dating system (1940-2000) with era-appropriate styling
- Improved PDF layout with better content flow and professional appearance
- Enhanced image handling with pure white backgrounds for better printing
- Added era-specific newspaper names, city datelines, and comment formats
- Implemented image generation based on article content
- Optimized localStorage usage to prevent quota issues

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google's Gemini AI for content generation
- AI image generation services
- Indian news media for inspiration
- jsPDF and html2canvas libraries 