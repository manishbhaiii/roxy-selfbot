const figlet = require('figlet');
const util = require('util');

// Convert figlet.text to a Promise
const figletPromise = util.promisify(figlet.text);

module.exports = {
    name: 'ascii',
    description: 'Generate ASCII art from text',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if text is provided
        if (args.length < 2) {
            return message.reply('Please provide text to convert. Usage: `!ascii <text>`');
        }

        // Get the text from the args
        const text = args.slice(1).join(' ');
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply(`Generating ASCII art...`);
            
            // Generate ASCII art using figlet with the default font
            const asciiArt = await figletPromise(text);
            
            // Format the response with a code block
            const formattedResponse = `\`\`\`\n${asciiArt}\n\`\`\``;
            
            // Update the processing message with the result
            await processingMsg.edit(formattedResponse);
            
            // Log for debugging
            console.log(`ASCII art generated for: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
            
        } catch (error) {
            console.error('Error executing ascii command:', error);
            message.reply('There was an error generating the ASCII art.');
        }
    }
}; 