const qrcode = require('qrcode');

module.exports = {
    name: 'qrgenerate',
    description: 'Converts text into a QR code image',
    category: 'System',
    async execute(message, args, commandManager) {
        // Check if text is provided
        if (args.length < 2) {
            return message.reply('Please provide text to convert into a QR code. Usage: `!qrgenerate <text>`');
        }

        // Get the text from the args
        const text = args.slice(1).join(' ');
        
        try {
            // Send initial processing message
            const processingMsg = await message.reply('Generating QR code...');
            
            // Generate QR code as buffer
            const qrBuffer = await qrcode.toBuffer(text, {
                errorCorrectionLevel: 'H',
                margin: 1,
                scale: 8
            });
            
            // Send the QR code as an attachment
            await processingMsg.edit({
                content: `QR Code for: ${text.length > 50 ? text.substring(0, 50) + '...' : text}`,
                files: [{
                    attachment: qrBuffer,
                    name: 'qrcode.png'
                }]
            });
            
            // Log for debugging
            console.log(`QR code generated for: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
            
        } catch (error) {
            console.error('Error executing qrgenerate command:', error);
            message.reply('There was an error generating the QR code.');
        }
    }
}; 