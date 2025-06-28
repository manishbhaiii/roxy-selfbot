const fs = require('fs');
const path = require('path');
const { joinVoiceChannel } = require('@discordjs/voice');

// Track active voice connections
let activeVC = null;
let joinTime = null;

module.exports = {
    name: 'vc',
    aliases: ['v', 'voice'],
    description: 'Join or leave voice channels',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Get the action (first argument after command)
        const action = args[1]?.toLowerCase();
        
        // Load stats
        let stats = {};
        const statsPath = path.join(__dirname, '..', 'stats.json');
        if (fs.existsSync(statsPath)) {
            stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        }

        // Initialize VC stats if not exists
        if (!stats.voiceActivity) {
            stats.voiceActivity = {
                totalTime: 0,
                sessions: []
            };
        }

        try {
            if (action === 'join' || action === 'j') {
                // Get channel ID (second argument after command)
                const channelId = args[2]?.replace(/[^0-9]/g, '');
                if (!channelId) {
                    return message.reply('Please provide a valid channel ID.');
                }

                // Leave current VC if in one
                if (activeVC) {
                    await this.leaveAndUpdateStats(message.client, stats);
                }

                try {
                    const channel = await message.client.channels.fetch(channelId);
                    if (!channel || !channel.isVoice()) {
                        return message.reply('Invalid voice channel.');
                    }

                    // Join the voice channel
                    const connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator,
                        selfDeaf: false,
                        selfMute: false
                    });

                    activeVC = {
                        channel: channel,
                        connection: connection
                    };
                    joinTime = Date.now();

                    const reply = await message.reply(`✅ Joined voice channel: ${channel.name}`);
                    setTimeout(() => reply.delete().catch(() => {}), 5000);
                } catch (joinError) {
                    console.error('Error joining voice channel:', joinError);
                    message.reply('Failed to join voice channel. Please check permissions.');
                }
            }
            else if (action === 'leave' || action === 'l') {
                if (!activeVC) {
                    return message.reply('Not in a voice channel.');
                }

                await this.leaveAndUpdateStats(message.client, stats);
                const reply = await message.reply('✅ Left voice channel');
                setTimeout(() => reply.delete().catch(() => {}), 5000);
            }
            else {
                message.reply('Usage: `!vc join/leave <channel_id>` or `!v j/l <channel_id>`');
            }
        } catch (error) {
            console.error('Error handling voice command:', error);
            message.reply('Failed to execute voice command. Make sure the channel ID is valid.');
        }
    },

    async leaveAndUpdateStats(client, stats) {
        if (activeVC && joinTime) {
            // Calculate duration
            const duration = Date.now() - joinTime;
            
            // Update stats
            stats.voiceActivity.totalTime += duration;
            stats.voiceActivity.sessions.push({
                channelId: activeVC.channel.id,
                channelName: activeVC.channel.name,
                guildId: activeVC.channel.guild.id,
                guildName: activeVC.channel.guild.name,
                startTime: new Date(joinTime).toISOString(),
                endTime: new Date().toISOString(),
                duration: duration
            });

            // Save stats
            const statsPath = path.join(__dirname, '..', 'stats.json');
            fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));

            // Destroy the connection
            if (activeVC.connection) {
                activeVC.connection.destroy();
            }
            activeVC = null;
            joinTime = null;
        }
    }
}; 