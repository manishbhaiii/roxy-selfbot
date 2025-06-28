const fetch = require('node-fetch');

// All nekobot commands are NSFW
const NSFW_CATEGORIES = {
    // Previously SFW categories
    'holo2': 'holo',
    'hneko2': 'hneko',
    'neko2': 'neko',
    'hkitsune2': 'hkitsune',
    'kemonomimi2': 'kemonomimi',
    'kanna2': 'kanna',
    'gah2': 'gah',
    'coffee2': 'coffee',
    'food2': 'food',
    'cosplay2': 'cosplay',
    'swimsuit2': 'swimsuit',
    '4k2': '4k',
    // Original NSFW categories
    'hass': 'hass',
    'hmidriff': 'hmidriff',
    'pgif': 'pgif',
    'hentai': 'hentai',
    'anal': 'anal',
    'hanal': 'hanal',
    'gonewild': 'gonewild',
    'ass': 'ass',
    'pussy': 'pussy',
    'thigh': 'thigh',
    'hthigh': 'hthigh',
    'paizuri': 'paizuri',
    'tentacle': 'tentacle',
    'boobs': 'boobs',
    'hboobs': 'hboobs',
    'yaoi': 'yaoi',
    'pantsu': 'pantsu',
    'nakadashi': 'nakadashi'
};

async function handleNsfwCommand(message, command, category) {
    try {
        // Check if channel is NSFW
        if (!message.channel.nsfw) {
            return message.reply('❌ This command can only be used in NSFW channels.');
        }
        
        // Fetch image from API
        const response = await fetch(`https://nekobot.xyz/api/image?type=${category}`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.message) {
            throw new Error('Invalid API response - no image URL found');
        }
        
        // Send the image
        return message.reply(data.message);
    } catch (error) {
        console.error(`Error in NSFW command (${command}):`, error);
        return message.reply(`Sorry, there was an error fetching your ${command} image.`);
    }
}

// Create commands for all NSFW categories
const nsfwCommands = Object.entries(NSFW_CATEGORIES).map(([commandName, apiCategory]) => {
    return {
        name: commandName,
        description: `Get a NSFW ${commandName} anime image from nekobot API`,
        category: 'Fun',
        execute: async (message, args, commandManager) => {
            // Only process for allowed users
            if (!commandManager.isAllowedUser(message.author.id)) {
                return;
            }
            
            return handleNsfwCommand(message, commandName, apiCategory);
        }
    };
});

// Export all commands
module.exports = nsfwCommands; 