module.exports = {
    name: 'block',
    description: 'Block a user from receiving AI responses',
    category: 'User Management',
    execute(message, args, commandManager) {
        if (args.length < 2) {
            message.reply('Usage: !block <user ID or mention>');
            return;
        }

        let userId = args[1].replace(/[<@!>]/g, '');
        
        if (commandManager.config.blockedUsers.includes(userId)) {
            message.reply(`User ${args[1]} is already blocked.`);
            return;
        }

        commandManager.config.blockedUsers.push(userId);
        message.reply(`User ${args[1]} has been blocked from receiving AI responses.`);
        commandManager.saveConfig();
    }
}; 