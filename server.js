const express = require('express');
const { GoogleGenerativeAI } = require('@google/genai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('./'));

// Text generation API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    // Create a chat session
    const chat = model.startChat();
    
    // Send the prompt and get a streaming response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Return response in format expected by the client
    const responseData = {
      candidates: [{
        content: {
          parts: [{
            text: text
          }]
        }
      }]
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Error in generate API:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error'
    });
  }
});

// Image generation API endpoint
app.post('/api/image', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });
    
    // Generate the image
    const result = await model.generateImage({
      prompt: prompt,
    });

    // Get the image as base64
    const imageBase64 = result.base64;
    
    // Return the image data
    res.status(200).json({ imageBase64 });
    
  } catch (error) {
    console.error('Error in image API:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error'
    });
  }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Make sure to add your GEMINI_API_KEY to .env.local file`);
}); 