document.addEventListener('DOMContentLoaded', () => {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    // Apply mobile-specific class to body for CSS targeting
    if (isMobile) {
        document.body.classList.add('mobile-device');
        // Add mobile-specific styles
        const mobileStyles = document.createElement('style');
        mobileStyles.textContent = `
            /* Mobile-specific styles */
            body.mobile-device {
                font-size: 13px;
            }
            
            .mobile-device h1 { font-size: 1.3rem; }
            .mobile-device h2 { font-size: 1rem; }
            .mobile-device h3 { font-size: 0.9rem; }
            .mobile-device h4 { font-size: 0.8rem; }
            
            .mobile-device .newspaper {
                padding: 10px;
                margin: 5px;
            }
            
            .mobile-device .article {
                font-size: 0.85rem;
                line-height: 1.4;
            }
            
            .mobile-device .article-headline {
                font-size: 1rem;
                line-height: 1.3;
            }
            
            .mobile-device .article-byline {
                font-size: 0.75rem;
            }
            
            .mobile-device .comment {
                font-size: 0.8rem;
                padding: 8px;
                margin: 5px 0;
            }
            
            .mobile-device .comment-author {
                font-size: 0.75rem;
            }
            
            .mobile-device .comment-meta {
                font-size: 0.7rem;
            }
            
            .mobile-device button {
                font-size: 0.8rem;
                padding: 6px 10px;
                margin: 3px;
            }
            
            .mobile-device .suggestion-btn {
                font-size: 0.75rem;
                padding: 5px 8px;
                margin: 2px;
            }
            
            .mobile-device input[type="text"] {
                font-size: 0.85rem;
                padding: 8px;
            }
            
            .mobile-device .history-item {
                padding: 8px;
                margin: 3px 0;
            }
            
            .mobile-device .history-scenario {
                font-size: 0.8rem;
            }
            
            .mobile-device .history-date {
                font-size: 0.7rem;
            }
            
            .mobile-device .settings-container {
                padding: 8px;
            }
            
            .mobile-device select {
                font-size: 0.8rem;
                padding: 5px;
            }
            
            .mobile-device .article-actions {
                margin: 5px 0;
            }
            
            .mobile-device .article-actions button {
                font-size: 0.75rem;
                padding: 5px 8px;
            }
            
            .mobile-device .suggestion-buttons {
                display: flex;
                flex-direction: column;
                gap: 3px;
            }
            
            .mobile-device .suggestion-buttons button {
                width: 100%;
                text-align: left;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .mobile-device .mobile-settings {
                padding: 5px;
            }
            
            .mobile-device .mobile-settings label {
                font-size: 0.8rem;
            }
            
            .mobile-device .mobile-settings h4 {
                font-size: 0.85rem;
                margin: 5px 0;
            }
            
            .mobile-device .mobile-settings p {
                font-size: 0.75rem;
            }
            
            .mobile-device .suggestions-actions {
                display: flex;
                gap: 5px;
                margin: 5px 0;
            }
            
            .mobile-device .suggestions-actions button {
                flex: 1;
                font-size: 0.75rem;
                padding: 5px 8px;
            }
            
            .mobile-device .mobile-suggestions-list {
                max-height: 200px;
                overflow-y: auto;
            }
            
            .mobile-device .mobile-suggestions-list .suggestion-item {
                font-size: 0.75rem;
                padding: 5px;
                margin: 2px 0;
            }
            
            .mobile-device .mobile-history-content {
                max-height: 150px;
                overflow-y: auto;
            }
            
            .mobile-device .mobile-history-content .history-item {
                padding: 5px;
                margin: 2px 0;
            }
            
            .mobile-device .view-more-history-btn,
            .mobile-device .show-more-comments-btn {
                font-size: 0.75rem;
                padding: 5px 8px;
                margin: 5px 0;
                width: 100%;
            }
            
            /* Remove column layout for mobile */
            .mobile-device .retro #article-content,
            .mobile-device .modern #article-content,
            .mobile-device .monochrome #article-content,
            .mobile-device .futuristic #article-content {
                column-count: 1 !important;
                column-gap: 0 !important;
            }
            
            .mobile-device #newspaper-name {
                font-size: 1.3rem;
                letter-spacing: 1px;
            }
            
            .mobile-device .monochrome #article-headline {
                font-size: 1.2rem;
            }
            
            .mobile-device .monochrome #newspaper-name {
                font-size: 1.5rem;
                letter-spacing: 1px;
            }
        `;
        document.head.appendChild(mobileStyles);
    }
    
    // UI Elements
    const scenarioInput = document.getElementById('scenario-input');
    const generateBtn = document.getElementById('generate-btn');
    const loadingElement = document.getElementById('loading');
    const newsContainer = document.getElementById('news-container');
    const newspaperName = document.getElementById('newspaper-name');
    const newspaperDate = document.getElementById('newspaper-date');
    const articleHeadline = document.getElementById('article-headline');
    const articleByline = document.getElementById('article-byline');
    const articleContent = document.getElementById('article-content');
    articleContent.style.backgroundColor = '#FFFFFF';
    const commentsContainer = document.getElementById('comments-container');
    
    // API Configuration
    // API configuration - now using serverless functions
    const API_BASE_URL = window.location.origin;
    const GENERATE_API_URL = `${API_BASE_URL}/api/generate`;
    const IMAGE_API_URL = `${API_BASE_URL}/api/image`;
    
    // Elements for the article image
    const articleImageContainer = document.getElementById('article-image-container');
    const articleImage = document.getElementById('article-image');
    const imageCaption = document.getElementById('image-caption');
    
    // Cache for image prompts to reduce API calls
    const imagePromptCache = new Map();
    
    // UI Module for handling UI updates
    const UI = {
        showLoading: () => {
            showLoadingIndicator();
        },
        hideLoading: () => {
            loadingElement.classList.add('hidden');
        },
        showNews: () => {
            newsContainer.classList.remove('hidden');
            
            // On mobile, scroll to the news container
            if (isMobile) {
                setTimeout(() => {
                    newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        },
        updateArticle: (content) => {
            // Set the current date
            setNewspaperDate();
            
            // Update the article headline
            articleHeadline.textContent = content.headline;
            
            // Update the article byline
            articleByline.textContent = content.byline;
            
            // Display the image if available
            if (content.image) {
                articleImage.src = `data:${content.image.mimeType};base64,${content.image.data}`;
                // Update the image caption to be more specific to the content
                imageCaption.textContent = `Visual coverage: ${content.headline.split(':')[0]}`;
                articleImageContainer.classList.remove('hidden');
            } else {
                articleImageContainer.classList.add('hidden');
            }
            
            // Update the article content
            articleContent.innerHTML = formatArticleContent(content.content);
            articleContent.style.backgroundColor = '#FFFFFF';
        },
        updateComments: (comments) => {
            commentsContainer.innerHTML = '';
            
            // On mobile, limit visible comments initially to improve performance
            const commentsToShow = isMobile ? 2 : comments.length;
            const hasMoreComments = comments.length > commentsToShow;
            
            for (let i = 0; i < commentsToShow; i++) {
                const comment = comments[i];
                const commentElement = createCommentElement(comment);
                commentsContainer.appendChild(commentElement);
            }
            
            // Add "Show more comments" button on mobile if needed
            if (isMobile && hasMoreComments) {
                const showMoreBtn = document.createElement('button');
                showMoreBtn.className = 'show-more-comments-btn';
                showMoreBtn.textContent = `Show ${comments.length - commentsToShow} more comments`;
                showMoreBtn.addEventListener('click', () => {
                    // Remove the button
                    showMoreBtn.remove();
                    
                    // Add remaining comments
                    for (let i = commentsToShow; i < comments.length; i++) {
                        const comment = comments[i];
                        const commentElement = createCommentElement(comment);
                        commentsContainer.appendChild(commentElement);
                    }
                });
                
                commentsContainer.appendChild(showMoreBtn);
            }
        },
        showError: (message) => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            
            // Make error messages more visible on mobile
            if (isMobile) {
                errorElement.classList.add('mobile-error');
            }
            
            errorElement.textContent = message;
            
            // Remove any existing error messages
            document.querySelectorAll('.error-message').forEach(el => el.remove());
            
            // Insert the error message before the loading element
            loadingElement.parentNode.insertBefore(errorElement, loadingElement);
            
            // Hide the error after 5 seconds
            setTimeout(() => {
                errorElement.remove();
            }, 5000);
        }
    };
    
    // Helper function to create a comment element with vintage-appropriate timestamps
    const createCommentElement = (comment) => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        
        const authorElement = document.createElement('div');
        authorElement.className = 'comment-author';
        authorElement.textContent = comment.author;
        
        const textElement = document.createElement('div');
        textElement.className = 'comment-text';
        textElement.textContent = comment.text;
        
        const metaElement = document.createElement('div');
        metaElement.className = 'comment-meta';
        
        // If the meta contains modern-style timestamps, replace them with vintage-appropriate ones
        let metaText = comment.meta;
        if (metaText.includes('Posted') || metaText.includes('likes')) {
            const vintageYear = window.vintageDate ? window.vintageDate.getFullYear() : 1970;
            
            // Parse the hours from the original meta if present
            let hours = 2; // Default
            const hoursMatch = metaText.match(/Posted (\d+) hours? ago/);
            if (hoursMatch && hoursMatch[1]) {
                hours = parseInt(hoursMatch[1]);
            }
            
            // Create vintage-appropriate meta text based on era
            if (vintageYear < 1950) {
                metaText = `Reader correspondence • ${window.vintageDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
            } else if (vintageYear < 1970) {
                metaText = `Letter to the Editor • ${window.vintageDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
            } else if (vintageYear < 1990) {
                metaText = `Public Opinion • Received via Telegram • ${window.vintageDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
            } else {
                metaText = `Fax Communication • ${window.vintageDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`;
            }
        }
        
        metaElement.textContent = metaText;
        
        commentElement.appendChild(authorElement);
        commentElement.appendChild(textElement);
        commentElement.appendChild(metaElement);
        
        return commentElement;
    };
    
    // API Module for handling API calls
    const API = {
        generateNews: async (scenario) => {
            try {
                // Create the prompt for the Gemini API
                const prompt = generatePrompt(scenario);
                
                // Set up timeout for the API call
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout
                
                // Call the serverless API
                const response = await fetch(GENERATE_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: prompt
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('API Error:', response.status, errorText);
                    
                    if (response.status === 404) {
                        throw new Error('API endpoint not found. Please check if the Gemini API URL is correct.');
                    } else if (response.status === 400) {
                        throw new Error('Bad request. Your API key might be invalid or the prompt format is incorrect.');
                    } else if (response.status === 403) {
                        throw new Error('Access forbidden. Please check if your API key is valid and has the necessary permissions.');
                    } else if (response.status === 429) {
                        throw new Error('Too many requests. You have exceeded your quota or rate limit.');
                    } else {
                        throw new Error(`API error (${response.status}): ${errorText}`);
                    }
                }
                
                const data = await response.json();
                
                if (!data.candidates || data.candidates.length === 0) {
                    throw new Error('No content generated. The API returned an empty response.');
                }
                
                if (data.candidates[0].finishReason === 'SAFETY') {
                    throw new Error('Content was blocked due to safety concerns. Please try a different scenario.');
                }
                
                // Extract the text response from the API
                const textResponse = data.candidates[0].content.parts[0].text;
                
                // Parse the JSON from the text response
                let content;
                try {
                    // First, try to parse the entire response as JSON
                    content = JSON.parse(textResponse);
                } catch (e) {
                    console.error('Could not parse entire response as JSON, trying to extract JSON object');
                    
                    // If that fails, try to extract a JSON object from the response
                    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
                    
                    if (jsonMatch) {
                        try {
                            // Clean the response to remove any markdown code block syntax
                            const cleanResponse = jsonMatch[0].replace(/```json\n|\n```|```/g, '').trim();
                            content = JSON.parse(cleanResponse);
                        } catch (e) {
                            console.error('Error parsing JSON from API response:', e);
                            throw new Error('Failed to parse the generated content. Please try again.');
                        }
                    } else {
                        console.error('No JSON found in API response');
                        throw new Error('The API response format was unexpected. Please try again.');
                    }
                }
                
                // Validate the response has the expected fields
                if (!content.headline || !content.byline || !content.content || !content.comments) {
                    throw new Error('API response is missing required fields');
                }
                
                // Ensure we have exactly 4 comments
                if (!Array.isArray(content.comments) || content.comments.length === 0) {
                    content.comments = generateMockContent(scenario).comments;
                } else if (content.comments.length > 4) {
                    content.comments = content.comments.slice(0, 4);
                }

                // Generate image for the article
                try {
                    // Get the current newspaper style
                    const newspaperStyle = document.querySelector('.newspaper')?.classList[1] || 'monochrome';
                    
                    // Generate image prompt based on content and style
                    const imagePrompt = await generateImagePrompt(scenario, content, newspaperStyle);
                    
                    // Generate the image using the prompt
                    const imageData = await generateImage(imagePrompt);
                    
                    // Add image data to the content
                    content.image = imageData;
                } catch (imageError) {
                    console.error('Image generation failed:', imageError);
                    // Continue without an image if image generation fails
                    content.image = null;
                }
                
                // Save to history
                saveArticleToHistory(scenario, content);
                
                return content;
            } catch (error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timed out. Please try again later.');
                }
                throw error;
            }
        },

        // Add other API methods if needed
    };
    
    // Set newspaper date to a vintage date instead of current date
    const setNewspaperDate = () => {
        // Generate a random vintage date between 1940 and 2000
        const startYear = 1940;
        const endYear = 2000;
        const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
        
        // Generate random month and day
        const randomMonth = Math.floor(Math.random() * 12);
        const daysInMonth = new Date(randomYear, randomMonth + 1, 0).getDate();
        const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
        
        // Create the vintage date
        const vintageDate = new Date(randomYear, randomMonth, randomDay);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        newspaperDate.textContent = vintageDate.toLocaleDateString('en-US', options);
        
        // Store the vintage date for PDF generation
        window.vintageDate = vintageDate;
    };
    
    // Generate a better vintage newspaper name based on the era
    const generateNewspaperName = () => {
        // Check if we have a vintage date set
        const vintageYear = window.vintageDate ? window.vintageDate.getFullYear() : 1970;
        
        // Names appropriate for different eras
        let baseNames;
        
        if (vintageYear < 1950) {
            // Pre-1950s names
            baseNames = [
                'The Delhi Chronicle',
                'The Indian Herald',
                'The Hindustan Times-Gazette',
                'The Calcutta Observer',
                'The Bombay Daily',
                'The Imperial Post',
                'The Colonial Times'
            ];
        } else if (vintageYear < 1970) {
            // 1950s-1960s names
            baseNames = [
                'The New Indian Express',
                'The National Herald',
                'The Bharat Times',
                'The Independent Observer',
                'The Modern Chronicle',
                'The Republic Gazette',
                'The Delhi Telegraph'
            ];
        } else if (vintageYear < 1990) {
            // 1970s-1980s names
            baseNames = [
                'The Indian Post',
                'The Democratic Chronicle',
                'The Progressive Herald',
                'The Union Times',
                'The Federal Observer',
                'The People\'s Daily',
                'The National Mirror'
            ];
        } else {
            // 1990s-2000s names
            baseNames = [
                'The Millennium Post',
                'The Global Times',
                'The Digital Chronicle',
                'The Modern Express',
                'The Information Age',
                'The New Millennium Herald',
                'The Satellite Times'
            ];
        }
        
        return baseNames[Math.floor(Math.random() * baseNames.length)];
    };
    
    // Format the article content from plain text to HTML with paragraphs
    const formatArticleContent = (content) => {
        // If content is already HTML, add a date before the first paragraph
        if (content.includes('<p>')) {
            // Generate an article date that's 1-10 days older than the newspaper date
            const articleDate = new Date(window.vintageDate);
            const daysBack = Math.floor(Math.random() * 10) + 1;
            articleDate.setDate(articleDate.getDate() - daysBack);
            const formattedDate = articleDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Create dateline for the article
            let locationDateline = '';
            // Generate random Indian city based on era
            const vintageYear = window.vintageDate ? window.vintageDate.getFullYear() : 1970;
            let cities;
            
            if (vintageYear < 1950) {
                cities = ['BOMBAY', 'CALCUTTA', 'MADRAS', 'NEW DELHI', 'LAHORE', 'KARACHI'];
            } else if (vintageYear < 1970) {
                cities = ['BOMBAY', 'CALCUTTA', 'MADRAS', 'NEW DELHI', 'AGRA', 'LUCKNOW'];
            } else {
                cities = ['MUMBAI', 'KOLKATA', 'CHENNAI', 'NEW DELHI', 'BANGALORE', 'HYDERABAD'];
            }
            
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            locationDateline = `<p class="dateline"><strong>${randomCity}</strong> - ${formattedDate} - `;
            
            // Insert the dateline at the beginning of the content
            return content.replace('<p>', `${locationDateline}`);
        }
        
        // For plain text, add a date and split by double newlines
        // Generate an article date that's 1-10 days older than the newspaper date
        const articleDate = new Date(window.vintageDate);
        const daysBack = Math.floor(Math.random() * 10) + 1;
        articleDate.setDate(articleDate.getDate() - daysBack);
        const formattedDate = articleDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Generate random Indian city based on era
        const vintageYear = window.vintageDate ? window.vintageDate.getFullYear() : 1970;
        let cities;
        
        if (vintageYear < 1950) {
            cities = ['BOMBAY', 'CALCUTTA', 'MADRAS', 'NEW DELHI', 'LAHORE', 'KARACHI'];
        } else if (vintageYear < 1970) {
            cities = ['BOMBAY', 'CALCUTTA', 'MADRAS', 'NEW DELHI', 'AGRA', 'LUCKNOW'];
        } else {
            cities = ['MUMBAI', 'KOLKATA', 'CHENNAI', 'NEW DELHI', 'BANGALORE', 'HYDERABAD'];
        }
        
        const randomCity = cities[Math.floor(Math.random() * cities.length)];
        const locationDateline = `<p class="dateline"><strong>${randomCity}</strong> - ${formattedDate} - `;
        
        // Split content and wrap in paragraph tags, adding the dateline to the first paragraph
        const paragraphs = content.split(/\n\n+/);
        if (paragraphs.length > 0) {
            paragraphs[0] = `${locationDateline}${paragraphs[0]}</p>`;
            // Wrap other paragraphs
            for (let i = 1; i < paragraphs.length; i++) {
                paragraphs[i] = `<p>${paragraphs[i].trim()}</p>`;
            }
            return paragraphs.join('');
        }
        
        // Default formatting if there are no paragraphs
        return `${locationDateline}${content.trim()}</p>`;
    };
    
    // Save article to history in localStorage
    const saveArticleToHistory = (scenario, article) => {
        try {
            const history = JSON.parse(localStorage.getItem('newsHistory')) || [];
            
            // Create a copy of the article without the image data to save space
            const articleForStorage = { ...article };
            // Always remove image data before storing
            delete articleForStorage.image;
            
            // Limit history to 10 items
            if (history.length >= 10) {
                history.pop(); // Remove the oldest item
            }
            
            history.unshift({ scenario, article: articleForStorage, date: new Date().toISOString() }); // Add new item at the beginning
            localStorage.setItem('newsHistory', JSON.stringify(history));
            
            // Update the history display
            displayHistory();
        } catch (error) {
            console.error('Failed to save article to history:', error);
            // If storage quota is exceeded, try removing older items
            if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
                const history = JSON.parse(localStorage.getItem('newsHistory')) || [];
                // Keep only the 5 most recent items
                const trimmedHistory = history.slice(0, 5);
                try {
                    localStorage.setItem('newsHistory', JSON.stringify(trimmedHistory));
                    console.log('Trimmed history to save space');
                } catch (e) {
                    // If still can't save, clear history
                    localStorage.removeItem('newsHistory');
                    console.log('Cleared history due to storage limitations');
                }
            }
        }
    };
    
    // Display history with mobile optimization
    const displayHistory = () => {
        const history = JSON.parse(localStorage.getItem('newsHistory')) || [];
        
        // Get or create the history container
        let historyContainer = document.querySelector('.history-container');
        if (!historyContainer) {
            historyContainer = document.createElement('div');
            historyContainer.className = `history-container ${isMobile ? 'mobile-history' : ''}`;
            document.querySelector('.container').appendChild(historyContainer);
        }
        
        // Clear the container
        historyContainer.innerHTML = `
            <div class="history-header">
                <h3>Previous Articles</h3>
                <div class="history-header-buttons">
                    <button id="clear-history-btn">Clear History</button>
                    <button id="toggle-history-btn">Hide</button>
                </div>
            </div>
            <div id="history-content" class="${isMobile ? 'mobile-history-content' : ''}"></div>
        `;
        
        // Get the history content container
        const historyContent = document.getElementById('history-content');
        
        if (history.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'No previous articles yet. Generate some!';
            historyContent.appendChild(emptyMessage);
            
            // Hide the clear button if there's no history
            document.getElementById('clear-history-btn').style.display = 'none';
        }
        
        // Add event listener for clear history button
        document.getElementById('clear-history-btn').addEventListener('click', clearHistory);
        
        // Add toggle functionality
        document.getElementById('toggle-history-btn').addEventListener('click', toggleHistory);
        
        // Limit history items on mobile for performance
        const historyToShow = isMobile ? Math.min(5, history.length) : history.length;
        
        // Add each history item
        for (let i = 0; i < historyToShow; i++) {
            const entry = history[i];
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString();
            
            // Truncate scenario text on mobile
            let scenarioText = entry.scenario;
            if (isMobile && scenarioText.length > 35) {
                scenarioText = scenarioText.substring(0, 32) + '...';
            }
            
            historyItem.innerHTML = `
                <div class="history-scenario">${scenarioText}</div>
                <div class="history-date">${formattedDate}</div>
            `;
            
            historyItem.addEventListener('click', async () => {
                try {
                    // Show loading state
                    UI.showLoading();
                    
                    // Get the article data
                    const articleData = entry.article;
                    
                    // First display the article without an image
                    articleImageContainer.classList.add('hidden');
                    UI.updateArticle(articleData);
                    UI.updateComments(articleData.comments);
                    UI.showNews();
                    
                    // Historical articles display without images for better performance
                    // Image regeneration removed to simplify deployment
                    
                    // Hide loading state
                    UI.hideLoading();
                    
                    // On mobile, scroll to the article
                    if (isMobile) {
                        setTimeout(() => {
                            newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                } catch (error) {
                    UI.hideLoading();
                    UI.showError(`Failed to load article: ${error.message}`);
                }
            });
            
            historyContent.appendChild(historyItem);
        }
        
        // Show "View more" button on mobile if needed
        if (isMobile && history.length > historyToShow) {
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.className = 'view-more-history-btn';
            viewMoreBtn.textContent = `View ${history.length - historyToShow} more articles`;
            viewMoreBtn.addEventListener('click', () => {
                displayAllHistory(history, historyToShow);
                viewMoreBtn.remove();
            });
            historyContent.appendChild(viewMoreBtn);
        }
    };
    
    // Function to display all history items
    const displayAllHistory = (history, startIndex) => {
        const historyContent = document.getElementById('history-content');
        
        for (let i = startIndex; i < history.length; i++) {
            const entry = history[i];
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const date = new Date(entry.date);
            const formattedDate = date.toLocaleDateString();
            
            // Truncate scenario text on mobile
            let scenarioText = entry.scenario;
            if (isMobile && scenarioText.length > 35) {
                scenarioText = scenarioText.substring(0, 32) + '...';
            }
            
            historyItem.innerHTML = `
                <div class="history-scenario">${scenarioText}</div>
                <div class="history-date">${formattedDate}</div>
            `;
            
            historyItem.addEventListener('click', async () => {
                try {
                    // Show loading state
                    UI.showLoading();
                    
                    // Get the article data
                    const articleData = entry.article;
                    
                    // First display the article without an image
                    articleImageContainer.classList.add('hidden');
                    UI.updateArticle(articleData);
                    UI.updateComments(articleData.comments);
                    UI.showNews();
                    
                    // Historical articles display without images for better performance
                    // Image regeneration removed to simplify deployment
                    
                    // Hide loading state
                    UI.hideLoading();
                    
                    // On mobile, scroll to the article
                    if (isMobile) {
                        setTimeout(() => {
                            newsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 100);
                    }
                } catch (error) {
                    UI.hideLoading();
                    UI.showError(`Failed to load article: ${error.message}`);
                }
            });
            
            historyContent.appendChild(historyItem);
        }
    };
    
    // Toggle history visibility
    const toggleHistory = () => {
        const historyContent = document.getElementById('history-content');
        const toggleBtn = document.getElementById('toggle-history-btn');
        
        if (historyContent.classList.contains('hidden-content')) {
            // Show content
            historyContent.classList.remove('hidden-content');
            toggleBtn.textContent = 'Hide';
            localStorage.setItem('historyVisible', 'true');
        } else {
            // Hide content
            historyContent.classList.add('hidden-content');
            toggleBtn.textContent = 'Show';
            localStorage.setItem('historyVisible', 'false');
        }
    };
    
    // This is a mock function to generate content locally as a fallback
    const generateMockContent = (scenario) => {
        // This is where we would normally call an LLM API
        // For now, we'll generate some mock content based on the scenario
        
        let headline, byline, content, comments;
        
        // Example for "What if dinosaurs never went extinct?"
        if (scenario.toLowerCase().includes('dinosaur')) {
            headline = "TRICERATOPS ELECTED MAYOR OF MUMBAI IN HISTORIC VOTE";
            byline = "By Vikram Sharma | Science and Politics Correspondent";
            content = `
                <p>MUMBAI - In a historic election that has captured international attention, Trixie the Triceratops has become the first dinosaur to be elected mayor of Mumbai. The 67-year-old herbivore secured 58% of the vote, defeating both human and other dinosaur candidates in what analysts are calling a "watershed moment" for dinosaur-human relations in India.</p>
                
                <p>"This victory isn't just for me, but for all species who believe in a more inclusive Bharat," said Mayor-elect Trixie during her acceptance speech at Jurassic Park Gateway of India. Her campaign, which focused on climate action, inter-species housing equity, and expanding the city's plant-based food options, resonated strongly with both dinosaur and human voters across Maharashtra.</p>
                
                <p>The election reflects the growing political influence of the dinosaur community, which now makes up approximately 23% of India's population. Dinosaurs have been gradually integrating into Indian society since the Great Coexistence Pact of 1989, which formally recognized dinosaurs as equal citizens throughout South Asia.</p>
                
                <p>Prime Minister Sharma congratulated Trixie on her victory, calling it "a powerful reminder that our society's strength comes from our diversity." However, not everyone is celebrating. The Human First Coalition released a statement expressing concerns about "the practical challenges of having a 15-ton mayor who cannot fit through standard doorways in the BMC headquarters."</p>
                
                <p>Trixie has promised to address these concerns by renovating Mumbai's civic buildings to be "accessible to citizens of all sizes" and pledged to work closely with human deputies on day-to-day operations that require smaller appendages than her three-fingered forelimbs can manage.</p>
                
                <p>The mayor-elect will be sworn in on January 1st in a ceremony that will be held at Shivaji Park to accommodate her size and the expected large crowd of both human and dinosaur supporters from across India and neighboring countries.</p>
            `;
            comments = [
                {
                    author: "DinoRajDelhi",
                    text: "About time we had some reptilian representation! The mammals have been running things for too long in our country!",
                    meta: "Posted 2 hours ago • 157 likes"
                },
                {
                    author: "MumbaiMammal",
                    text: "I voted for her because of her environmental policy, not because she's a dinosaur. Her plan to replace all city vehicles with dinosaur-pulled rickshaws will cut emissions by 45%!",
                    meta: "Posted 1 hour ago • 89 likes"
                },
                {
                    author: "SkepticalSingh",
                    text: "How is she going to sign bills with those tiny arms? This is just symbolic politics that won't help the common people of Mumbai.",
                    meta: "Posted 45 minutes ago • 23 likes"
                },
                {
                    author: "PterodactylPriya",
                    text: "As a flying dinosaur from Chennai, I'm concerned about her stance on air traffic regulations. Will she restrict our flight paths even further over the Arabian Sea?",
                    meta: "Posted 30 minutes ago • 42 likes"
                }
            ];
        } else {
            // Generic response for other scenarios
            headline = "ALTERNATE REALITY TRANSFORMS INDIA'S LANDSCAPE";
            byline = "By Ananya Mehta | Multiverse Correspondent";
            content = `
                <p>NEW DELHI - In a stunning development that has shocked experts and citizens alike, the alternate reality where "${scenario}" has produced unexpected consequences that are reshaping Indian society as we know it.</p>
                
                <p>"We never could have predicted these outcomes," said Dr. Aditya Kapoor, leading researcher at the Indian Institute of Alternate Timeline Studies in Bangalore. "This reality has diverged in fascinating ways that challenge our understanding of cause and effect across the subcontinent."</p>
                
                <p>The most notable change has been in how everyday people from Kashmir to Kanyakumari have adapted to this new normal. Communities have formed around the new paradigm, with some embracing the changes while others resist them, creating a unique cultural tapestry across India's diverse states.</p>
                
                <p>"It's just how things are now," said Delhi resident Priya Sharma. "My grandparents tell stories about how India used to be different, but for my generation, this is just reality. We've incorporated these changes into our festivals, food, and daily life."</p>
                
                <p>Economists at the Reserve Bank of India predict that markets will continue to adjust to the new conditions, with some industries thriving while others become obsolete. Political analysts note that power structures across South Asia have shifted in response to the altered circumstances.</p>
                
                <p>As society continues to evolve in this alternate timeline, one thing remains clear: the ripple effects of "${scenario}" will continue to be felt for generations to come throughout India and its neighboring countries.</p>
            `;
            comments = [
                {
                    author: "DelhiDreamer",
                    text: "I can't imagine living in an India where this didn't happen. How would we even function with our old ways?",
                    meta: "Posted 3 hours ago • 78 likes"
                },
                {
                    author: "KolkataKritic",
                    text: "This article is biased. There are plenty of downsides to this reality that aren't being reported in our media!",
                    meta: "Posted 2 hours ago • 45 likes"
                },
                {
                    author: "HistorianHarish",
                    text: "Actually, if you study the historical records in the National Archives, this change happened gradually over decades, not overnight like the media portrays.",
                    meta: "Posted 1 hour ago • 112 likes"
                },
                {
                    author: "FuturistFarah",
                    text: "I wonder what the next big change will be for our country? This is just the beginning of India's transformation!",
                    meta: "Posted 30 minutes ago • 27 likes"
                }
            ];
        }
        
        return {
            headline,
            byline,
            content,
            comments
        };
    };
    
    // Collection of "what if" scenario suggestions
    const defaultWhatIfSuggestions = [
        // General, interesting scenarios (100)
        "What if humans could photosynthesize like plants?",
        "What if we discovered that dreams were actually glimpses of parallel universes?",
        "What if gravity suddenly became half as strong worldwide?",
        "What if animals could speak human languages?",
        "What if humans had evolved with four arms instead of two?",
        "What if the internet had been invented in the 1800s?",
        "What if humans hibernated during winter months?",
        "What if teleportation was invented tomorrow?",
        "What if humans could breathe underwater naturally?",
        "What if money was replaced by a system based on kindness?",
        "What if the sky was permanently purple?",
        "What if the moon was twice as close to Earth?",
        "What if everyone could read minds?",
        "What if aging stopped at 25 years old?",
        "What if humans had wings and could fly?",
        "What if electricity was never discovered?",
        "What if smartphones existed in ancient Rome?",
        "What if humans lived for 500 years?",
        "What if dinosaurs never went extinct?",
        "What if all oceans turned into freshwater overnight?",
        "What if time travel was limited to 24 hours in the past?",
        "What if we could communicate with plants?",
        "What if everyone on Earth spoke the same language?",
        "What if Earth had two moons?",
        "What if humans were nocturnal by nature?",
        "What if humans could shapeshift at will?",
        "What if we discovered that all religions described the same god?",
        "What if humans had tails?",
        "What if chocolate became the global currency?",
        "What if we could record our dreams like movies?",
        "What if humans were born with natural camouflage abilities?",
        "What if the world's continents never separated?",
        "What if antibiotics had never been discovered?",
        "What if the entire world was covered in forest?",
        "What if humans could regenerate limbs like starfish?",
        "What if all food tasted the same?",
        "What if all humans were born knowing how to play an instrument?",
        "What if snow was warm instead of cold?",
        "What if the law of gravity was discovered 1000 years earlier?",
        "What if humans never needed to sleep?",
        "What if everyone had a personal AI assistant from birth?",
        "What if all buildings were underground?",
        "What if plastic was never invented?",
        "What if all fiction became reality?",
        "What if all land was shared equally among all people?",
        "What if we discovered alien microbes on Mars tomorrow?",
        "What if all jobs were performed by robots?",
        "What if the sun turned green?",
        "What if memories could be transferred between people?",
        "What if water had memory?",
        "What if writing was never invented?",
        "What if all politicians had to pass rigorous ethics exams?",
        "What if we discovered a pill that eliminated the need for sleep?",
        "What if every person had a visible countdown to their death?",
        "What if global fertility rates dropped to zero for five years?",
        "What if the internet disappeared overnight?",
        "What if we discovered that insects were sentient and intelligent?",
        "What if time moved backward one day every month?",
        "What if trees grew ten times faster?",
        "What if everyone could only speak the truth?",
        "What if social media was never invented?",
        "What if the average human lifespan was 200 years?",
        "What if all countries unified into a single global nation?",
        "What if all weapons became flowers when used with harmful intent?",
        "What if humans could communicate with their past and future selves?",
        "What if all diseases were cured tomorrow?",
        "What if all sounds suddenly became visible?",
        "What if emotions could be bottled and traded?",
        "What if humans had evolved from cats instead of primates?",
        "What if you could taste music?",
        "What if the world's population was only 1 million people?",
        "What if weather responded to human emotions?",
        "What if we discovered all art contained hidden messages from the future?",
        "What if coffee never existed?",
        "What if each person could control one element (earth, air, fire, water)?",
        "What if all humans suddenly became immortal?",
        "What if we could travel through books into their worlds?",
        "What if space exploration began 1000 years earlier?",
        "What if humans could photosynthesize energy from sunlight?",
        "What if the Earth's rotation took 48 hours instead of 24?",
        "What if all technology had to be reinvented from scratch?",
        "What if we discovered that plants had consciousness?",
        "What if all bodies of water became sentient beings?",
        "What if we discovered a parallel Earth orbiting on the opposite side of the sun?",
        "What if fossil fuels never existed?",
        "What if all humans had perfect memory?",
        "What if wealth was distributed based on kindness?",
        "What if all books became interactive virtual reality experiences?",
        "What if humans could voluntarily enter suspended animation?",
        "What if all of humanity shared a collective dream each night?",
        "What if children aged mentally at twice the rate they do now?",
        "What if all animals lived in peace with no predator-prey relationships?",
        "What if humans evolved with chlorophyll in their skin?",
        "What if music had visual colors everyone could see?",
        "What if clouds could be harvested as building material?",
        "What if humans could safely explore the deepest ocean trenches?",
        "What if all mythological creatures were real but in hiding?",
        "What if the moon was actually an ancient artificial satellite?",
        
        // India-specific scenarios (100)
        "What if India had never been partitioned?",
        "What if the Himalayas were twice as tall?",
        "What if India won every Cricket World Cup?",
        "What if the British had never colonized India?",
        "What if dinosaurs still roamed the Indian subcontinent?",
        "What if the Indus Valley Civilization never declined?",
        "What if India became the first country to colonize Mars?",
        "What if everyone in India could read minds?",
        "What if the monsoon season lasted all year in India?",
        "What if Indians could naturally breathe underwater?",
        "What if electricity was discovered in ancient India?",
        "What if Indians lived for 200 years?",
        "What if all plants in India could talk?",
        "What if India abolished currency and used a barter system?",
        "What if the Taj Mahal was built on the moon?",
        "What if smartphones were invented in ancient India?",
        "What if all Indians had natural wings?",
        "What if aliens made first contact in India in 1950?",
        "What if every Indian family had a personal robot?",
        "What if Indians could photosynthesize like plants?",
        "What if the Indian Ocean was freshwater?",
        "What if all Indians were nocturnal?",
        "What if animals in India could speak human languages?",
        "What if India had rings like Saturn?",
        "What if the Mauryan Empire never fell?",
        "What if time travel was discovered by Indian scientists?",
        "What if Indians could shapeshift?",
        "What if India was the world's only superpower?",
        "What if magic was real in India?",
        "What if teleportation was invented in India?",
        "What if the Himalayan glaciers never melted?",
        "What if Indians had four arms like deity depictions?",
        "What if the sun never set on India?",
        "What if everyone in India had an identical twin?",
        "What if Indians could control the weather?",
        "What if the Indian internet became sentient?",
        "What if all Indians had unique superpowers?",
        "What if Indians could regenerate limbs?",
        "What if India was completely underwater?",
        "What if India united with all its neighboring countries?",
        "What if gravity was twice as strong in India?",
        "What if the Ganges river flowed backwards?",
        "What if India developed teleportation technology in 1947?",
        "What if cows in India could fly?",
        "What if the Indian rupee became the global reserve currency?",
        "What if the Mumbai skyline reached into space?",
        "What if India was the first to make contact with aliens?",
        "What if everyone in India could communicate telepathically?",
        "What if the Thar Desert became a tropical rainforest?",
        "What if India discovered unlimited clean energy?",
        "What if every Indian household had a personal AI assistant in 1980?",
        "What if Delhi was built entirely underwater?",
        "What if the Himalayas suddenly disappeared overnight?",
        "What if humans in India could hibernate like bears?",
        "What if Indians could travel through different dimensions?",
        "What if India's ancient texts contained future technology blueprints?",
        "What if artificial intelligence was first invented in ancient India?",
        "What if Indians aged backwards?",
        "What if all Indians could see one day into the future?",
        "What if India discovered a portal to another habitable planet?",
        "What if the Indian climate never changed with seasons?",
        "What if India became a completely cashless society in 1980?",
        "What if the Taj Mahal could speak and share its history?",
        "What if India developed human cloning technology first?",
        "What if the stars were twice as bright over India?",
        "What if India's wildlife could use technology?",
        "What if India discovered the fountain of youth?",
        "What if time moved slower in India than the rest of the world?",
        "What if the moon was colonized exclusively by Indians?",
        "What if Indian classical music could physically heal people?",
        "What if India never adopted the internet?",
        "What if Indian cinema actors became real-life superheroes?",
        "What if India had a 30-hour day?",
        "What if India discovered ancient alien technology?",
        "What if all Indians could breathe underwater indefinitely?",
        "What if India's ancient temples were actually spaceships?",
        "What if Indian spices gave people temporary superpowers?",
        "What if Indians could communicate with animals?",
        "What if the boundaries between India's states changed daily?",
        "What if India was the world's first digital democracy?",
        "What if dreams could be recorded and shared in India?",
        "What if India developed the world's first functional time machine?",
        "What if there were 15 seasons in India instead of 6?",
        "What if India's monuments could teleport around the country?",
        "What if Indian classical dance could summon deities?",
        "What if India became a space-faring civilization in 1000 BCE?",
        "What if India's mythology was historically accurate?",
        "What if the Arabian Sea and Bay of Bengal swapped places?",
        "What if India's streets were paved with precious gems?",
        "What if Indians could grow additional limbs at will?",
        "What if the Ramayana and Mahabharata happened in modern India?",
        "What if India's food never spoiled?",
        "What if there were portals connecting all major Indian cities?",
        "What if rivers in India flowed with nourishing elixirs?",
        "What if India's population could vote on laws directly every day?",
        "What if plants in India grew 100 times faster?"
    ];
    
    // Get suggestions from localStorage or use defaults
    const getWhatIfSuggestions = () => {
        const savedSuggestions = localStorage.getItem('whatIfSuggestions');
        if (savedSuggestions) {
            return JSON.parse(savedSuggestions);
        }
        // Initialize with default suggestions if none exist
        localStorage.setItem('whatIfSuggestions', JSON.stringify(defaultWhatIfSuggestions));
        return defaultWhatIfSuggestions;
    };
    
    // Save a new suggestion to localStorage
    const saveNewSuggestion = (suggestion) => {
        if (!suggestion.startsWith("What if")) {
            suggestion = "What if " + suggestion;
        }
        if (!suggestion.endsWith("?")) {
            suggestion = suggestion + "?";
        }
        
        const suggestions = getWhatIfSuggestions();
        // Check if suggestion already exists
        if (!suggestions.includes(suggestion)) {
            suggestions.push(suggestion);
            localStorage.setItem('whatIfSuggestions', JSON.stringify(suggestions));
            return true;
        }
        return false;
    };
    
    // Function to get random suggestions
    const getRandomSuggestions = (count = 4) => {
        const suggestions = getWhatIfSuggestions();
        const shuffled = [...suggestions].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };
    
    // Function to update suggestion buttons with proper layout
    const updateSuggestionButtons = () => {
        const suggestionButtonsContainer = document.querySelector('.suggestion-buttons');
        if (!suggestionButtonsContainer) return;
        
        // Clear existing buttons
        suggestionButtonsContainer.innerHTML = '';
        
        // Add new random suggestions - fewer on mobile
        const buttonCount = isMobile ? 2 : 4; // Fewer buttons on mobile
        const suggestions = getRandomSuggestions(buttonCount);
        suggestions.forEach(suggestion => {
            const button = document.createElement('button');
            button.className = 'suggestion-btn';
            
            // Use shorter text for mobile
            if (isMobile && suggestion.length > 40) {
                button.textContent = suggestion.substring(0, 37) + '...';
                button.title = suggestion; // Full text on hover
            } else {
                button.textContent = suggestion;
            }
            
            button.addEventListener('click', () => {
                scenarioInput.value = suggestion;
                generateNews(suggestion);
            });
            suggestionButtonsContainer.appendChild(button);
        });

        // Create container for action buttons
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.className = 'action-buttons-container';
        
        // Add a refresh button to get new suggestions
        const refreshButton = document.createElement('button');
        refreshButton.className = 'suggestion-refresh-btn';
        refreshButton.textContent = 'NEW IDEAS';
        refreshButton.addEventListener('click', updateSuggestionButtons);
        actionButtonsContainer.appendChild(refreshButton);
        
        // Add a button to add the current input as a suggestion
        const addButton = document.createElement('button');
        addButton.className = 'suggestion-add-btn';
        addButton.textContent = '+ ADD CURRENT';
        addButton.addEventListener('click', () => {
            const scenario = scenarioInput.value.trim();
            // Only save if there's actual user input and it's not the placeholder
            if (scenario && scenario !== scenarioInput.placeholder) {
                if (saveNewSuggestion(scenario)) {
                    UI.showError('Scenario added to suggestions!');
                    updateSuggestionButtons();
                } else {
                    UI.showError('This suggestion already exists!');
                }
            } else {
                UI.showError('Please enter a scenario first.');
            }
        });
        actionButtonsContainer.appendChild(addButton);
        
        // Add styles for the action buttons container
        const buttonStyles = document.createElement('style');
        buttonStyles.textContent = `
            .action-buttons-container {
                display: flex;
                justify-content: center;
                gap: 12px;
                width: 100%;
                margin-top: 16px;
            }
            
            .action-buttons-container button {
                flex: 0 1 auto;
                min-width: 120px;
                padding: 10px 20px;
                font-size: 0.9rem;
                font-weight: 500;
                border: 1px solid #ccc;
                border-radius: 4px;
                background: #fff;
                color: #000;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .action-buttons-container button:hover {
                background: #000;
                color: #fff;
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                border-color: #000;
            }
            
            @media (max-width: 768px) {
                .action-buttons-container {
                    gap: 8px;
                    margin-top: 12px;
                }
                
                .action-buttons-container button {
                    min-width: 100px;
                    padding: 8px 16px;
                    font-size: 0.85rem;
                }
            }
        `;
        document.head.appendChild(buttonStyles);
        
        // Append the action buttons container
        suggestionButtonsContainer.appendChild(actionButtonsContainer);
    };
    
    // Generate a prompt for the image generation based on article content
    const generateImagePrompt = async (scenario, content, style) => {
        // Create a cache key using scenario and headline
        const cacheKey = `${scenario}_${content.headline}_${style}`;
        
        // Check if we already have a prompt for this scenario and style
        if (imagePromptCache.has(cacheKey)) {
            console.log('Using cached image prompt');
            return imagePromptCache.get(cacheKey);
        }

        // Extract the first paragraph text from content, handling both plain text and HTML
        let firstParagraph = '';
        if (content.content) {
            // If the content includes HTML tags, extract text from it
            if (content.content.includes('<p>')) {
                // Create a temporary div to parse HTML content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content.content;
                // Get text from the first paragraph
                const firstP = tempDiv.querySelector('p');
                firstParagraph = firstP ? firstP.textContent : content.content.split('\n')[0];
            } else {
                // For plain text, just get the first paragraph
                firstParagraph = content.content.split('\n')[0];
            }
        }

        // Create a prompt for Gemini to generate the image prompt
        const promptGenerationPrompt = `
        Based on the following news article from an alternate reality, generate a prompt for an image generation AI.
        
        Scenario: "${scenario}"
        Headline: "${content.headline}"
        Article Content (first paragraph): "${firstParagraph}"
        
        The image should:
        1. Visually represent the key elements of the news story
        2. NOT contain any text, words, or letters (the image generation AI struggles with text)
        3. Reflect the ${style} newspaper style (${getStyleDescription(style)})
        4. Be photorealistic and detailed
        5. Focus on the visual impact of the scenario
        
        The prompt should start with "Generate an image of" and be detailed but concise (max 60 words).
        Return only the image generation prompt without any explanations, introductions, or quotation marks.
        `;

        try {
            // Call serverless API to generate the image prompt
            const response = await fetch(GENERATE_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: promptGenerationPrompt
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate image prompt');
            }

            const data = await response.json();
            const imagePrompt = data.candidates[0].content.parts[0].text.trim();
            
            console.log('Generated image prompt:', imagePrompt);
            
            // Store the prompt in the cache
            imagePromptCache.set(cacheKey, imagePrompt);
            
            // Limit cache size to 20 entries to avoid memory issues
            if (imagePromptCache.size > 20) {
                const oldestKey = imagePromptCache.keys().next().value;
                imagePromptCache.delete(oldestKey);
            }
            
            return imagePrompt;
        } catch (error) {
            console.error('Error generating image prompt:', error);
            throw error;
        }
    };

    // Get description of newspaper style for image prompt
    const getStyleDescription = (style) => {
        switch (style) {
            case 'monochrome':
                return 'vintage black and white, high contrast, grainy texture, 1940s press photograph style';
            case 'retro':
                return 'sepia-toned, vintage 1970s newspaper photograph, slightly faded, warm tones';
            case 'modern':
                return 'contemporary high-resolution news photograph, crisp details, realistic colors';
            case 'futuristic':
                return 'sci-fi aesthetic, high-tech, sleek, with subtle blue tones and futuristic elements';
            default:
                return 'vintage black and white, high contrast, grainy texture, 1940s press photograph style';
        }
    };

    // Generate image using serverless API
    const generateImage = async (prompt) => {
        const response = await fetch(IMAGE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate image');
        }

        const data = await response.json();
        
        // Extract image data from new API response format
        if (data.imageBase64) {
            return {
                data: data.imageBase64,
                mimeType: 'image/png'
            };
        }
        
        // Fallback for older API response format
        if (data.candidates && data.candidates.length > 0) {
            const candidate = data.candidates[0];
            if (candidate.content && candidate.content.parts) {
                for (const part of candidate.content.parts) {
                    if (part.inlineData) {
                        return {
                            data: part.inlineData.data,
                            mimeType: part.inlineData.mimeType
                        };
                    }
                }
            }
        }
        
        throw new Error('No image found in API response');
    };
    
    // Generate the news article
    const generateNews = async (scenario) => {
        UI.showLoading();
        
        try {
            let content;
            
            // Try to use the API
            try {
                content = await API.generateNews(scenario);
            } catch (error) {
                console.error('API error:', error);
                UI.showError(error.message || 'Failed to generate content. Using fallback content.');
                content = generateMockContent(scenario);
                // Save to history if using mock content (API.generateNews already saves to history)
                saveArticleToHistory(scenario, content);
            }
            
            // Update the UI with the content
            UI.updateArticle(content);
            UI.updateComments(content.comments);
            
            // Hide loading and show the news
            UI.hideLoading();
            UI.showNews();
            
        } catch (error) {
            console.error('Error generating news:', error);
            UI.showError('An unexpected error occurred. Please try again.');
            UI.hideLoading();
        }
    };
    
    // Debounce function to prevent rapid firing of events
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };
    
    // Initialize the application
    const init = () => {
        // Add meta viewport tag for responsive design if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(viewportMeta);
        }
        
        // Set a vintage date on initialization
        setNewspaperDate();
        
        // Set a vintage-appropriate newspaper name
        newspaperName.textContent = generateNewspaperName();
        
        // Set up event listeners
        generateBtn.addEventListener('click', () => {
            const scenario = scenarioInput.value.trim();
            if (scenario) {
                generateNews(scenario);
            } else {
                // Use the current placeholder text if input is empty
                generateNews(scenarioInput.placeholder);
            }
        });
        
        scenarioInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const scenario = scenarioInput.value.trim();
                if (scenario) {
                    generateNews(scenario);
                } else {
                    // Use the current placeholder text if input is empty
                    generateNews(scenarioInput.placeholder);
                }
            }
        });
        
        // Set up dynamic placeholder text for input field
        setupDynamicPlaceholder();
        
        // Create settings container with mobile-optimized layout
        const settingsContainer = document.createElement('div');
        settingsContainer.className = 'settings-container';
        settingsContainer.innerHTML = `
            <div class="settings-header">
                <h3>Settings</h3>
                <button id="toggle-settings-btn">Hide</button>
            </div>
            <div id="settings-content" class="${isMobile ? 'mobile-settings' : ''}">
                <div class="style-toggle">
                    <label for="style-select">Newspaper Style:</label>
                    <select id="style-select">
                        <option value="monochrome">Vintage Monochrome</option>
                        <option value="retro">Retro Newspaper</option>
                        <option value="modern">Modern Blog</option>
                        <option value="futuristic">Futuristic Hologram</option>
                    </select>
                </div>
                
                <div class="suggestions-manager">
                    <h4>Manage Suggestions</h4>
                    <p>You have <span id="suggestion-count">0</span> custom "what if" scenarios.</p>
                    <div class="suggestions-actions">
                        <button id="view-suggestions-btn">View All</button>
                        <button id="reset-suggestions-btn">Reset to Default</button>
                    </div>
                    <div id="suggestions-list" class="hidden ${isMobile ? 'mobile-suggestions-list' : ''}"></div>
                </div>
            </div>
        `;
        
        document.querySelector('.container').appendChild(settingsContainer);
        
        // Toggle settings visibility
        function toggleSettings() {
            const settingsContent = document.getElementById('settings-content');
            const toggleBtn = document.getElementById('toggle-settings-btn');
            
            if (settingsContent.classList.contains('hidden-content')) {
                // Show content
                settingsContent.classList.remove('hidden-content');
                toggleBtn.textContent = 'Hide';
                localStorage.setItem('settingsVisible', 'true');
            } else {
                // Hide content
                settingsContent.classList.add('hidden-content');
                toggleBtn.textContent = 'Show';
                localStorage.setItem('settingsVisible', 'false');
            }
        }
        
        // Add toggle functionality for settings
        document.getElementById('toggle-settings-btn').addEventListener('click', toggleSettings);
        
        // Style toggle functionality
        document.getElementById('style-select').addEventListener('change', (e) => {
            const newspaper = document.querySelector('.newspaper');
            newspaper.classList.remove('retro', 'modern', 'futuristic');
            newspaper.classList.add(e.target.value);
            
            // Save the selected style to localStorage
            localStorage.setItem('newspaperStyle', e.target.value);
        });
        
        // Load saved style from localStorage
        const savedStyle = localStorage.getItem('newspaperStyle');
        if (savedStyle) {
            document.getElementById('style-select').value = savedStyle;
            document.querySelector('.newspaper').classList.add(savedStyle);
        } else {
            document.querySelector('.newspaper').classList.add('monochrome');
        }
        
        // Add suggestion buttons with mobile optimization
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = `suggestions ${isMobile ? 'mobile-suggestions' : ''}`;
        suggestionsContainer.innerHTML = `
            <p>Need ideas? Try these:</p>
            <div class="suggestion-buttons ${isMobile ? 'mobile-suggestion-buttons' : ''}"></div>
        `;
        
        // Insert suggestions after the input container
        document.querySelector('.input-container').parentNode.insertBefore(
            suggestionsContainer, 
            document.querySelector('.input-container').nextSibling
        );
        
        // Initialize suggestion buttons with fewer buttons on mobile
        updateSuggestionButtons();
        
        // Add share and fact check buttons to the article with mobile optimization
        const articleActionsContainer = document.createElement('div');
        articleActionsContainer.className = `article-actions ${isMobile ? 'mobile-article-actions' : ''}`;
        articleActionsContainer.innerHTML = `
            <button id="download-pdf-btn">Download PDF</button>
            <button id="share-btn">Share Article</button>
            <button id="fact-check-btn">Reality Check</button>
        `;
        
        // Insert actions after the article
        document.querySelector('.article').appendChild(articleActionsContainer);
        
        // PDF download button functionality
        document.getElementById('download-pdf-btn').addEventListener('click', () => {
            generatePDF();
        });
        
        // Share button functionality
        document.getElementById('share-btn').addEventListener('click', () => {
            const articleText = `${articleHeadline.textContent}\n${articleByline.textContent}\n${articleContent.textContent.replace(/<\/?p>/g, '\n')}`;
            
            // Try to use the Web Share API if available (especially useful on mobile)
            if (navigator.share) {
                navigator.share({
                    title: articleHeadline.textContent,
                    text: articleText
                }).catch(err => {
                    console.error('Error sharing:', err);
                    // Fallback to clipboard
                    copyToClipboard(articleText);
                });
            } else {
                // Fallback to clipboard
                copyToClipboard(articleText);
            }
        });
        
        // Fact check button functionality
        document.getElementById('fact-check-btn').addEventListener('click', async () => {
            const scenario = scenarioInput.value.trim();
            if (!scenario) {
                UI.showError('No scenario to fact check.');
                return;
            }
            
            // Remove any existing fact check
            document.querySelectorAll('.fact-check').forEach(el => el.remove());
            
            // Show loading indicator for fact check
            const factCheckLoading = document.createElement('div');
            factCheckLoading.className = 'fact-check loading';
            factCheckLoading.innerHTML = '<h3>Reality Check</h3><p>Analyzing reality differences...</p>';
            document.querySelector('.article').appendChild(factCheckLoading);
            
            try {
                // Generate a fact check using serverless API
                const factCheckPrompt = `
                You are a reality analyst comparing our current world with an alternate reality where "${scenario}".
                
                Provide a brief, factual explanation (2-3 paragraphs) of how our current reality in India differs from this alternate reality.
                Include specific, accurate details about current India that contrast with what was described in the alternate reality.
                Reference actual Indian cities, landmarks, policies, or cultural elements when relevant.
                Be educational and informative while maintaining a slightly humorous tone.
                Keep your response under 200 words and focus on the most significant differences.
                `;
                
                // Set up timeout for the API call
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
                
                // Call the serverless API
                const response = await fetch(GENERATE_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        prompt: factCheckPrompt
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }
                
                const data = await response.json();
                const factCheck = data.candidates[0].content.parts[0].text.trim();
                
                updateFactCheck(factCheck);
            } catch (error) {
                console.error('Error generating fact check:', error);
                // Fallback content if API fails
                const factCheck = "In our reality, things work differently. This alternate timeline diverges from our own in several key ways. Remember, this is just a fun thought experiment!";
                updateFactCheck(factCheck);
            }
        });
        
        // Helper function to update the fact check content
        const updateFactCheck = (factCheck) => {
            // Remove loading indicator if it exists
            document.querySelectorAll('.fact-check.loading').forEach(el => el.remove());
            
            // Format the fact check text with paragraphs
            const formattedFactCheck = factCheck
                .split(/\n\n+/)
                .map(paragraph => `<p>${paragraph.trim()}</p>`)
                .join('');
            
            const factCheckDiv = document.createElement('div');
            factCheckDiv.className = 'fact-check';
            factCheckDiv.innerHTML = `<h3>Reality Check</h3>${formattedFactCheck}`;
            document.querySelector('.article').appendChild(factCheckDiv);
        };
        
        // Display history
        displayHistory();
        
        // Load history toggle state
        loadHistoryToggleState();
        
        // Load settings toggle state
        loadSettingsToggleState();
        
        // Listen for orientation changes on mobile
        if (isMobile) {
            window.addEventListener('orientationchange', handleOrientationChange);
            window.addEventListener('resize', debounce(handleResize, 250));
        }
    };
    
    // Load history toggle state from localStorage
    const loadHistoryToggleState = () => {
        const historyContent = document.getElementById('history-content');
        const toggleBtn = document.getElementById('toggle-history-btn');
        
        if (historyContent) {
            // Get saved state (default to visible if not saved)
            const isVisible = localStorage.getItem('historyVisible') !== 'false';
            
            if (!isVisible) {
                historyContent.classList.add('hidden-content');
                toggleBtn.textContent = 'Show';
            } else {
                historyContent.classList.remove('hidden-content');
                toggleBtn.textContent = 'Hide';
            }
        }
    };
    
    // Load settings toggle state from localStorage
    const loadSettingsToggleState = () => {
        const settingsContent = document.getElementById('settings-content');
        const toggleBtn = document.getElementById('toggle-settings-btn');
        
        if (settingsContent) {
            // Get saved state (default to visible if not saved)
            const isVisible = localStorage.getItem('settingsVisible') !== 'false';
            
            if (!isVisible) {
                settingsContent.classList.add('hidden-content');
                toggleBtn.textContent = 'Show';
            } else {
                settingsContent.classList.remove('hidden-content');
                toggleBtn.textContent = 'Hide';
            }
        }
    };
    
    // Helper function to copy text to clipboard
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            UI.showError('Article copied to clipboard! Share it with your friends.');
        }).catch(err => {
            console.error('Failed to copy:', err);
            UI.showError('Failed to copy article to clipboard.');
        });
    };
    
    // Note: API keys are now handled server-side via environment variables
    
    // Helper function to generate the prompt for the Gemini API
    const generatePrompt = (scenario) => {
        // Get era information for context
        const vintageYear = window.vintageDate ? window.vintageDate.getFullYear() : 1970;
        const formattedDate = window.vintageDate ? window.vintageDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        }) : 'January 1, 1970';
        
        // Era-specific context to guide the article tone and style
        let eraContext;
        if (vintageYear < 1950) {
            eraContext = `This article is from ${formattedDate}, during the pre-independence or early independence era of India. The language should reflect formal British-influenced journalism of that period.`;
        } else if (vintageYear < 1970) {
            eraContext = `This article is from ${formattedDate}, during the early decades after Indian independence. The language should reflect the optimistic nationalism of the Nehru era.`;
        } else if (vintageYear < 1990) {
            eraContext = `This article is from ${formattedDate}, during the 1970s-1980s in India. The language should reflect the journalistic style of that era.`;
        } else {
            eraContext = `This article is from ${formattedDate}, during the 1990s or early 2000s in India. The language should reflect the economic liberalization era.`;
        }

        return `
            You are a creative writer tasked with creating a fictional news article from an alternate reality where "${scenario}". 
            
            ${eraContext} The article should be set in India or involve India and its neighboring countries (Pakistan, Bangladesh, Nepal, Bhutan, Sri Lanka, etc.) as the main focus. Include specific details like Indian cities, landmarks, cultural elements, and Indian names for people and organizations that would be historically accurate for ${formattedDate}.
            
            The article should feel like a professional news piece with a serious tone, unless the scenario implies a humorous context. Include specific details like names, dates, and locations relevant to the alternate reality in an Indian context.
            
            Format your response as a JSON object with the following structure:
            {
                "headline": "A catchy headline for the news article (15-25 words)",
                "byline": "Author name and title (e.g., 'By Rajesh Kumar | Delhi Correspondent')",
                "content": "The main article content with 4-6 paragraphs, each 2-4 sentences long. Include at least two quotes from fictional people in this alternate reality. Make sure to reference Indian cities, culture, or neighboring countries.",
                "comments": [
                    {
                        "author": "Username of commenter (use Indian-inspired usernames)",
                        "text": "A quirky comment reacting to the article (1-2 sentences)",
                        "meta": "Posted X hours ago • Y likes (e.g., 'Posted 2 hours ago • 157 likes')"
                    }
                ]
            }
            
            Make sure to include exactly 4 comments total, with diverse perspectives from people living in this alternate reality.
            The response must be a valid JSON object that can be parsed with JSON.parse().
            Do not include any text before or after the JSON object.
            `;
    };
    
    // Show loading indicator
    const showLoadingIndicator = () => {
        loadingElement.classList.remove('hidden');
        newsContainer.classList.add('hidden');
    };
    
    // Helper function to set up dynamic placeholder text
    const setupDynamicPlaceholder = () => {
        // Get a set of random scenarios for placeholders (different from suggestion buttons)
        const allSuggestions = getWhatIfSuggestions();
        const placeholderSuggestions = [...allSuggestions]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10); // Get 10 random suggestions for placeholders
        
        let currentPlaceholderIndex = 0;
        
        // Set initial placeholder
        scenarioInput.placeholder = placeholderSuggestions[0];
        
        // Change placeholder every 5 seconds
        setInterval(() => {
            currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholderSuggestions.length;
            
            // Fade out effect
            scenarioInput.style.opacity = '0.3';
            
            setTimeout(() => {
                // Update placeholder
                scenarioInput.placeholder = placeholderSuggestions[currentPlaceholderIndex];
                
                // Fade in effect
                scenarioInput.style.opacity = '1';
            }, 300);
        }, 5000);
        
        // Reset opacity on focus
        scenarioInput.addEventListener('focus', () => {
            scenarioInput.style.opacity = '1';
        });
    };
    
    // Function to update the UI when device orientation changes
    const handleOrientationChange = () => {
        // Let the browser adjust first
        setTimeout(() => {
            const newIsMobile = window.innerWidth <= 768;
            if (newIsMobile !== isMobile) {
                // Reload the page to apply correct layout
                window.location.reload();
            }
        }, 300);
    };
    
    // Function to handle window resize
    const handleResize = () => {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            // Reload the page to apply correct layout
            window.location.reload();
        }
    };
    
    // Function to generate and download a PDF of the article
    const generatePDF = async () => {
        // Show loading message
        UI.showError('Preparing PDF for download...');
        
        try {
            // Load html2pdf library if not already loaded
            if (typeof html2pdf === 'undefined') {
                await new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                }).catch(() => {
                    throw new Error('Failed to load PDF generator. Please check your internet connection and try again.');
                });
            }
            
            // Create a container for the PDF content
            const pdfContainer = document.createElement('div');
            pdfContainer.id = 'pdf-container';
            pdfContainer.style.padding = '0.5in';
            pdfContainer.style.backgroundColor = '#FFFFFF';
            pdfContainer.style.width = '8in'; // Letter size width (8.5in) minus margins
            pdfContainer.style.minHeight = '10in'; // Letter size height (11in) minus margins
            
            // Create the newspaper header
            const headerDiv = document.createElement('div');
            headerDiv.style.textAlign = 'center';
            headerDiv.style.marginBottom = '10px'; // Reduced margin
            headerDiv.style.borderBottom = '2px solid #000';
            headerDiv.style.paddingBottom = '5px'; // Reduced padding
            headerDiv.style.paddingTop = '0.2in';
            headerDiv.style.paddingLeft = '0.5in';
            headerDiv.style.paddingRight = '0.5in';
            
            // Newspaper name
            const nameElement = document.createElement('h1');
            nameElement.textContent = newspaperName.textContent;
            nameElement.style.fontSize = '24px'; // Smaller font
            nameElement.style.fontWeight = 'bold';
            nameElement.style.margin = '0 0 3px 0'; // Reduced margin
            nameElement.style.textTransform = 'uppercase';
            nameElement.style.fontFamily = 'Times New Roman, serif';
            
            // Date
            const dateElement = document.createElement('p');
            dateElement.textContent = newspaperDate.textContent;
            dateElement.style.fontSize = '12px'; // Smaller font
            dateElement.style.fontStyle = 'italic';
            dateElement.style.margin = '0 0 3px 0'; // Reduced margin
            
            headerDiv.appendChild(nameElement);
            headerDiv.appendChild(dateElement);
            
            // Create article section with content immediately following the header
            const articleDiv = document.createElement('div');
            articleDiv.style.marginTop = '0';
            articleDiv.style.marginBottom = '15px'; // Reduced margin
            articleDiv.style.paddingLeft = '0.4in'; // Slightly reduced padding
            articleDiv.style.paddingRight = '0.4in'; // Slightly reduced padding
            
            // Article headline
            const headlineElement = document.createElement('h2');
            headlineElement.textContent = articleHeadline.textContent;
            headlineElement.style.fontSize = '20px'; // Smaller font
            headlineElement.style.fontWeight = 'bold';
            headlineElement.style.marginTop = '5px';
            headlineElement.style.marginBottom = '8px'; // Reduced margin
            headlineElement.style.textTransform = 'uppercase';
            
            // Article byline
            const bylineElement = document.createElement('p');
            bylineElement.textContent = articleByline.textContent;
            bylineElement.style.fontSize = '14px';
            bylineElement.style.fontStyle = 'italic';
            bylineElement.style.marginBottom = '15px';
            bylineElement.style.borderBottom = '1px solid #ccc';
            bylineElement.style.paddingBottom = '8px';
            
            // Article image (if available)
            let imageElement = null;
            if (!articleImageContainer.classList.contains('hidden') && articleImage.src) {
                // Create a div to contain the image and caption
                const imageContainerElement = document.createElement('div');
                imageContainerElement.style.marginBottom = '10px'; // Reduced margin
                imageContainerElement.style.textAlign = 'center';
                imageContainerElement.style.backgroundColor = '#FFFFFF'; // Pure white background
                
                // Create the image element
                imageElement = document.createElement('img');
                imageElement.src = articleImage.src;
                
                // Set image styles
                imageElement.style.maxWidth = '80%'; // Slightly smaller image
                imageElement.style.maxHeight = '220px'; // Reduced height
                imageElement.style.border = '1px solid #ccc';
                imageElement.style.marginBottom = '4px'; // Reduced margin
                imageElement.style.backgroundColor = '#FFFFFF'; // Pure white for image
                
                // Create the caption element
                const captionElement = document.createElement('p');
                captionElement.textContent = imageCaption.textContent;
                captionElement.style.fontSize = '10px'; // Smaller caption
                captionElement.style.fontStyle = 'italic';
                captionElement.style.margin = '0 0 3px 0'; // Reduced margin
                captionElement.style.backgroundColor = '#FFFFFF'; // Pure white for caption
                
                // Add image and caption to the container
                imageContainerElement.appendChild(imageElement);
                imageContainerElement.appendChild(captionElement);
                
                // Add the image container to the article div
                articleDiv.appendChild(imageContainerElement);
            }
            
            // Article content
            const contentContainer = document.createElement('div');
            contentContainer.style.columnCount = '2';
            contentContainer.style.columnGap = '10px'; // Reduced gap for better space usage
            contentContainer.style.textAlign = 'justify';
            contentContainer.style.marginTop = '0';
            contentContainer.style.marginBottom = '10px'; // Added bottom margin
            contentContainer.style.backgroundColor = '#FFFFFF';
            
            // Clone the article content
            const contentElement = document.createElement('div');
            contentElement.innerHTML = articleContent.innerHTML;
            contentElement.style.fontSize = '11px'; // Slightly smaller font size
            contentElement.style.lineHeight = '1.3'; // Tighter line height
            contentElement.style.backgroundColor = '#FFFFFF';
            
            contentContainer.appendChild(contentElement);
            
            // Add elements to article div
            articleDiv.appendChild(headlineElement);
            articleDiv.appendChild(bylineElement);
            articleDiv.appendChild(contentContainer);
            
            // Create comments section
            const commentsDiv = document.createElement('div');
            commentsDiv.style.marginTop = '20px';
            commentsDiv.style.borderTop = '2px solid #000';
            commentsDiv.style.paddingTop = '10px';
            commentsDiv.style.paddingLeft = '0.5in';
            commentsDiv.style.paddingRight = '0.5in';
            commentsDiv.style.paddingBottom = '0.5in';
            // Remove the forced page break
            // commentsDiv.className = 'pagebreak'; // Force page break before comments
            
            // Comments header
            const commentsHeader = document.createElement('h3');
            commentsHeader.textContent = 'Reader Comments';
            commentsHeader.style.fontSize = '16px';
            commentsHeader.style.marginBottom = '10px';
            commentsHeader.style.borderBottom = '1px solid #ccc';
            commentsHeader.style.paddingBottom = '5px';
            
            commentsDiv.appendChild(commentsHeader);
            
            // Add comments
            const comments = document.querySelectorAll('.comment');
            comments.forEach(comment => {
                const commentDiv = document.createElement('div');
                commentDiv.style.marginBottom = '5px'; // Reduced margin
                commentDiv.style.padding = '5px'; // Reduced padding
                commentDiv.style.backgroundColor = '#f9f9f9';
                commentDiv.style.border = '1px solid #eee';
                
                // Get comment parts
                const author = comment.querySelector('.comment-author').textContent;
                const text = comment.querySelector('.comment-text').textContent;
                const meta = comment.querySelector('.comment-meta').textContent;
                
                // Create comment elements
                const authorEl = document.createElement('div');
                authorEl.textContent = author;
                authorEl.style.fontWeight = 'bold';
                authorEl.style.marginBottom = '2px'; // Reduced margin
                authorEl.style.fontSize = '11px'; // Smaller font
                
                const textEl = document.createElement('div');
                textEl.textContent = text;
                textEl.style.marginBottom = '2px'; // Reduced margin
                textEl.style.fontSize = '11px'; // Smaller font
                
                const metaEl = document.createElement('div');
                metaEl.textContent = meta;
                metaEl.style.fontSize = '9px'; // Smaller font
                metaEl.style.color = '#666';
                metaEl.style.fontStyle = 'italic';
                
                commentDiv.appendChild(authorEl);
                commentDiv.appendChild(textEl);
                commentDiv.appendChild(metaEl);
                
                commentsDiv.appendChild(commentDiv);
            });
            
            // Create footer with vintage-appropriate text
            const footerDiv = document.createElement('div');
            footerDiv.style.marginTop = '30px';
            footerDiv.style.borderTop = '1px solid #000';
            footerDiv.style.paddingTop = '10px';
            footerDiv.style.fontSize = '12px';
            footerDiv.style.textAlign = 'center';
            footerDiv.style.color = '#666';
            footerDiv.style.paddingLeft = '0.5in';
            footerDiv.style.paddingRight = '0.5in';
            footerDiv.style.paddingBottom = '0.5in';

            // Use vintage-appropriate publishing info
            const vintageYear = window.vintageDate.getFullYear();
            let publisherInfo;

            if (vintageYear < 1950) {
                publisherInfo = `${newspaperName.textContent} • Published by United Press Syndicate`;
            } else if (vintageYear < 1970) {
                publisherInfo = `${newspaperName.textContent} • A National News Service Publication`;
            } else if (vintageYear < 1990) {
                publisherInfo = `${newspaperName.textContent} • Member of the Indian Press Association`;
            } else {
                publisherInfo = `${newspaperName.textContent} • All Rights Reserved`;
            }

            const footerText = document.createElement('p');
            footerText.textContent = publisherInfo;
            footerText.style.margin = '0';

            const disclaimerText = document.createElement('p');
            disclaimerText.textContent = 'This newspaper is preserved for historical and educational purposes.';
            disclaimerText.style.margin = '5px 0 0 0';
            disclaimerText.style.fontSize = '10px';

            footerDiv.appendChild(footerText);
            footerDiv.appendChild(disclaimerText);
            
            // Assemble the PDF container
            pdfContainer.appendChild(headerDiv);
            pdfContainer.appendChild(articleDiv);
            pdfContainer.appendChild(commentsDiv);
            pdfContainer.appendChild(footerDiv);
            
            // Get current style for PDF generation
            const currentStyle = document.getElementById('style-select').value;
            
            // Apply theme-specific styling
            if (currentStyle === 'monochrome') {
                pdfContainer.style.backgroundColor = '#FFFFFF';
                contentContainer.style.fontFamily = 'Georgia, serif';
                nameElement.style.fontFamily = 'Times New Roman, serif';
                nameElement.style.letterSpacing = '4px';
                if (imageElement) {
                    imageElement.style.filter = 'grayscale(100%)';
                    imageElement.style.border = '2px solid #000';
                    imageElement.style.backgroundColor = '#FFFFFF';
                }
            } else if (currentStyle === 'modern') {
                pdfContainer.style.fontFamily = 'Arial, sans-serif';
                pdfContainer.style.backgroundColor = '#FFFFFF';
                nameElement.style.color = '#1a73e8';
                headlineElement.style.color = '#1a73e8';
                nameElement.style.fontFamily = 'Arial, sans-serif';
                headlineElement.style.fontFamily = 'Arial, sans-serif';
                if (imageElement) {
                    imageElement.style.borderRadius = '4px';
                    imageElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    imageElement.style.backgroundColor = '#FFFFFF';
                }
            } else if (currentStyle === 'retro') {
                pdfContainer.style.backgroundColor = '#FFFFFF';
                if (imageElement) {
                    imageElement.style.filter = 'sepia(70%)';
                    imageElement.style.border = '1px solid #d3c7a7';
                    imageElement.style.padding = '5px';
                    imageElement.style.backgroundColor = '#FFFFFF';
                }
            } else if (currentStyle === 'futuristic') {
                pdfContainer.style.backgroundColor = '#FFFFFF';
                pdfContainer.style.color = '#000000';
                pdfContainer.style.fontFamily = 'Arial, sans-serif';
                nameElement.style.color = '#000000';
                headlineElement.style.color = '#000000';
                headerDiv.style.borderBottom = '2px solid #000000';
                commentsDiv.style.borderTop = '2px solid #000000';
                footerDiv.style.borderTop = '1px solid #000000';
                if (imageElement) {
                    imageElement.style.border = '1px solid #000000';
                    imageElement.style.boxShadow = 'none';
                    imageElement.style.backgroundColor = '#FFFFFF';
                }
            }
            
            // Create temporary hidden div
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.appendChild(pdfContainer);
            document.body.appendChild(tempDiv);
            
            // Wait for images to load if any
            if (imageElement) {
                await new Promise((resolve) => {
                    if (imageElement.complete && imageElement.naturalHeight !== 0) {
                        resolve();
                    } else {
                        imageElement.onload = resolve;
                        imageElement.onerror = resolve; // Proceed even if image fails
                        
                        // Set a timeout in case the image doesn't load
                        setTimeout(resolve, 5000);
                    }
                });
            }
            
            // PDF generation options with smaller margins
            const opt = {
                margin: [0.25, 0.25, 0.4, 0.25], // Smaller margins: Top, right, bottom, left in inches
                filename: `${newspaperName.textContent.replace(/\s+/g, '-')}-${window.vintageDate.toLocaleDateString().replace(/\//g, '-')}.pdf`,
                image: { 
                    type: 'jpeg', 
                    quality: 1.0 
                },
                html2canvas: { 
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    allowTaint: true,
                    scrollY: 0,
                    backgroundColor: '#FFFFFF'
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait',
                    compress: true,
                    hotfixes: ["px_scaling"],
                    precision: 16,
                    background: '#FFFFFF'
                },
                pagebreak: { 
                    mode: ['avoid'],
                    avoid: ['img', 'blockquote', 'tr', 'h3']
                }
            };
            
            // Create worker for advanced options
            const worker = html2pdf().from(pdfContainer).set(opt);
            
            // Add header and footer to each page
            if (worker.footer) {
                worker.footer.height = '1cm';
                worker.footer.contents = (pageNum, numPages) => {
                    return `<div style="text-align: center; font-size: 10px; color: #666;">Page ${pageNum} of ${numPages}</div>`;
                };
            }
            
            // Generate the PDF in an optimized way
            await worker.toPdf().get('pdf').then((pdf) => {
                // Add metadata
                pdf.setProperties({
                    title: articleHeadline.textContent,
                    subject: `What If: ${scenarioInput.value || scenarioInput.placeholder}`,
                    creator: 'What If News Generator',
                    author: 'Alternate Reality News Generator'
                });
                
                return pdf;
            }).save();
            
            // Clean up
            document.body.removeChild(tempDiv);
            UI.showError('PDF downloaded successfully!');
            
        } catch (err) {
            console.error('Error generating PDF:', err);
            UI.showError('Failed to generate PDF: ' + (err.message || 'Unknown error'));
        }
    };
    
    // Function to clear history
    const clearHistory = () => {
        if (confirm('Are you sure you want to clear all your article history? This cannot be undone.')) {
            localStorage.removeItem('newsHistory');
            displayHistory(); // Refresh the history display
            UI.showError('History cleared successfully');
        }
    };
    
    // Initialize the application
    init();
    
    // Add CSS styles for the dateline
    const datelineStyles = document.createElement('style');
    datelineStyles.textContent = `
        .dateline {
            font-size: 1em;
            margin-bottom: 10px;
            text-indent: 0;
        }
        
        .dateline strong {
            text-transform: uppercase;
        }
        
        /* PDF-specific dateline styling */
        #pdf-container .dateline {
            font-size: 11px;
            margin-bottom: 8px;
            font-style: normal;
            font-family: "Times New Roman", Times, serif;
        }
    `;
    document.head.appendChild(datelineStyles);
});