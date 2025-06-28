const fetch = require('node-fetch');

// Command categories and their corresponding API endpoints
const SFW_CATEGORIES = {
    'waifu': 'waifu',
    'neko': 'neko',
    'shinobu': 'shinobu',
    'megumin': 'megumin',
    'blush': 'blush',
    'smile': 'smile',
    'wave': 'wave',
    'happy': 'happy',
    'wink': 'wink',
    'poke': 'poke',
    'dance': 'dance',
    'cringe': 'cringe',
    'smug': 'smug',
    'bonk': 'bonk',
    'yeet': 'yeet',
    // Interaction commands
    'hug': 'hug',
    'kiss': 'kiss',
    'pat': 'pat',
    'cuddle': 'cuddle',
    'nom': 'nom',
    'highfive': 'highfive',
    'handhold': 'handhold',
    'bully': 'bully',
    'cry': 'cry',
    'awoo': 'awoo',
    'lick': 'lick',
    'bite': 'bite',
    'glomp': 'glomp',
    'slap': 'slap',
    'kill': 'kill',
    'kick': 'kick'
};

const NSFW_CATEGORIES = {
    'nsfwwaifu': 'waifu',
    'nsfwneko': 'neko',
    'trap': 'trap',
    'blowjob': 'blowjob'
};

// List of commands that involve mentioning another user
const MENTION_COMMANDS = [
    'hug', 'kiss', 'pat', 'cuddle', 'highfive', 'handhold',
    'bully', 'cry', 'awoo', 'lick', 'bite', 'glomp', 
    'slap', 'kill', 'kick'
];

async function handleSfwCommand(message, command, category, isMentionRequired) {
    try {
        // Check if this command requires a mention
        if (isMentionRequired) {
            // Check if user was mentioned
            const args = message.content.split(' ');
            if (message.mentions.users.size === 0 && args.length < 2) {
                return message.reply(`Please mention a user for the ${command} command. Example: !${command} @user`);
            }
            
            // Get the mentioned user
            const mentionedUser = message.mentions.users.first() || 
                                await message.client.users.fetch(args[1]).catch(() => null);
            
            if (!mentionedUser) {
                return message.reply(`Could not find that user. Please mention a valid user.`);
            }
        }
        
        // Fetch image from API
        const response = await fetch(`https://api.waifu.pics/sfw/${category}`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.url) {
            throw new Error('Invalid API response - no image URL found');
        }
        
        // Format response based on command type
        if (isMentionRequired) {
            const args = message.content.split(' ');
            const mentionedUser = message.mentions.users.first() || 
                                await message.client.users.fetch(args[1]).catch(() => null);
            
            return message.reply(`${message.author} ${command}s ${mentionedUser}\n${data.url}`);
        } else {
            // For non-mention commands, just send the image
            return message.reply(data.url);
        }
    } catch (error) {
        console.error(`Error in SFW command (${command}):`, error);
        return message.reply(`Sorry, there was an error fetching your ${command} image.`);
    }
}

async function handleNsfwCommand(message, command, category) {
    try {
        // Check if channel is NSFW
        if (!message.channel.nsfw) {
            return message.reply('❌ This command can only be used in NSFW channels.');
        }
        
        // Fetch image from API
        const response = await fetch(`https://api.waifu.pics/nsfw/${category}`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.url) {
            throw new Error('Invalid API response - no image URL found');
        }
        
        // Send the image
        return message.reply(data.url);
    } catch (error) {
        console.error(`Error in NSFW command (${command}):`, error);
        return message.reply(`Sorry, there was an error fetching your ${command} image.`);
    }
}

// Create commands for all SFW categories
const sfwCommands = Object.entries(SFW_CATEGORIES).map(([commandName, apiCategory]) => {
    return {
        name: commandName,
        description: `Get a ${commandName} anime image or GIF`,
        category: 'Fun',
        execute: async (message, args, commandManager) => {
            // Only process for allowed users
            if (!commandManager.isAllowedUser(message.author.id)) {
                return;
            }
            
            const isMentionRequired = MENTION_COMMANDS.includes(commandName);
            return handleSfwCommand(message, commandName, apiCategory, isMentionRequired);
        }
    };
});

// Create commands for all NSFW categories
const nsfwCommands = Object.entries(NSFW_CATEGORIES).map(([commandName, apiCategory]) => {
    return {
        name: commandName,
        description: `Get a NSFW ${commandName} anime image`,
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

// Combine and export all commands
module.exports = [...sfwCommands, ...nsfwCommands]; 