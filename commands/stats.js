module.exports = {
    name: 'stats',
    description: 'View message and user statistics',
    category: 'System',
    execute(message, args, commandManager) {
        // Get fresh stats
        const stats = commandManager.getStats();
        
        // Check if it's a new day and reset daily stats if needed
        const today = new Date().toDateString();
        if (today !== stats.lastResetDay) {
            stats.dailyMessages = 0;
            stats.dailyUsers = [];
            stats.lastResetDay = today;
            commandManager.saveStats(stats);
        }

        // Format voice activity stats
        let voiceStats = '';
        if (stats.voiceActivity) {
            // Calculate total hours and minutes
            const totalMs = stats.voiceActivity.totalTime;
            const hours = Math.floor(totalMs / (1000 * 60 * 60));
            const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
            
            // Only show hours if there are any
            const totalTimeStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
            
            // Get today's sessions
            const todaySessions = stats.voiceActivity.sessions.filter(session => {
                const sessionDate = new Date(session.startTime).toDateString();
                return sessionDate === today;
            });

            if (todaySessions.length > 0) {
                // Group sessions by channel to save space
                const channelSessions = {};
                todaySessions.forEach(session => {
                    const key = `${session.channelName}|${session.guildName}`;
                    if (!channelSessions[key]) {
                        channelSessions[key] = {
                            totalDuration: 0,
                            count: 0,
                            channelName: session.channelName,
                            guildName: session.guildName
                        };
                    }
                    channelSessions[key].totalDuration += session.duration;
                    channelSessions[key].count++;
                });

                // Format voice stats more concisely
                voiceStats = `\n\n🎤 **Voice Activity**
• Total Time: \`${totalTimeStr}\`
• Today's Sessions:`;

                // Add each channel's summary
                Object.values(channelSessions).forEach(channelData => {
                    const duration = Math.floor(channelData.totalDuration / 1000);
                    const minutes = Math.floor(duration / 60);
                    const seconds = duration % 60;
                    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
                    
                    voiceStats += `\n  └ **${channelData.channelName}** (${channelData.guildName}): \`${timeStr}\` (${channelData.count}x)`;
                });
            } else {
                voiceStats = `\n\n🎤 **Voice Activity**\n• Total Time: \`${totalTimeStr}\`\n• No sessions today`;
            }
        }

        // Format AI chat stats
        let aiStats = '';
        if (stats.aiChat) {
            const totalChats = stats.aiChat.totalInteractions || 0;
            const todayChats = stats.aiChat.dailyInteractions || 0;
            const avgResponseTime = stats.aiChat.averageResponseTime || 0;
            
            aiStats = `\n\n🤖 **AI Chat Stats**
• Today: \`${todayChats}\` interactions
• Total: \`${totalChats}\` interactions
• Avg Response: \`${Math.round(avgResponseTime)}ms\``;
        }

        const statsEmbed = `📊 **AI Assistant Statistics**
• Messages Today: \`${stats.dailyMessages}\` (${stats.dailyUsers.length} users)
• Total Messages: \`${stats.totalMessages}\` (${stats.allTimeUsers.length} users)
• Uptime: \`${commandManager.formatUptime()}\`${voiceStats}${aiStats}`;

        message.reply(statsEmbed);
    }
}; 