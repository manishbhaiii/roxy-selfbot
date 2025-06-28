module.exports = {
    name: 'ai',
    description: 'Enable or disable AI responses',
    category: 'Control',
    async execute(message, args, commandManager) {
        if (args.length < 2) {
            message.reply('Usage: !ai <on/off/list> or !ai <all/global> <on/off>');
            return;
        }

        const subCommand = args[1].toLowerCase();
        
        // Handle "list" subcommand
        if (subCommand === 'list') {
            // Use the dedicated ailist command
            const ailistCommand = commandManager.commands.get('ailist');
            if (ailistCommand) {
                await ailistCommand.execute(message, args, commandManager);
                return;
            }
            return;
        }
        
        // Handle on/off commands
        const setting = subCommand === 'on';
        
        if (args.length === 2) {
            // Not "list" but either "on" or "off"
            if (subCommand !== 'on' && subCommand !== 'off') {
                message.reply('Invalid option. Use: on, off, list, all on, all off, global on, or global off');
                return;
            }
            
            // Channel-specific setting
            commandManager.config.ai.perChannel[message.channel.id] = setting;
            message.reply(`AI responses ${setting ? 'enabled' : 'disabled'} for this channel.`);
        } else if (subCommand === 'all') {
            // Guild-specific setting
            if (!message.guild) {
                message.reply('This command can only be used in a server.');
                return;
            }
            commandManager.config.ai.perGuild[message.guild.id] = args[2] === 'on';
            message.reply(`AI responses ${args[2] === 'on' ? 'enabled' : 'disabled'} for all channels in this server.`);
        } else if (subCommand === 'global') {
            // Global setting
            commandManager.config.ai.global = args[2] === 'on';
            message.reply(`AI responses ${args[2] === 'on' ? 'enabled' : 'disabled'} globally.`);
        } else {
            message.reply('Invalid option. Use: on, off, list, all on, all off, global on, or global off');
            return;
        }

        commandManager.saveConfig();
    }
}; 