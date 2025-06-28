module.exports = {
    name: 'stop',
    description: 'Enable stealth mode - bot goes offline and ignores all commands except essential ones',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }
        
        // If already in stealth mode
        if (commandManager.isStealthMode()) {
            return; // Silently ignore
        }
        
        try {
            // Delete the command message to keep things stealthy
            await message.delete().catch(() => {});
            
            // Enable stealth mode
            commandManager.setStealthMode(true);
            
            // Set status to offline/invisible
            const client = message.client;
            await client.user.setStatus('invisible');
            
            // No confirmation message - complete silence
            
            console.log('Stealth mode activated by ' + message.author.tag);
        } catch (error) {
            console.error('Error activating stealth mode:', error);
            // No error messages sent to maintain stealth
        }
    }
}; 