const fetch = require('node-fetch');

module.exports = {
    name: 'iplookup',
    description: 'Look up information about an IP address',
    category: 'Utility',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }

        // Check if IP address is provided
        if (args.length < 2) {
            return message.reply('Please provide an IP address. Usage: `!iplookup <ip>`');
        }

        // Get the IP address from the args
        const ipAddress = args[1];
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply(`Looking up information for IP: ${ipAddress}...`);
            
            // Make request to the IP API
            const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
            const data = await response.json();
            
            // Check if the request was successful
            if (data.status === 'fail') {
                return processingMsg.edit(`Error: ${data.message} for IP "${ipAddress}"`);
            }
            
            // Format the response
            const locationInfo = [
                `**IP Address**: ${ipAddress}`,
                `**Country**: ${data.country} (${data.countryCode})`,
                `**Region**: ${data.regionName} (${data.region})`,
                `**City**: ${data.city}`,
                `**Zip Code**: ${data.zip || 'N/A'}`,
                `**Timezone**: ${data.timezone}`,
                `**ISP**: ${data.isp}`,
                `**Organization**: ${data.org || 'N/A'}`,
                `**Coordinates**: ${data.lat}, ${data.lon}`,
                `**Maps Link**: [View on Maps](https://www.google.com/maps?q=${data.lat},${data.lon})`
            ].join('\n');
            
            // Update the processing message with the result
            await processingMsg.edit(locationInfo);
            
            // Log for debugging
            console.log(`IP Lookup: "${ipAddress}" - Result: ${data.country}, ${data.city}`);
            
        } catch (error) {
            console.error('Error executing iplookup command:', error);
            message.reply('There was an error looking up the IP address information.');
        }
    }
}; 