import { GoogleGenerativeAI } from '@google/genai';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key directly from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize the Google Generative AI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });
      
      // Generate the image
      const result = await model.generateImage({
        prompt: prompt,
      });
  
      // Get the image as base64
      const imageBase64 = result.base64;
      
      // Return the image data
      res.status(200).json({ imageBase64 });
    } catch (modelError) {
      console.error('Gemini model error:', modelError);
      return res.status(500).json({ 
        error: `Gemini API error: ${modelError.message}`,
        details: modelError
      });
    }

  } catch (error) {
    console.error('Error in image API:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
} 