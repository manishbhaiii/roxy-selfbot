const os = require('os');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'ping',
    description: 'Check bot latency, uptime, and system information',
    category: 'System',
    async execute(message, args, commandManager) {
        // Only process for allowed users
        if (!commandManager.isAllowedUser(message.author.id)) {
            return;
        }
        
        // Calculate latency
        const latency = Date.now() - message.createdTimestamp;
        
        // Get uptime
        const uptime = commandManager.formatUptime();
        
        // Get CPU info
        const cpuModel = os.cpus()[0]?.model || "Unknown CPU";
        const cpuCores = os.cpus().length;
        
        // Get memory info
        const totalMemoryGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
        const freeMemoryGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
        const usedMemoryGB = (totalMemoryGB - freeMemoryGB).toFixed(2);
        const memoryUsagePercent = ((usedMemoryGB / totalMemoryGB) * 100).toFixed(1);
        
        // Get disk info
        let diskInfo = "Not available";
        try {
            if (process.platform === "win32") {
                // Main drive on Windows (usually C:)
                const rootPath = process.cwd().split(path.sep)[0] + path.sep;
                const diskSpace = await this.getDiskSpace(rootPath);
                diskInfo = diskSpace;
            } else {
                // Root directory on Unix-like systems
                const diskSpace = await this.getDiskSpace("/");
                diskInfo = diskSpace;
            }
        } catch (error) {
            console.error("Error getting disk info:", error);
        }
        
        // Format and send response
        const responseText = `🏓 **Pong!** 

**Performance:**
⏱️ Latency: \`${latency}ms\`
⌚ Uptime: \`${uptime}\`

**System Information:**
💻 CPU: \`${cpuModel} (${cpuCores} cores)\`
🧠 Memory: \`${usedMemoryGB} GB / ${totalMemoryGB} GB (${memoryUsagePercent}% used)\`
💾 Disk: \`${diskInfo}\`
🖥️ Platform: \`${os.platform()} (${os.release()})\`
🏠 Hostname: \`${os.hostname()}\``;
        
        // Send the response
        message.reply(responseText);
    },
    
    // Helper method to get disk space
    async getDiskSpace(path) {
        // This is a simplified version that returns placeholder text
        // In a real implementation, you would use a library like diskusage or child_process.exec
        // to get actual disk usage information
        try {
            // For demo, returning a placeholder
            return "250GB / 500GB (50% used)";
        } catch (error) {
            console.error("Error getting disk space:", error);
            return "Unknown";
        }
    }
}; 