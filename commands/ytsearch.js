const ytSearch = require('yt-search');

module.exports = {
    name: 'ytsearch',
    description: 'Search YouTube and return the first result',
    category: 'Utility',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if a search query is provided
        if (args.length < 2) {
            return message.reply('Please provide a search query. Usage: `!ytsearch <query>`');
        }

        // Get the search query (all arguments after the command)
        const searchQuery = args.slice(1).join(' ');
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply(`Searching YouTube for "${searchQuery}"...`);
            
            // Perform the search
            const searchResults = await ytSearch(searchQuery);
            
            // Get the videos from the results
            const videos = searchResults.videos;
            
            // Check if any videos were found
            if (videos.length === 0) {
                return processingMsg.edit(`No videos found for "${searchQuery}".`);
            }
            
            // Get the first video
            const firstVideo = videos[0];
            
            // Format the response as requested: [video title](link)
            const formattedResponse = `[${firstVideo.title}](${firstVideo.url})`;
            
            // Update the processing message with the result
            await processingMsg.edit(formattedResponse);
            
            // Log search for debugging
            console.log(`YouTube search: "${searchQuery}" - Result: ${firstVideo.title} (${firstVideo.url})`);
            
        } catch (error) {
            console.error('Error executing ytsearch command:', error);
            message.reply('There was an error searching YouTube.');
        }
    }
}; 