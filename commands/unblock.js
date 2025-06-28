module.exports = {
    name: 'unblock',
    description: 'Unblock a user to allow AI responses again',
    category: 'User Management',
    execute(message, args, commandManager) {
        if (args.length < 2) {
            message.reply('Usage: !unblock <user ID or mention>');
            return;
        }

        let userId = args[1].replace(/[<@!>]/g, '');
        const index = commandManager.config.blockedUsers.indexOf(userId);
        
        if (index === -1) {
            message.reply(`User ${args[1]} is not blocked.`);
            return;
        }
        
        commandManager.config.blockedUsers.splice(index, 1);
        message.reply(`User ${args[1]} has been unblocked.`);
        commandManager.saveConfig();
    }
}; 