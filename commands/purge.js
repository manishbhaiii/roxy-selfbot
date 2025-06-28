module.exports = {
    name: 'purge',
    description: 'Delete a specified number of your own messages',
    category: 'Utility',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if a number is provided
        if (args.length < 2 || isNaN(args[1])) {
            return message.reply('Please provide a valid number of messages to delete. Usage: `!purge <number>`');
        }

        // Get the number of messages to delete (max 100 to avoid API abuse)
        const deleteCount = Math.min(parseInt(args[1]), 100);
        
        try {
            // Send a temporary message
            const tempMsg = await message.reply(`Searching for your ${deleteCount} most recent messages...`);
            
            // Get the channel to operate in
            const channel = message.channel;
            
            let messagesDeleted = 0;
            let lastMessageId = message.id;
            
            // Keep fetching and deleting until we have the requested number
            while (messagesDeleted < deleteCount) {
                // Fetch messages before the last message we processed
                const fetchedMessages = await channel.messages.fetch({ 
                    limit: 100,
                    before: lastMessageId 
                });
                
                if (fetchedMessages.size === 0) break; // No more messages to check
                
                // Filter for messages by the automation account (message.client.user.id)
                const userMessages = fetchedMessages.filter(m => m.author.id === message.client.user.id);
                const messagesToDelete = Array.from(userMessages.values())
                    .slice(0, deleteCount - messagesDeleted);
                
                // Update the last message ID for next fetch
                lastMessageId = fetchedMessages.last().id;
                
                // Delete the filtered messages
                for (const msg of messagesToDelete) {
                    try {
                        await msg.delete();
                        messagesDeleted++;
                        
                        // Add a small delay to avoid rate limits
                        await new Promise(resolve => setTimeout(resolve, 500)); // Reduced delay for user accounts
                        
                        if (messagesDeleted >= deleteCount) break;
                    } catch (error) {
                        console.error(`Failed to delete message ${msg.id}:`, error);
                    }
                }
                
                if (fetchedMessages.size < 100) break; // No more messages to fetch
            }
            
            // Delete the command message itself if it's from our account
            if (message.author.id === message.client.user.id) {
                try {
                    await message.delete();
                    messagesDeleted++;
                } catch (error) {
                    console.error('Failed to delete command message:', error);
                }
            }

            // Delete the temporary message after all other messages are deleted
            setTimeout(() => {
                if (tempMsg.author.id === message.client.user.id) {
                    tempMsg.delete().catch(err => console.error('Failed to delete temp message:', err));
                }
            }, 2000);
            
            // Only notify for successful deletion if we deleted any messages
            if (messagesDeleted > 0) {
                const successMsg = await channel.send(`✅ Successfully deleted ${messagesDeleted} message(s).`);
                
                // Delete the success message after a delay if it's from our account
                setTimeout(() => {
                    if (successMsg.author.id === message.client.user.id) {
                        successMsg.delete().catch(err => console.error('Failed to delete success message:', err));
                    }
                }, 3000);
            }
        } catch (error) {
            console.error('Error executing purge command:', error);
            
            // Send error message and delete it after delay
            const errorMsg = await message.channel.send('There was an error trying to delete messages.');
            setTimeout(() => {
                if (errorMsg.author.id === message.client.user.id) {
                    errorMsg.delete().catch(err => console.error('Failed to delete error message:', err));
                }
            }, 3000);
        }
    }
}; 