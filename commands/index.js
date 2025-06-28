const fs = require('fs');
const path = require('path');

class CommandManager {
    constructor() {
        this.commands = new Map();
        this.config = require('../config.json');
        this.configPath = path.join(__dirname, '../config.json');
        this.statsPath = path.join(__dirname, '../stats.json');
        this.startTime = Date.now();
        this.stealthMode = false;
        this.essentialCommands = ['start', 'stop', 'afk', 'clone'];
        
        // Initialize prefixes if they don't exist
        if (!this.config.prefixes) {
            this.config.prefixes = {
                main: '!',
                aliases: []
            };
            this.saveConfig();
        }

        // Initialize stats if they don't exist
        this.initializeStats();
    }

    initializeStats() {
        if (!fs.existsSync(this.statsPath)) {
            const defaultStats = {
                totalMessages: 0,
                dailyMessages: 0,
                lastResetDay: new Date().toDateString(),
                uniqueUsers: [],
                dailyUsers: [],
                allTimeUsers: [],
                voiceActivity: {
                    totalTime: 0,
                    sessions: []
                }
            };
            this.saveStats(defaultStats);
        }
    }

    getStats() {
        try {
            // Always read fresh data from file
            delete require.cache[require.resolve('../stats.json')];
            const stats = require('../stats.json');
            
            // Ensure all required properties exist
            return {
                totalMessages: stats.totalMessages || 0,
                dailyMessages: stats.dailyMessages || 0,
                lastResetDay: stats.lastResetDay || new Date().toDateString(),
                uniqueUsers: Array.isArray(stats.uniqueUsers) ? stats.uniqueUsers : [],
                dailyUsers: Array.isArray(stats.dailyUsers) ? stats.dailyUsers : [],
                allTimeUsers: Array.isArray(stats.allTimeUsers) ? stats.allTimeUsers : [],
                voiceActivity: stats.voiceActivity || { totalTime: 0, sessions: [] }
            };
        } catch (error) {
            console.error('Error reading stats:', error);
            return {
                totalMessages: 0,
                dailyMessages: 0,
                lastResetDay: new Date().toDateString(),
                uniqueUsers: [],
                dailyUsers: [],
                allTimeUsers: [],
                voiceActivity: {
                    totalTime: 0,
                    sessions: []
                }
            };
        }
    }

    saveStats(stats) {
        try {
            // Ensure stats has the right format
            const statsToSave = {
                ...stats,
                uniqueUsers: Array.isArray(stats.uniqueUsers) ? stats.uniqueUsers : [],
                dailyUsers: Array.isArray(stats.dailyUsers) ? stats.dailyUsers : [],
                allTimeUsers: Array.isArray(stats.allTimeUsers) ? stats.allTimeUsers : [],
                voiceActivity: stats.voiceActivity || { totalTime: 0, sessions: [] }
            };
            fs.writeFileSync(this.statsPath, JSON.stringify(statsToSave, null, 2));
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    saveConfig() {
        fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2));
    }

    updateStats(userId) {
        // Get fresh stats
        const stats = this.getStats();
        
        // Check if it's a new day
        const today = new Date().toDateString();
        if (today !== stats.lastResetDay) {
            stats.dailyMessages = 0;
            stats.dailyUsers = [];
            stats.lastResetDay = today;
        }

        // Update message counts
        stats.totalMessages++;
        stats.dailyMessages++;

        // Update user tracking
        if (!stats.dailyUsers.includes(userId)) {
            stats.dailyUsers.push(userId);
        }
        
        if (!stats.allTimeUsers.includes(userId)) {
            stats.allTimeUsers.push(userId);
        }

        this.saveStats(stats);
    }

    formatUptime() {
        const uptime = Date.now() - this.startTime;
        const days = Math.floor(uptime / (24 * 60 * 60 * 1000));
        const hours = Math.floor((uptime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((uptime % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((uptime % (60 * 1000)) / 1000);

        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    isAllowedUser(userId) {
        return this.config.allowedUserIds.includes(userId);
    }

    isUserBlocked(userId) {
        return this.config.blockedUsers.includes(userId);
    }

    isAIEnabled(channelId, guildId) {
        if (this.config.ai.perChannel[channelId] !== undefined) {
            return this.config.ai.perChannel[channelId];
        }

        if (this.config.ai.perGuild[guildId] !== undefined) {
            return this.config.ai.perGuild[guildId];
        }

        return this.config.ai.global;
    }

    isTagRequired(channelId) {
        return !this.config.tagOff.includes(channelId);
    }

    getPrefixes() {
        return [
            this.config.prefixes.main,
            ...this.config.prefixes.aliases
        ];
    }

    getMainPrefix() {
        return this.config.prefixes.main;
    }

    startsWithPrefix(content) {
        const prefixes = this.getPrefixes();
        return prefixes.some(prefix => content.startsWith(prefix));
    }

    getCommandName(content) {
        const prefixes = this.getPrefixes();
        
        for (const prefix of prefixes) {
            if (content.startsWith(prefix)) {
                const withoutPrefix = content.substring(prefix.length);
                return withoutPrefix.split(' ')[0].toLowerCase();
            }
        }
        
        return null;
    }

    loadCommands() {
        const commandFiles = fs.readdirSync(__dirname)
            .filter(file => file !== 'index.js' && file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`./${file}`);
            this.registerCommand(command);
        }

        console.log(`Loaded ${this.commands.size} commands.`);
    }

    registerCommand(command) {
        // If it's an array of commands, register each one
        if (Array.isArray(command)) {
            command.forEach(cmd => {
                if (!cmd.name) {
                    console.error(`Command is missing a name: ${cmd}`);
                    return;
                }
                this.commands.set(cmd.name, cmd);
            });
            return;
        }
        
        // Handle single command
        if (!command.name) {
            console.error(`Command is missing a name: ${command}`);
            return;
        }
        
        this.commands.set(command.name, command);
    }

    handleCommand(message) {
        if (!this.isAllowedUser(message.author.id)) {
            return false;
        }

        const content = message.content.toLowerCase();
        
        // If in stealth mode, only process essential commands (silently)
        if (this.stealthMode) {
            const commandName = this.getCommandName(content);
            if (!commandName) {
                return false;
            }
            
            const command = this.commands.get(commandName);
            if (!command) {
                return false;
            }
            
            if (!this.essentialCommands.includes(command.name)) {
                return false;
            }
        }

        // Get command name and args
        const prefix = this.getPrefixes().find(p => content.startsWith(p));
        if (!prefix) return false;

        // Remove the prefix and split into command and args
        const withoutPrefix = content.slice(prefix.length);
        const args = withoutPrefix.split(' ').filter(arg => arg.length > 0);
        if (args.length === 0) return false;

        const commandName = args[0];
        const command = this.commands.get(commandName);

        if (!command) {
            return false;
        }

        try {
            command.execute(message, args, this);
            return true;
        } catch (error) {
            console.error('Error executing command:', error);
            message.reply('There was an error executing that command.').catch(console.error);
            return true;
        }
    }

    // Stealth mode control methods
    setStealthMode(value) {
        this.stealthMode = value;
    }

    isStealthMode() {
        return this.stealthMode;
    }
}

module.exports = new CommandManager(); 