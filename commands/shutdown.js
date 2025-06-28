module.exports = {
    name: 'shutdown',
    description: 'Completely shut down the bot, requires manual restart',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }
        
        // Ask for confirmation
        const confirmMsg = await message.reply(`⚠️ **Warning: Shutdown Requested**
- This will completely terminate the bot
- It will require a manual restart from the hosting panel
- Are you sure? Reply with \`yes\` within 10 seconds to confirm`);
        
        // Create a filter to only collect responses from the original author
        const filter = m => m.author.id === message.author.id && 
                           (m.content.toLowerCase() === 'yes' || m.content.toLowerCase() === 'cancel');
        
        try {
            // Wait for response
            const collected = await message.channel.awaitMessages({
                filter,
                max: 1,
                time: 10000,
                errors: ['time']
            });
            
            const response = collected.first();
            
            // If confirmed, shut down
            if (response.content.toLowerCase() === 'yes') {
                await message.reply('💥 **Shutdown confirmed**\nTerminating bot process... Goodbye!');
                console.log('Shutdown command executed by ' + message.author.tag);
                
                // Allow the message to be sent before shutting down
                setTimeout(() => {
                    process.exit(0);
                }, 1000);
            } else {
                await message.reply('✅ Shutdown cancelled.');
            }
        } catch (error) {
            // If no response within time limit
            await confirmMsg.edit(`⏱️ **Shutdown request timed out**\nNo confirmation received within 10 seconds.`);
        }
    }
}; 