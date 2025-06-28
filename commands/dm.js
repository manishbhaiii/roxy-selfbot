module.exports = {
    name: 'dm',
    aliases: ['d', 'pm'],
    description: 'Send a direct message to a user',
    category: 'User',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Get user ID (first argument after command)
        const userId = args[1]?.replace(/[^0-9]/g, '');
        if (!userId) {
            return message.reply('Please provide a valid user ID (numbers only).');
        }

        // Get the message (everything after user ID)
        const dmMessage = args.slice(2).join(' ');
        if (!dmMessage) {
            return message.reply('Please provide a message to send.');
        }

        try {
            // Try to fetch the user
            const user = await message.client.users.fetch(userId);
            if (!user) {
                return message.reply('Could not find that user.');
            }

            // Send the DM
            await user.send(dmMessage);
            
            // Send confirmation and delete after 5 seconds
            const reply = await message.reply(`✅ Message sent to ${user.tag}`);
            setTimeout(() => reply.delete().catch(() => {}), 5000);
        } catch (error) {
            console.error('Error sending DM:', error);
            if (error.code === 50007) {
                message.reply('Cannot send DM to this user. They might have DMs disabled or blocked me.');
            } else {
                message.reply('Failed to send DM. Make sure the user ID is valid and I can message them.');
            }
        }
    }
}; 