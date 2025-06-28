module.exports = {
    name: 'status',
    description: 'Set custom status and presence',
    category: 'System',
    execute(message, args, commandManager) {
        if (args.length < 2) {
            message.reply('Usage: !status <online/idle/dnd/offline> [emoji] [status text]');
            return;
        }

        const status = args[1].toUpperCase();
        const validStatuses = ['ONLINE', 'IDLE', 'DND', 'OFFLINE'];
        
        if (!validStatuses.includes(status)) {
            message.reply('Invalid status. Use: online, idle, dnd, or offline');
            return;
        }

        // Extract emoji and status text
        const statusText = args.slice(2).join(' ');
        message.client.user.setStatus(status.toLowerCase());

        if (statusText) {
            message.client.user.setActivity(statusText, {
                type: "CUSTOM",
                state: statusText
            });
            message.reply(`Status updated to: ${status.toLowerCase()} with message: ${statusText}`);
        } else {
            message.reply(`Status updated to: ${status.toLowerCase()}`);
        }
    }
}; 