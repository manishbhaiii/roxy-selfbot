const shapesAPI = require('../shapes.js');

// Import the URL processing function
function processShapesFileUrls(message) {
    if (!message) return message;
    
    // Regex to match Shapes file URLs 
    const shapesUrlRegex = /https:\/\/files\.shapes\.inc\/[^\s)]+/g;
    
    // Find all URLs
    const urls = message.match(shapesUrlRegex);
    
    // If no URLs found, return original message
    if (!urls || urls.length === 0) return message;
    
    // Get the first URL (we'll only use one)
    const url = urls[0];
    
    // First, remove all Shapes URLs
    let cleanedMessage = message.replace(shapesUrlRegex, '');
    
    // Then, clean up any remaining markdown formatting or brackets
    cleanedMessage = cleanedMessage
        .replace(/\[\]\(\)/g, '')               // Remove empty []()
        .replace(/\[\.?\](?:\(\))?/g, '')       // Remove [.] or [] with or without ()
        .replace(/\[link\]/gi, '')              // Remove [link] case insensitive
        .replace(/\[\s*\]/g, '')                // Remove [ ] with any spaces inside
        .replace(/\(\s*\)/g, '')                // Remove ( ) with any spaces inside
        .replace(/\s+$/g, '')                   // Remove trailing whitespace
        .replace(/\s*\[\s*\]\s*/g, ' ');        // Replace any remaining [] with space
    
    // Add a hidden period link at the end
    return cleanedMessage.trim() + ` [.](${url})`;
}

module.exports = {
    name: 'img',
    description: 'Generate an image response using Shapes API',
    category: 'Shapes',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if text is provided
        if (args.length < 1) {
            return message.reply('Please provide some text for the image generation. Usage: `!img <text>`');
        }

        try {
            // Get the full text by joining all arguments
            const text = args.join(' ');
            
            // Create the full command text as it would be sent to Shapes
            const fullCommand = `!img ${text}`;
            
            // Send initial response to show we're processing
            const processingMsg = await message.reply('🎨 Generating image response...');
            
            try {
                // Use the existing ShapesAPI instance to handle the command
                const response = await shapesAPI.generateResponse(fullCommand, message.author.id, message.channel.id);
                
                // Process the response to handle Shapes file URLs
                const processedResponse = processShapesFileUrls(response);
                
                // Update the message with the processed API response
                await processingMsg.edit(processedResponse || 'No response from Shapes API');
            } catch (error) {
                console.error('Error calling Shapes API:', error);
                await processingMsg.edit('Sorry, there was an error generating the image response. Please try again later.');
            }
        } catch (error) {
            console.error('Error in img command:', error);
            message.reply('There was an error processing your request. Please try again later.');
        }
    }
}; 