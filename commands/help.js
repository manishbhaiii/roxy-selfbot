module.exports = {
    name: 'help',
    description: 'Shows list of all available commands',
    category: 'System',
    async execute(message, args, commandManager) {
        const prefix = commandManager.getMainPrefix();
        const { getSignature } = require('../utils/song');
        
        // If a category is specified, show only that category
        if (args.length > 1) {
            const category = args[1].toLowerCase();
            return this.showCategoryHelp(message, category, prefix, args);
        }
        
        // Otherwise show the main help menu with categories
        const mainHelpText = `
**🤖 Command Categories**

Use \`${prefix}help <category>\` to see commands in each category:

🛠️ \`${prefix}help ai\` - AI control commands
👥 \`${prefix}help user\` - User management commands
🔄 \`${prefix}help clone\` - Channel msg cloning commands
💤 \`${prefix}help status\` - Status and AFK commands
📊 \`${prefix}help system\` - System and utility commands
🔍 \`${prefix}help github\` - GitHub search and lookup commands
🎮 \`${prefix}help shapes\` - Shapes API commands
😊 \`${prefix}help fun\` - waifu image commands maybe
🎵 \`${prefix}help music\` - Music commands (not working properly but still useful)
💫 \`${prefix}help reaction\` - Auto-reaction commands

${getSignature()}`;

        message.reply(mainHelpText);
    },
    
    async showCategoryHelp(message, category, prefix, args) {
        let helpText = '';
        
        switch (category) {
            case 'ai':
                helpText = `
**🛠️ AI Control Commands**

\`${prefix}ai on/off\` - Enable/disable AI in current channel
\`${prefix}ai all on/off\` - Enable/disable AI for all channels in server
\`${prefix}ai global on/off\` - Enable/disable AI globally
\`${prefix}ai list\` - Show where AI features are enabled
\`${prefix}tag off\` - Make AI reply to all messages (no mention needed)`;
                break;
                
            case 'user':
                helpText = `
**👥 User Management Commands**

\`${prefix}block <user>\` - Block a user from receiving AI responses
\`${prefix}unblock <user>\` - Unblock a user
\`${prefix}dm <user_id> <message>\` - Send a DM to a user`;
                break;
                
            case 'clone':
                helpText = `
**🔄 Channel Cloning Commands**

\`${prefix}clone msg <channel_id>\` - Clone messages from a channel to logging server
\`${prefix}clone msg delete <channel_id>\` - Stop cloning channel
\`${prefix}clone msg list\` - List all active cloners`;
                break;
                
            case 'status':
                helpText = `
**💤 Status & AFK Commands**

**🎮 Rich Presence**
• \`${prefix}rpc on/off\` - Enable/disable Rich Presence
• \`${prefix}rpc <type> <text> <imageURL>\` - Set custom status
Types: PLAYING, STREAMING, LISTENING, WATCHING

**💫 Status & AFK**
• \`${prefix}afk <reason>\` - Set your AFK status
• \`${prefix}status <online/idle/dnd/offline> [emoji] [text]\` - Set status

**Examples:**
• \`${prefix}rpc PLAYING genshin https://example.com/genshin.png\`
• \`${prefix}status dnd 🎮 Gaming\`
• \`${prefix}afk busy with my wife Raiden Shogun\``;
                break;
                
            case 'system':
                helpText = `
**📊 System Commands**

\`${prefix}help\` - bruhh u know already
\`${prefix}ping\` - Check latency, uptime, and system info
\`${prefix}stats\` - View message count and voice channel uptime
\`${prefix}prefix set/list/add/delete\` - Manage command prefixes
\`${prefix}purge <number>\` - Delete your own messages
\`${prefix}ytsearch <query>\` - Search YouTube for videos
\`${prefix}iplookup <ip>\` - Look up information about an IP address
\`${prefix}ascii <text>\` - Generate ASCII art from text
\`${prefix}qrgenerate <text>\` - Converts text into a QR code image
\`${prefix}vc join/leave <channel_id>\` - Join or leave voice channels

**🛑 Control Commands:**
\`${prefix}stop\` - Enable stealth mode (offline + silent operation)
\`${prefix}start\` - Disable stealth mode and bring bot back online
\`${prefix}shutdown\` - Completely shut down bot (requires manual restart)`;
                break;
                
            case 'github':
                helpText = `
**🔍 GitHub Commands**

\`${prefix}gitsearch <repo-name>\` - Search for GitHub repositories
\`${prefix}gituser <username>\` - Get GitHub user profile information`;
                break;
                
            case 'shapes':
                helpText = `
**🎮 Shapes API Commands**

\`${prefix}reset\` - Reset the Shape's long-term memory
\`${prefix}sleep\` - Generate a long-term memory on demand
\`${prefix}dashboard\` - Access Shape's configuration dashboard
\`${prefix}info\` - Get information about the shape
\`${prefix}web\` - Search the web
\`${prefix}imagine\` - Generate images
\`${prefix}wack\` - Reset the Shape's short-term memory
\`${prefix}img <text>\` - Generate an image with text prompt`;
                break;

            case 'music':
                helpText = `
**🎵 Music Commands**

🎧 **Voice Channel**
• \`${prefix}vc join <id>\` - Join a voice channel
• \`${prefix}vc leave\` - Leave voice channel

🎵 **Playback**
• \`${prefix}play <name>\` - Play a song
• \`${prefix}mstop\` - Stop playback
• \`${prefix}skip\` - Skip current song
• \`${prefix}all play\` - Play all songs (random)

📁 **Management**
• \`${prefix}music list\` - Browse songs (paginated)
• \`${prefix}supload [name]\` - Upload MP3 file

💡 **Quick Start:**
1. Join voice: \`${prefix}vc join <id>\`
2. List songs: \`${prefix}music list\`
3. Play song: \`${prefix}play songname\`

📝 **Note:** Upload songs with \`!supload\` + MP3 file attachment`;
                break;
                
            case 'fun':
                helpText = `
**😊 Anime Image Commands**

Use \`${prefix}help fun sfw\`, \`${prefix}help fun interaction\`, or \`${prefix}help fun nsfw\` for detailed command lists.

**SFW Commands** (all channels): \`${prefix}waifu\`, \`${prefix}neko\`, \`${prefix}shinobu\` and more
**Interaction Commands** (requires @mentioning another user)
\`${prefix}hug @user\` - Hug someone
\`${prefix}kiss @user\` - Kiss someone
\`${prefix}pat @user\` - Headpat someone
\`${prefix}cuddle @user\` - Cuddle someone
\`${prefix}highfive @user\` - High-five someone
\`${prefix}handhold @user\` - Hold hands with someone
\`${prefix}bully @user\` - Bully someone
\`${prefix}cry @user\` - Cry with someone
\`${prefix}awoo @user\` - Awoo at someone
\`${prefix}lick @user\` - Lick someone
\`${prefix}bite @user\` - Bite someone
\`${prefix}glomp @user\` - Glomp someone
\`${prefix}slap @user\` - Slap someone
\`${prefix}kill @user\` - Kill someone
\`${prefix}kick @user\` - Kick someone
\`${prefix}nom @user\` - Nom someone`;
                
                // Handle subcategories
                const funSubcategory = args[2]?.toLowerCase();

                if (funSubcategory === 'nsfw') {
                    helpText = `
**🔞 NSFW Anime Commands**
(These commands only work in age-restricted/NSFW channels)

🌸 **Waifu.pics API:**
\`${prefix}nsfwwaifu\` - NSFW waifu image
\`${prefix}nsfwneko\` - NSFW neko image
\`${prefix}trap\` - Trap image
\`${prefix}blowjob\` - Anime NSFW gif

🍥 **Nekobot API (all NSFW):**
\`${prefix}holo2\` - Holo image
\`${prefix}hneko2\` - Holo neko image
\`${prefix}neko2\` - Neko image
\`${prefix}hkitsune2\` - Kitsune image
\`${prefix}kemonomimi2\` - Kemonomimi image
\`${prefix}kanna2\` - Kanna image
\`${prefix}gah2\` - Reaction image
\`${prefix}coffee2\` - Coffee image
\`${prefix}food2\` - Food image
\`${prefix}cosplay2\` - Cosplay image
\`${prefix}swimsuit2\` - Swimsuit image
\`${prefix}4k2\` - 4K image
\`${prefix}hass\` - Hentai ass
\`${prefix}hmidriff\` - Hentai midriff
\`${prefix}pgif\` - NSFW gif
\`${prefix}hentai\` - Hentai image
\`${prefix}anal\` - Anal image
\`${prefix}hanal\` - Hentai anal
\`${prefix}gonewild\` - NSFW image
\`${prefix}ass\` - Ass image
\`${prefix}pussy\` - NSFW image
\`${prefix}thigh\` - Thigh image
\`${prefix}hthigh\` - Hentai thigh
\`${prefix}paizuri\` - Paizuri image
\`${prefix}tentacle\` - Tentacle image
\`${prefix}boobs\` - Boobs image
\`${prefix}hboobs\` - Hentai boobs
\`${prefix}yaoi\` - Yaoi image
\`${prefix}pantsu\` - Pantsu image
\`${prefix}nakadashi\` - Nakadashi image`;
                } else if (funSubcategory === 'sfw') {
                    helpText = `
**😊 SFW Anime Image Commands**

🌸 **Waifu.pics API:**
\`${prefix}waifu\` - Random waifu image
\`${prefix}neko\` - Random neko image
\`${prefix}shinobu\` - Shinobu image
\`${prefix}megumin\` - Megumin image
\`${prefix}smile\` - Smile gif
\`${prefix}wave\` - Waving gif
\`${prefix}happy\` - Happy gif
\`${prefix}wink\` - Wink gif
\`${prefix}poke\` - Poke gif
\`${prefix}dance\` - Dance gif
\`${prefix}cringe\` - Cringe gif
\`${prefix}smug\` - Smug face gif
\`${prefix}bonk\` - Bonk gif
\`${prefix}yeet\` - Yeet gif
\`${prefix}blush\` - Anime blush gif`;
                } else if (funSubcategory === 'interaction') {
                    helpText = `
**👥 Interaction Anime Commands**
(All of these require @mentioning another user)

\`${prefix}hug @user\` - Hug someone
\`${prefix}kiss @user\` - Kiss someone
\`${prefix}pat @user\` - Headpat someone
\`${prefix}cuddle @user\` - Cuddle someone
\`${prefix}highfive @user\` - High-five someone
\`${prefix}handhold @user\` - Hold hands with someone
\`${prefix}bully @user\` - Bully someone
\`${prefix}cry @user\` - Cry with someone
\`${prefix}awoo @user\` - Awoo at someone
\`${prefix}lick @user\` - Lick someone
\`${prefix}bite @user\` - Bite someone
\`${prefix}glomp @user\` - Glomp someone
\`${prefix}slap @user\` - Slap someone
\`${prefix}kill @user\` - Kill someone
\`${prefix}kick @user\` - Kick someone
\`${prefix}nom @user\` - Nom someone`;
                }
                break;
                
            case 'reaction':
                helpText = `
**💫 Auto-Reaction Commands**

\`${prefix}reaction on/off [channel_id]\` - Enable/disable reactions in current/specified channel
\`${prefix}reaction all on/off\` - Enable/disable reactions for all channels in server
\`${prefix}reaction global on/off\` - Enable/disable reactions globally
\`${prefix}reaction add <text> <emoji(s)>\` - Add text trigger for auto-reactions
\`${prefix}reaction <user_id> <emoji(s)>\` - Set user-specific reactions
\`${prefix}reaction list\` - Show current reaction settings
\`${prefix}reaction delete <text/user_id>\` - Delete a reaction rule

**Examples:**
1. Enable in current channel: \`${prefix}reaction on\`
2. Enable in specific channel: \`${prefix}reaction on 123456789\`
3. Add text trigger: \`${prefix}reaction add hello 👋 😊\`
4. Set user reactions: \`${prefix}reaction 123456789 🌟 💖\``;
                break;
                
            default:
                helpText = `Unknown category. Use \`${prefix}help\` to see available categories.`;
                break;
        }
        
        if (helpText) {
            message.reply(helpText);
        } else {
            message.reply(`Unknown category. Use \`${prefix}help\` to see all categories.`);
        }
    }
};