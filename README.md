# Alternate Reality News Generator

An interactive web application that generates fictional news articles from alternate timelines with realistic vintage styling and a focus on Indian context.

## 🌟 Features

- **Dynamic Scenario Generation**: Enter your own "What If" scenarios or choose from suggested ones
- **AI-Powered Content**: Uses Gemini AI to generate creative, context-aware news articles
- **Mobile Responsive**: Optimized for both desktop and mobile viewing
- **Interactive UI Elements**:
  - Random scenario suggestions
  - Dynamic placeholder text
  - One-click article generation
  - Share functionality
  - Reality check comparison
- **Customization Options**:
  - Multiple newspaper styles (Vintage, Retro, Modern, Futuristic)
  - Save custom scenarios
  - View article history
- **Indian Context**: All articles are generated with Indian cultural elements, locations, and context
- **Historical Authenticity**:
  - Era-appropriate newspaper names (1940s-2000s)
  - Vintage dating system that creates authentic historical timestamps
  - Period-appropriate city datelines and journalistic style
  - Era-specific language and cultural references
- **PDF Generation**:
  - High-quality, properly formatted newspaper PDFs
  - Pure white backgrounds for optimal printing
  - Comprehensive content formatting with proper layout

## 🚀 Live Demo

Visit the live application: [Alternate Reality News Generator](https://heyadrsh.github.io/alternate-reality-news-generator)

## 💻 Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Google's Gemini AI API
- Local Storage for data persistence
- Responsive Design
- jsPDF for PDF generation
- html2canvas for image capture

## 🛠️ Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/heyadrsh/alternate-reality-news-generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd alternate-reality-news-generator
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   # Using Node.js
   npx http-server
   ```

4. (Optional) Add your Gemini API key in `script.js`:
   ```javascript
   const GEMINI_API_KEY = 'your-api-key-here';
   ```

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices:
- Compact layout for smaller screens
- Touch-friendly interface
- Optimized performance
- Reduced content load for better mobile experience

## 🎨 Newspaper Styles

Choose from four different newspaper styles:
1. **Vintage Monochrome**: Classic black and white newspaper look with era-appropriate typography
2. **Retro Newspaper**: Traditional newspaper style with aged effects and sepia tones
3. **Modern Blog**: Contemporary clean design with modern typography
4. **Futuristic Hologram**: Modern sci-fi inspired design with sleek styling

## 🕰️ Historical Accuracy

The application generates historically authentic content:
- Newspaper names change based on the generated date's era (1940s-2000s)
- Article datelines include era-appropriate city names (e.g., Bombay vs Mumbai)
- Content is tailored to reflect the writing style and concerns of the specific time period
- Comments appear as "Letters to the Editor" or other period-appropriate formats
- PDF generation includes era-specific publishing information

## 🔄 Recent Updates

- **Added Vintage Dating System**: Newspaper dates now range from 1940-2000 with era-appropriate styling
- **Improved PDF Layout**: Fixed spacing issues for better content flow and professional appearance
- **Enhanced Image Handling**: Pure white backgrounds for better print quality
- **Historical Authenticity**: Added era-specific newspaper names, city datelines, and comment formats
- **PDF Generation Improvements**: Better pagination, reduced empty spaces, and improved visual styling
- **Memory Optimization**: Improved localStorage usage to prevent quota issues
- **Added Clear History**: Button to manage user history and localStorage
- **Fixed PDF Generation**: Now includes both article image and full content with pagination

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google's Gemini AI for content generation
- Indian news media for inspiration
- Open source community for various tools and libraries used
- jsPDF and html2canvas libraries for PDF functionality 