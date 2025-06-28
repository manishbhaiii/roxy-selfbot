const OpenAI = require('openai');
require('dotenv').config();

class ShapesAPI {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.SHAPES_API_KEY,
            baseURL: "https://api.shapes.inc/v1"
        });
        this.model = `shapesinc/${process.env.SHAPES_USERNAME || 'default'}`;
    }

    async generateResponse(message, userId, channelId = null) {
        try {
            const headers = {
                'X-User-Id': userId
            };
            
            if (channelId) {
                headers['X-Channel-Id'] = channelId;
            }

            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: message }],
                headers: headers
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error calling Shapes API:', error.message);
            throw error;
        }
    }

    async handleCommand(command, userId) {
        // Return null for help command to let commandHandler handle it
        if (command === '!help') {
            return null;
        }

        const supportedCommands = ['!reset', '!sleep', '!dashboard', '!info', '!web', '!imagine', '!wack'];
        
        if (!supportedCommands.includes(command)) {
            return null; // Return null for unsupported commands to let main handler take over
        }

        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{ role: 'user', content: command }],
                headers: {
                    'X-User-Id': userId
                }
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error processing command:', error.message);
            throw error;
        }
    }

    async processImageMessage(textContent, imageUrl, userId) {
        try {
            const response = await this.client.chat.completions.create({
                model: this.model,
                messages: [{
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: textContent
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: imageUrl
                            }
                        }
                    ]
                }],
                headers: {
                    'X-User-Id': userId
                }
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Error processing image message:', error.message);
            throw error;
        }
    }
}

module.exports = new ShapesAPI(); 