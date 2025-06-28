const fetch = require('node-fetch');

module.exports = {
    name: 'gitsearch',
    description: 'Search for GitHub repositories by name',
    category: 'GitHub',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if a search query is provided
        if (args.length < 2) {
            return message.reply('Please provide a repository name to search. Usage: `!gitsearch <repo-name>`');
        }

        // Get the search query (all arguments after the command)
        const query = args.slice(1).join(' ');
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply(`Searching GitHub for "${query}"...`);
            
            // Make request to the GitHub API
            const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Discord-Selfbot'
                }
            });
            
            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                return processingMsg.edit(`Error searching GitHub: ${errorData.message}`);
            }
            
            const data = await response.json();
            
            // Check if any repositories were found
            if (data.items.length === 0) {
                return processingMsg.edit(`No repositories found for "${query}".`);
            }
            
            // Get the top 3 repositories (or fewer if less than 3 were found)
            const topRepos = data.items.slice(0, 3);
            
            // Format the response
            let formattedResponse = `**Top ${topRepos.length} GitHub repositories for "${query}":**\n\n`;
            
            topRepos.forEach((repo, index) => {
                formattedResponse += `**${index + 1}. [${repo.full_name}](${repo.html_url})**\n`;
                formattedResponse += `${repo.description ? repo.description : 'No description'}\n`;
                formattedResponse += `⭐ ${repo.stargazers_count.toLocaleString()} | 🔀 ${repo.forks_count.toLocaleString()} | ${repo.language || 'No primary language'}\n\n`;
            });
            
            // Update the processing message with the result
            await processingMsg.edit(formattedResponse);
            
            // Log search for debugging
            console.log(`GitHub search: "${query}" - Found ${data.total_count} repositories`);
            
        } catch (error) {
            console.error('Error executing gitsearch command:', error);
            message.reply('There was an error searching GitHub repositories.');
        }
    }
}; 