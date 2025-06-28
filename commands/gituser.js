const fetch = require('node-fetch');

module.exports = {
    name: 'gituser',
    description: 'Get information about a GitHub user',
    category: 'GitHub',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if a username is provided
        if (args.length < 2) {
            return message.reply('Please provide a GitHub username. Usage: `!gituser <username>`');
        }

        // Get the username from the args
        const username = args[1];
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply(`Fetching GitHub profile for "${username}"...`);
            
            // Make request to the GitHub API
            const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Discord-Selfbot'
                }
            });
            
            // Check if the user was found
            if (response.status === 404) {
                return processingMsg.edit(`User not found: ${username}`);
            }
            
            // Check if the request was successful
            if (!response.ok) {
                const errorData = await response.json();
                return processingMsg.edit(`Error retrieving GitHub user: ${errorData.message}`);
            }
            
            const data = await response.json();
            
            // Format the response
            const userInfo = [
                `**GitHub Profile: [${data.login}](${data.html_url})**`,
                data.avatar_url ? `**Avatar:** [Link](${data.avatar_url})` : '',
                `**Name:** ${data.name || 'Not specified'}`,
                `**Bio:** ${data.bio || 'Not specified'}`,
                `**Location:** ${data.location || 'Not specified'}`,
                `**Company:** ${data.company || 'Not specified'}`,
                `**Public Repos:** ${data.public_repos}`,
                `**Public Gists:** ${data.public_gists}`,
                `**Followers:** ${data.followers}`,
                `**Following:** ${data.following}`,
                `**Created:** ${new Date(data.created_at).toDateString()}`,
                data.blog ? `**Website/Blog:** [Link](${data.blog.startsWith('http') ? data.blog : `https://${data.blog}`})` : ''
            ].filter(Boolean).join('\n');
            
            // Update the processing message with the result
            await processingMsg.edit(userInfo);
            
            // Log for debugging
            console.log(`GitHub User: "${username}" - Found ${data.login}`);
            
        } catch (error) {
            console.error('Error executing gituser command:', error);
            message.reply('There was an error fetching the GitHub user information.');
        }
    }
}; 