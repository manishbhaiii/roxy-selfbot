module.exports = {
    name: 'start',
    description: 'Disable stealth mode - brings the bot back online and re-enables all commands',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }
        
        // If not in stealth mode
        if (!commandManager.isStealthMode()) {
            return message.reply('✅ Bot is already online and fully operational.');
        }
        
        try {
            // Disable stealth mode
            commandManager.setStealthMode(false);
            
            // Set status back to online
            const client = message.client;
            await client.user.setStatus('online');
            
            // Restore custom activity if it was set previously
            try {
                await client.user.setActivity("chatting with friends", {
                    type: "CUSTOM",
                    state: "💭 chatting with friends"
                });
            } catch (error) {
                console.error('Error restoring status:', error);
            }
            
            // Send confirmation
            message.reply(`🟢 **Bot is now online**
- All commands are re-enabled
- Bot visibility restored
- Bot is fully operational`);
            
            console.log('Stealth mode deactivated by ' + message.author.tag);
        } catch (error) {
            console.error('Error deactivating stealth mode:', error);
            message.reply('❌ Error deactivating stealth mode. Check console for details.');
        }
    }
}; 