module.exports = {
    name: 'ailist',
    description: 'List all servers and channels where AI features are enabled',
    category: 'Control',
    async execute(message, args, commandManager) {
        // Initialize response sections
        let sections = [];
        let hasEnabledFeatures = false;
        
        // Check global AI status
        if (commandManager.config.ai.global) {
            sections.push('🌎 **Global AI is enabled**');
            hasEnabledFeatures = true;
        }
        
        // Check server-specific settings (only enabled ones)
        const enabledServers = Object.entries(commandManager.config.ai.perGuild)
            .filter(([_, enabled]) => enabled);
            
        if (enabledServers.length > 0) {
            let serversText = '📁 **Servers with AI enabled:**\n';
            
            for (const [guildId, _] of enabledServers) {
                try {
                    const guild = await message.client.guilds.fetch(guildId).catch(() => null);
                    const serverName = guild ? guild.name : `Unknown Server (${guildId})`;
                    serversText += `✅ ${serverName}\n`;
                } catch (error) {
                    serversText += `✅ Unknown Server (${guildId})\n`;
                }
            }
            
            sections.push(serversText);
            hasEnabledFeatures = true;
        }
        
        // Check channel-specific settings (only enabled ones)
        const enabledChannels = Object.entries(commandManager.config.ai.perChannel)
            .filter(([_, enabled]) => enabled);
            
        if (enabledChannels.length > 0) {
            let channelsText = '💬 **Channels with AI enabled:**\n';
            
            for (const [channelId, _] of enabledChannels) {
                try {
                    const channel = await message.client.channels.fetch(channelId).catch(() => null);
                    
                    if (channel) {
                        if (channel.type === 'DM') {
                            channelsText += `✅ DM with ${channel.recipient?.username || 'User'}\n`;
                        } else {
                            // Use a clickable channel mention
                            channelsText += `✅ <#${channelId}>\n`;
                        }
                    } else {
                        channelsText += `✅ Unknown Channel (${channelId})\n`;
                    }
                } catch (error) {
                    channelsText += `✅ Unknown Channel (${channelId})\n`;
                }
            }
            
            sections.push(channelsText);
            hasEnabledFeatures = true;
        }
        
        // Check tag-off channels (these are always "enabled" features)
        if (commandManager.config.tagOff.length > 0) {
            let tagOffText = '🏷️ **Channels where tag is not required:**\n';
            
            for (const channelId of commandManager.config.tagOff) {
                try {
                    const channel = await message.client.channels.fetch(channelId).catch(() => null);
                    
                    if (channel) {
                        if (channel.type === 'DM') {
                            tagOffText += `✅ DM with ${channel.recipient?.username || 'User'}\n`;
                        } else {
                            // Use a clickable channel mention
                            tagOffText += `✅ <#${channelId}>\n`;
                        }
                    } else {
                        tagOffText += `✅ Unknown Channel (${channelId})\n`;
                    }
                } catch (error) {
                    tagOffText += `✅ Unknown Channel (${channelId})\n`;
                }
            }
            
            sections.push(tagOffText);
            hasEnabledFeatures = true;
        }
        
        // Check if there are any enabled features
        if (!hasEnabledFeatures) {
            return message.reply('📊 **AI Settings Overview**\n\nNo AI features are currently enabled.');
        }
        
        // Combine all sections
        const fullStatus = `
📊 **AI Settings Overview**

${sections.join('\n\n')}`;
        
        message.reply(fullStatus);
    }
}; 