module.exports = {
    name: 'prefix',
    description: 'Manage bot command prefixes',
    category: 'System',
    execute(message, args, commandManager) {
        // Initialize prefix settings if they don't exist
        if (!commandManager.config.prefixes) {
            commandManager.config.prefixes = {
                main: '!',
                aliases: []
            };
            commandManager.saveConfig();
        }

        // Check if it's just "prefix" with no arguments and no prefix before it
        if (args.length === 1 && args[0] === 'prefix') {
            return message.reply(`My current prefix is \`${commandManager.config.prefixes.main}\``);
        }
        
        // If it's a prefixed command without subcommands
        if (args.length === 1) {
            return message.reply(`My current prefix is \`${commandManager.config.prefixes.main}\`\n\nUse \`${commandManager.config.prefixes.main}prefix set/add/delete/list\` to manage prefixes.`);
        }

        const subCommand = args[1].toLowerCase();
        
        if (subCommand === 'list') {
            const { main, aliases } = commandManager.config.prefixes;
            let prefixList = `🔹 **Main Prefix:** \`${main}\`\n`;
            
            if (aliases && aliases.length > 0) {
                prefixList += '🔸 **Alias Prefixes:**\n';
                aliases.forEach(alias => {
                    prefixList += `   \`${alias}\`\n`;
                });
            } else {
                prefixList += '🔸 **Alias Prefixes:** None';
            }
            
            return message.reply(prefixList);
        }
        
        else if (subCommand === 'set' && args.length >= 3) {
            const newPrefix = args[2];
            
            // Store the old main prefix as an alias if it's not already in the aliases
            if (!commandManager.config.prefixes.aliases.includes(commandManager.config.prefixes.main)) {
                commandManager.config.prefixes.aliases.push(commandManager.config.prefixes.main);
            }
            
            // Set the new main prefix
            commandManager.config.prefixes.main = newPrefix;
            commandManager.saveConfig();
            
            return message.reply(`Main prefix has been set to \`${newPrefix}\``);
        }
        
        else if (subCommand === 'add' && args.length >= 3) {
            const newAlias = args[2];
            
            // Check if the alias already exists
            if (commandManager.config.prefixes.main === newAlias) {
                return message.reply(`\`${newAlias}\` is already the main prefix.`);
            }
            
            if (commandManager.config.prefixes.aliases.includes(newAlias)) {
                return message.reply(`\`${newAlias}\` is already an alias prefix.`);
            }
            
            // Add the new alias
            commandManager.config.prefixes.aliases.push(newAlias);
            commandManager.saveConfig();
            
            return message.reply(`Added \`${newAlias}\` as an alias prefix.`);
        }
        
        else if (subCommand === 'delete' && args.length >= 3) {
            const aliasToDelete = args[2];
            
            // Check if trying to delete the main prefix
            if (commandManager.config.prefixes.main === aliasToDelete) {
                return message.reply(`Cannot delete the main prefix. Use \`${commandManager.config.prefixes.main}prefix set\` to change it.`);
            }
            
            // Check if the alias exists
            const aliasIndex = commandManager.config.prefixes.aliases.indexOf(aliasToDelete);
            if (aliasIndex === -1) {
                return message.reply(`\`${aliasToDelete}\` is not an alias prefix.`);
            }
            
            // Remove the alias
            commandManager.config.prefixes.aliases.splice(aliasIndex, 1);
            commandManager.saveConfig();
            
            return message.reply(`Removed \`${aliasToDelete}\` from alias prefixes.`);
        }
        
        else {
            const prefix = commandManager.getMainPrefix();
            return message.reply(`\`${prefix}prefix set/list/add/delete\` - Manage command prefixes`);
        }
    }
}; 