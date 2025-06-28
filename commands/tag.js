module.exports = {
    name: 'tag',
    description: 'Configure if AI requires mentions to respond',
    category: 'Control',
    execute(message, args, commandManager) {
        if (args.length < 2) {
            message.reply('Usage: !tag off (Disables tag requirement) or !tag on (Enables tag requirement)');
            return;
        }

        if (args[1] === 'off') {
            if (!commandManager.config.tagOff.includes(message.channel.id)) {
                commandManager.config.tagOff.push(message.channel.id);
                message.reply('Bot will now respond to all messages in this channel.');
            } else {
                message.reply('Tag requirement is already disabled for this channel.');
            }
        } else if (args[1] === 'on') {
            const index = commandManager.config.tagOff.indexOf(message.channel.id);
            if (index > -1) {
                commandManager.config.tagOff.splice(index, 1);
                message.reply('Bot will now only respond when mentioned in this channel.');
            } else {
                message.reply('Tag requirement is already enabled for this channel.');
            }
        } else {
            message.reply('Invalid option. Use: on or off');
            return;
        }

        commandManager.saveConfig();
    }
}; 